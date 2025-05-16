import { defineStore } from 'pinia'
import { encryptData, decryptData } from './crypto'
import { achievementTiers, upgrades, collectibles } from './upgrades'

export const useGameStore = defineStore('game', {
  state: () => ({
    // 游戏基本资源
    coins: 0,
    // 上次点击的时间
    lastClickTime: 0,
    // 金币点击和被动收入
    coinsPerClick: 1,
    coinsPerSecond: 0,
    // 游戏升级项
    upgrades: [],
    // 收藏品系统
    collectibles: [],
    // 游戏成就
    achievements: [],
    // 成就生成参数
    achievementTiers: {},
    // 游戏统计数据
    stats: {
      totalClicks: 0,
      totalCoinsEarned: 0,
      totalUpgradesPurchased: 0,
      criticalHits: 0,
      gameStartTime: Date.now(),
      lastSaveTime: Date.now(),
    },
    // 新增游戏设置
    settings: {
      autoSave: true, // 自动保存
      autoSaveInterval: 60000, // 自动保存间隔（毫秒）
    },
    // 游戏通知
    notifications: [],
    autoSaveInterval: null, // 自动保存定时器
    passiveIncomeInterval: null, // 被动收入定时器
    passiveSpeedMultiplier: 0,
    collectibleClickPowerBonus: 0,
    collectiblePassiveIncomeBonus: 0,
    collectibleCritChanceBonus: 0,
    collectibleCritMultiplierBonus: 0,
  }),
  getters: {
    // 计算升级的当前成本
    getUpgradeCost: (state) => (upgradeId) => {
      const upgrade = state.upgrades.find((u) => u.id === upgradeId)
      if (!upgrade) return 0
      return Math.floor(
        upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level)
      )
    },
    // 检查是否能够购买升级
    canBuyUpgrade: (state) => (upgradeId) => {
      const upgrade = state.upgrades.find((u) => u.id === upgradeId)
      if (!upgrade) return false
      // 检查是否达到最大等级
      if (upgrade.maxLevel && upgrade.level >= upgrade.maxLevel) return false
      const cost = state.getUpgradeCost(upgradeId)
      return state.coins >= cost
    },
    // 游戏时长（毫秒）
    playTime: (state) => {
      return Date.now() - state.stats.gameStartTime
    },
    // 获取总收入增幅
    totalIncomeMultiplier: (state) => {
      const goldMultiplierUpgrade = state.upgrades.find((u) => u.id === 4)
      let multiplier = 1 + (goldMultiplierUpgrade ? goldMultiplierUpgrade.level * goldMultiplierUpgrade.effect : 0)
      // 添加收藏品收入增幅
      multiplier *= state.collectibleIncomeMultiplier
      return multiplier
    },
    // 获取暴击几率
    criticalHitChance: (state) => {
      const critUpgrade = state.upgrades.find((u) => u.id === 3)
      let chance = critUpgrade ? critUpgrade.level * critUpgrade.effect : 0
      // 添加收藏品加成
      chance += state.collectibleCritChanceBonus
      // 确保几率不超过100%
      return Math.min(chance, 1.0)
    },
    // 获取暴击倍率
    criticalHitMultiplier: (state) => {
      const critPowerUpgrade = state.upgrades.find((u) => u.id === 6)
      let multiplier = 2.0 + (critPowerUpgrade ? critPowerUpgrade.level * critPowerUpgrade.effect : 0)
      // 添加收藏品加成
      multiplier += state.collectibleCritPowerBonus
      return multiplier
    },
    // 获取金币磁铁几率
    extraCoinsChance: (state) => {
      const magnetUpgrade = state.upgrades.find((u) => u.id === 7)
      let chance = magnetUpgrade ? magnetUpgrade.level * magnetUpgrade.effect : 0
      // 确保几率不超过100%
      return Math.min(chance, 1.0)
    },
    // 获取幸运加成倍率
    luckMultiplier: (state) => {
      const luckUpgrade = state.upgrades.find((u) => u.id === 9)
      let multiplier =
        1 + (luckUpgrade ? luckUpgrade.level * luckUpgrade.effect : 0)
      // 添加收藏品加成
      multiplier += state.collectibleLuckBonus
      return multiplier
    },
    // 获取黄金点击几率
    goldenClickChance: (state) => {
      const goldenClickUpgrade = state.upgrades.find((u) => u.id === 10)
      let chance = goldenClickUpgrade ? goldenClickUpgrade.level * goldenClickUpgrade.effect : 0
      // 添加收藏品加成
      chance += state.collectibleGoldenChanceBonus
      // 确保几率不超过100%
      return Math.min(chance, 1)
    },
    // 从收藏品中获得的收入乘数加成
    collectibleIncomeMultiplier: (state) => {
      return state.collectibles
        .filter((item) => item.level && item.effect.type === 'incomeMultiplier')
        .reduce((sum, item) => item.level * item.effect.value, 1.0)
    },
    // 从收藏品中获得的暴击倍率加成
    collectibleCritPowerBonus: (state) => {
      return state.collectibles
        .filter((item) => item.level && item.effect.type === 'critPower')
        .reduce((sum, item) => item.level * item.effect.value, 0)
    },
    // 从收藏品中获得的被动速度加成
    collectiblePassiveSpeedBonus: (state) => {
      return state.collectibles
        .filter((item) => item.level && item.effect.type === 'passiveSpeed')
        .reduce((sum, item) => item.level * item.effect.value, 0)
    },
    // 从收藏品中获得的幸运加成
    collectibleLuckBonus: (state) => {
      return state.collectibles
        .filter((item) => item.level && item.effect.type === 'luckBoost')
        .reduce((sum, item) => item.level * item.effect.value, 0)
    },
    // 从收藏品中获得的黄金点击几率加成
    collectibleGoldenChanceBonus: (state) => {
      return state.collectibles
        .filter((item) => item.level && item.effect.type === 'goldenChance')
        .reduce((sum, item) => item.level * item.effect.value, 0)
    },
  },
  actions: {
    // 升级收藏品
    buyCollectible (collectibleId) {
      // 查找收藏品
      const collectible = this.collectibles.find((c) => c.id === collectibleId)
      // 检查收藏品是否存在
      if (!collectible) {
        this.addNotification({
          type: 'error',
          title: '升级失败',
          message: '该收藏品不存在',
          duration: 3000,
        })
        return false
      }
      // 检查金币是否足够
      if (this.coins < collectible.cost) {
        this.addNotification({
          type: 'error',
          title: '金币不足',
          message: `需要 ${this.formatNumber(collectible.cost)} 金币才能升级 ${collectible.name
            }`,
          duration: 3000,
        })
        return false
      }
      // 扣除金币
      this.coins -= collectible.cost
      collectible.level++
      // 升级成本增长
      collectible.cost *= 1.5
      // 重新计算所有收藏品加成
      this.calculateCollectibleBonuses()
      // 保存游戏
      this.saveGame()
      // 发送通知
      this.addNotification({
        type: 'success',
        title: '升级成功',
        message: `你获得了 ${collectible.name}Lv.${collectible.level}`,
        duration: 5000,
      })
      return true
    },
    // 初始化成就系统
    initAchievements () {
      // 如果成就已经初始化过，则不再重复初始化
      if (this.achievements.length > 0) return
      // 为每种成就类型初始化第一批成就
      for (const type in achievementTiers) {
        achievementTiers[type].forEach((tier, index) => {
          this.achievements.push({
            id: `${type}_${tier.tier}`,
            name: tier.name,
            description: this.getAchievementDescription(type, tier.requirement),
            requirement: tier.requirement,
            type: type,
            tier: tier.tier,
            unlocked: false,
            reward: tier.reward,
          })
        })
      }
    },
    // 生成成就描述
    getAchievementDescription (type, requirement) {
      switch (type) {
        case 'totalCoins':
          return `累计获得 ${this.formatNumber(requirement)} 枚金币`
        case 'totalClicks':
          return `累计点击 ${this.formatNumber(requirement)} 次`
        case 'totalUpgrades':
          return `购买总共 ${requirement} 次升级`
        default:
          return '完成特殊任务'
      }
    },
    // 生成下一级成就
    generateNextTierAchievement (type, lastTier) {
      // 获取当前类型最高层级的成就
      const highestTier = achievementTiers[type][achievementTiers[type].length - 1]
      // 计算新的层级、需求和奖励
      const newTier = highestTier.tier + 1
      const newRequirement = highestTier.requirement * 10 // 需求增长10倍
      const newReward = highestTier.reward * 2 // 奖励增长2倍
      // 根据类型生成新的成就名称
      let newName = ''
      switch (type) {
        case 'totalCoins':
          newName = `传奇富豪 ${newTier - 5}级`
          break
        case 'totalClicks':
          newName = `点击传奇 ${newTier - 5}级`
          break
        case 'totalUpgrades':
          newName = `升级传奇 ${newTier - 5}级`
          break
      }
      // 创建新的成就模板
      const newTierData = {
        tier: newTier,
        requirement: newRequirement,
        reward: newReward,
        name: newName,
      }
      // 添加到成就等级表中
      achievementTiers[type].push(newTierData)
      // 创建并添加新成就
      const newAchievement = {
        id: `${type}_${newTier}`,
        name: newName,
        description: this.getAchievementDescription(type, newRequirement),
        requirement: newRequirement,
        type: type,
        tier: newTier,
        unlocked: false,
        reward: newReward,
      }
      this.achievements.push(newAchievement)
      return newAchievement
    },
    // 点击获取金币
    clickForCoins () {
      // 计算上次点击事件和这次点击的时间相差
      const timeDifference = Date.now() - this.lastClickTime
      // 如果时间差小于0.1秒，则视为无效点击
      if (timeDifference <= 100)
        return {
          amount: 0,
          isCritical: false,
          isGoldenClick: false,
          hasExtraCoins: false,
        }
      // 获取基础点击收益和应用收藏品加成
      let baseCoins = this.coinsPerClick + this.collectibleClickPowerBonus
      let isCritical = false
      let isGoldenClick = false
      let hasExtraCoins = false
      // 检查是否触发暴击
      if (Math.random() < this.criticalHitChance) {
        baseCoins *= this.criticalHitMultiplier // 使用暴击倍率而不是固定值
        this.stats.criticalHits++
        isCritical = true
      }
      // 检查是否触发黄金点击（超级点击）
      if (Math.random() < this.goldenClickChance) {
        baseCoins *= 10 // 黄金点击固定10倍收益
        isGoldenClick = true
        // 添加黄金点击通知
        this.addNotification({
          type: 'golden',
          title: '黄金点击！',
          message: '你触发了黄金点击，获得10倍金币！',
          duration: 3000,
        })
      }
      // 检查是否触发金币磁铁效果
      if (Math.random() < this.extraCoinsChance) {
        const extraAmount = baseCoins * 0.5 // 额外获得50%金币
        baseCoins += extraAmount
        hasExtraCoins = true
      }
      // 应用收入增幅
      baseCoins *= this.totalIncomeMultiplier
      // 应用幸运加成（只对随机奖励生效）
      if (isCritical || isGoldenClick || hasExtraCoins) {
        baseCoins *= this.luckMultiplier
      }
      this.coins += baseCoins
      this.stats.totalCoinsEarned += baseCoins
      this.stats.totalClicks++
      // 检查成就
      this.checkAchievements()
      this.lastClickTime = Date.now()
      // 返回点击数据供UI使用
      return {
        amount: baseCoins,
        isCritical,
        isGoldenClick,
        hasExtraCoins,
      }
    },
    // 购买升级
    buyUpgrade (upgradeId) {
      const upgrade = this.upgrades.find((u) => u.id === upgradeId)
      if (!upgrade) return false
      // 检查是否达到最大等级
      if (upgrade.maxLevel && upgrade.level >= upgrade.maxLevel) return false
      const cost = this.getUpgradeCost(upgradeId)
      if (this.coins < cost) return false
      this.coins -= cost
      upgrade.level++
      this.stats.totalUpgradesPurchased++
      // 应用升级效果
      if (upgradeId === 1) {
        this.coinsPerClick += upgrade.effect
      } else if (upgradeId === 2) {
        this.coinsPerSecond += upgrade.effect
      }
      // 检查成就
      this.checkAchievements()
      return true
    },
    // 自动收集器的更新（每秒调用）
    updatePassiveIncome (deltaTime = 1) {
      // 获取基础被动收入和应用收藏品加成
      let baseIncome = this.coinsPerSecond + this.collectiblePassiveIncomeBonus
      // 应用被动加速效果
      const effectiveDeltaTime = deltaTime * this.passiveSpeedMultiplier || 1
      // 计算被动收入并应用收入增幅
      let income = baseIncome * effectiveDeltaTime * this.totalIncomeMultiplier
      this.coins += income
      this.stats.totalCoinsEarned += income
      // 检查成就
      this.checkAchievements()
      return income
    },
    // 检查成就解锁
    checkAchievements () {
      const newUnlocks = []
      this.achievements.forEach((achievement) => {
        if (achievement.unlocked) return
        let requirementMet = false
        // 根据成就类型检查条件
        switch (achievement.type) {
          case 'totalCoins':
            requirementMet =
              this.stats.totalCoinsEarned >= achievement.requirement
            break
          case 'totalClicks':
            requirementMet = this.stats.totalClicks >= achievement.requirement
            break
          case 'totalUpgrades':
            requirementMet =
              this.stats.totalUpgradesPurchased >= achievement.requirement
            break
        }
        if (requirementMet) {
          achievement.unlocked = true
          this.coins += achievement.reward
          newUnlocks.push(achievement)
          // 添加通知
          this.addNotification({
            type: 'achievement',
            title: '成就解锁！',
            message: `成就"${achievement.name}"已解锁，获得${achievement.reward}金币奖励。`,
            duration: 5000,
          })
          // 检查是否需要生成下一级成就
          const highestTierAchievement = this.getHighestTierAchievement(achievement.type)
          if (highestTierAchievement.id === achievement.id) {
            // 如果这是当前类型的最高等级成就，则生成新的更高等级成就
            const newAchievement = this.generateNextTierAchievement(achievement.type, achievement.tier)
            // 添加新成就通知
            this.addNotification({
              type: 'info',
              title: '新成就解锁！',
              message: `新的${achievement.type === 'totalCoins' ? '金币' : achievement.type === 'totalClicks' ? '点击' : '升级'}成就已解锁：${newAchievement.name}`,
              duration: 5000,
            })
          }
        }
      })
      return newUnlocks
    },
    // 获取某个类型中等级最高的成就
    getHighestTierAchievement (type) {
      let highest = null
      let highestTier = 0
      this.achievements.forEach((achievement) => {
        if (achievement.type === type && achievement.tier > highestTier) {
          highest = achievement
          highestTier = achievement.tier
        }
      })
      return highest
    },
    // 添加系统通知
    addNotification (notification) {
      const id = Date.now()
      this.notifications.push({
        id,
        ...notification,
        timestamp: Date.now(),
      })
      // 自动移除通知
      if (notification.duration) {
        setTimeout(() => {
          this.removeNotification(id)
        }, notification.duration)
      }
      return id
    },
    // 移除通知
    removeNotification (id) {
      const index = this.notifications.findIndex((n) => n.id === id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },
    // 保存游戏
    saveGame () {
      // 收集需要保存的数据
      const gameData = {
        coins: this.coins,
        coinsPerClick: this.coinsPerClick,
        coinsPerSecond: this.coinsPerSecond,
        // 只保存升级ID和等级
        upgrades: this.upgrades.map((upgrade) => ({
          id: upgrade.id,
          level: upgrade.level,
        })),
        stats: this.stats,
        // 只保存收藏品ID和拥有状态
        collectibles: this.collectibles.map((collectible) => ({
          id: collectible.id,
          level: collectible.level,
        })),
        // 只保存成就ID和解锁状态
        achievements: this.achievements.map((achievement) => ({
          id: achievement.id,
          unlocked: achievement.unlocked
        })),
        lastSaved: Date.now(),
        settings: this.settings
      }
      const encryptedData = encryptData(gameData)
      if (encryptedData) {
        try {
          const encodedAppName = btoa(encodeURIComponent(`+++${__APP_TITLE__}`))
          localStorage.setItem(__APP_NAME__, `${encryptedData}${encodedAppName}`)
        } catch (error) {
          this.addNotification({
            type: 'error',
            title: '数据保存失败',
            message: error,
            duration: 0,
          })
        }
      }
    },
    // 加载游戏
    loadGame () {
      try {
        const savedData = localStorage.getItem(__APP_NAME__)
        if (!savedData) {
          this.upgrades = upgrades.map((item) => {
            return {
              ...item,
              level: item.level || 0,
              effect: item.effect,
            }
          })
          this.collectibles = collectibles
          this.initAchievements()
        } else {
          const encodedAppName = btoa(encodeURIComponent(`+++${__APP_TITLE__}`))
          const saveData = savedData.replace(encodedAppName, '')
          if (saveData) {
            try {
              const gameData = decryptData(saveData)
              // 加载基础数据
              this.coins = gameData.coins
              this.coinsPerClick = gameData.coinsPerClick
              this.coinsPerSecond = gameData.coinsPerSecond
              this.settings = gameData.settings
              // 加载升级数据 - 将保存的ID和等级与完整模板合并
              if (gameData.upgrades && Array.isArray(gameData.upgrades)) {
                // 创建升级模板的映射表以便快速查找
                const upgradeMap = {}
                upgrades.forEach((template) => {
                  upgradeMap[template.id] = template
                })
                // 通过保存的ID和等级重建完整的升级对象
                this.upgrades = gameData.upgrades.map((item) => {
                  const template = upgradeMap[item.id]
                  if (!template) return null
                  return {
                    ...template,
                    level: item.level || 0,
                    effect: template.effect,
                  }
                })
              }
              // 加载收藏品数据 - 将保存的ID和拥有状态与完整模板合并
              if (gameData.collectibles && Array.isArray(gameData.collectibles)) {
                // 创建收藏品模板的映射表以便快速查找
                const collectibleTemplates = collectibles
                const collectibleMap = {}
                collectibleTemplates.forEach((template) => {
                  collectibleMap[template.id] = template
                })
                // 通过保存的ID和拥有状态重建完整的收藏品对象
                this.collectibles = gameData.collectibles.map((savedCollectible) => {
                  const template = collectibleMap[savedCollectible.id]
                  if (!template) return null
                  // 合并模板和保存的状态
                  return {
                    ...template,
                    level: savedCollectible.level || 0,
                  }
                })
                // 重新计算收藏品加成
                this.calculateCollectibleBonuses()
              }
              // 加载成就数据 - 将保存的ID和解锁状态与完整模板合并
              if (gameData.achievements && Array.isArray(gameData.achievements)) {
                // 如果没有成就数据，初始化成就系统
                if (!this.achievements.length) {
                  this.initAchievements()
                }
                // 创建成就模板的映射表以便快速查找
                const achievementMap = {}
                this.achievements.forEach((achievement) => {
                  achievementMap[achievement.id] = achievement
                })
                // 通过保存的ID和解锁状态更新成就对象
                gameData.achievements.forEach((savedAchievement) => {
                  const achievement = achievementMap[savedAchievement.id]
                  if (achievement) {
                    achievement.unlocked = savedAchievement.unlocked || false
                  }
                })
              } else {
                // 如果没有成就数据，初始化成就系统
                this.initAchievements()
              }
              // 加载统计数据
              if (gameData.stats) {
                this.stats = { ...this.stats, ...gameData.stats }
              }
              // 计算离线收入
              const now = Date.now()
              const lastSaved = gameData.lastSaved || now
              const offlineTime = (now - lastSaved) / 1000 // 转换为秒
              if (offlineTime > 600 && this.coinsPerSecond > 0) {
                // 至少10秒以上的离线时间才计算
                const maxOfflineTime = 24 * 60 * 60 // 最多计算24小时的离线收入
                const effectiveOfflineTime = Math.min(offlineTime, maxOfflineTime)
                const offlineIncome = this.updatePassiveIncome(effectiveOfflineTime)
                // 显示离线收入通知
                const timeText = effectiveOfflineTime > 3600 ? `${Math.floor(effectiveOfflineTime / 3600)}小时${Math.floor((effectiveOfflineTime % 3600) / 60)}分钟` : `${Math.floor(effectiveOfflineTime / 60)}分钟`
                this.addNotification({
                  type: 'info',
                  title: '离线收入',
                  message: `您离线了${timeText}，获得了${this.formatNumber(offlineIncome)}金币`,
                  duration: 5000,
                })
              }
            } catch (error) {
              this.addNotification({
                type: 'error',
                title: '数据加载失败',
                message: error,
                duration: 0,
              })
            }
          }
        }
      } catch (error) {
        this.addNotification({
          type: 'error',
          title: '游戏加载失败',
          message: error,
          duration: 0,
        })
        return false
      }
    },
    // 格式化数字
    formatNumber (num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K'
      } else {
        return Math.floor(num)
      }
    },
    // 计算收藏品加成
    calculateCollectibleBonuses () {
      // 重置所有加成
      this.collectibleClickPowerBonus = 0
      this.collectiblePassiveIncomeBonus = 0
      this.collectibleCritChanceBonus = 0
      this.collectibleCritMultiplierBonus = 0
      this.passiveSpeedMultiplier = 0
      // 遍历所有已拥有的收藏品
      this.collectibles.forEach((collectible) => {
        if (!collectible.level) return
        switch (collectible.effect.type) {
          case 'clickPower':
            this.collectibleClickPowerBonus += collectible.effect.value * collectible.level
            break
          case 'passiveIncome':
            this.collectiblePassiveIncomeBonus += collectible.effect.value * collectible.level
            break
          case 'passiveSpeed':
            this.passiveSpeedMultiplier += collectible.effect.value * collectible.level
            break
          case 'critChance':
            this.collectibleCritChanceBonus += collectible.effect.value * collectible.level
            break
          case 'criticalMultiplier':
            this.collectibleCritMultiplierBonus += collectible.effect.value * collectible.level
            break
          case 'allIncome':
            // 同时增加点击和被动收入
            this.collectibleClickPowerBonus += collectible.effect.value * collectible.level
            this.collectiblePassiveIncomeBonus += collectible.effect.value * collectible.level
            break
        }
      })
    },
  },
})
