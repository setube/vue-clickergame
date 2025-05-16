export const upgrades = [
  {
    id: 1,
    name: '点击效率',
    description: '每次点击获得金币',
    baseCost: 10,
    level: 0,
    effect: 1,
    costMultiplier: 1.5,
    category: 'click'
  },
  {
    id: 2,
    name: '自动收集器',
    description: '每秒自动获得金币',
    baseCost: 50,
    level: 0,
    effect: 1,
    costMultiplier: 1.7,
    category: 'passive'
  },
  {
    id: 3,
    name: '收益暴击',
    description: '双倍收益几率',
    baseCost: 2000,
    level: 0,
    effect: 0.01, // 暴击几率增加值
    maxLevel: 50, // 最大仅能升10级
    costMultiplier: 2,
    category: 'click'
  },
  {
    id: 4,
    name: '金币增幅',
    description: '所有收入增加',
    baseCost: 500,
    level: 0,
    maxLevel: 100, // 最大仅能升10级
    effect: 0.01, // 收入增幅
    costMultiplier: 2.5,
    category: 'boost'
  },
  {
    id: 5,
    name: '离线收益',
    description: '离线时也能获得自动收益的',
    baseCost: 1000,
    level: 0,
    effect: 0.5, // 离线收益比例
    maxLevel: 1, // 只能购买一次
    costMultiplier: 1,
    category: 'passive'
  },
  {
    id: 6,
    name: '暴击倍率',
    description: '暴击倍率',
    baseCost: 15000,
    level: 0,
    effect: 0.01, // 每级增加0.1倍暴击倍率
    maxLevel: 100, // 最大10级，最高3倍
    costMultiplier: 2,
    category: 'click'
  },
  {
    id: 7,
    name: '金币磁铁',
    description: '每次点击获得额外金币的几率为',
    baseCost: 20000,
    level: 0,
    effect: 0.01, // 每级增加1%触发几率
    maxLevel: 50, // 最大50级，最高50%
    costMultiplier: 1.8,
    category: 'click'
  },
  {
    id: 8,
    name: '被动加速',
    description: '自动收集器效率提升',
    baseCost: 30000,
    level: 0,
    effect: 0.001, // 每级提升0.1%效率
    costMultiplier: 2,
    category: 'passive'
  },
  {
    id: 9,
    name: '幸运币',
    description: '随机获得的奖励增加',
    baseCost: 50000,
    level: 0,
    effect: 0.02, // 每级增加2%幸运奖励
    maxLevel: 50, // 最大50级，最高100%
    costMultiplier: 3,
    category: 'boost'
  },
  {
    id: 10,
    name: '黄金奖励',
    description: '触发超级大奖，获得10倍金币的几率为',
    baseCost: 10000,
    level: 0,
    effect: 0.001, // 每级增加0.1%触发几率
    maxLevel: 50, // 最大50级，最高5%
    costMultiplier: 4,
    category: 'click'
  }
]

export const collectibles = [
  {
    id: 1,
    name: '幸运四叶草',
    level: 0,
    description: '暴击几率增加',
    cost: 5000,
    rarity: 'common', // 稀有度：普通
    effect: {
      type: 'critChance',
      value: 0.001
    }
  },
  {
    id: 2,
    name: '金色硬币',
    level: 0,
    description: '点击金币永久',
    cost: 10000,
    rarity: 'common',
    effect: {
      type: 'clickPower',
      value: 1
    }
  },
  {
    id: 3,
    name: '小型矿车',
    level: 0,
    description: '自动收入永久',
    cost: 15000,
    rarity: 'common',
    effect: {
      type: 'passiveIncome',
      value: 1
    }
  },
  {
    id: 4,
    name: '魔法放大镜',
    level: 0,
    description: '所有收入增加',
    cost: 25000,
    rarity: 'uncommon', // 稀有度：稀有
    effect: {
      type: 'incomeMultiplier',
      value: 0.001
    }
  },
  {
    id: 5,
    name: '彩虹宝石',
    level: 0,
    description: '暴击倍率增加',
    cost: 50000,
    rarity: 'uncommon',
    effect: {
      type: 'critPower',
      value: 0.001
    }
  },
  {
    id: 6,
    name: '黄金小猪',
    level: 0,
    description: '自动收入速度提高',
    cost: 75000,
    rarity: 'uncommon',
    effect: {
      type: 'passiveSpeed',
      value: 0.001
    }
  },
  {
    id: 7,
    name: '幸运猫咪',
    level: 0,
    description: '幸运加成增加',
    cost: 100000,
    rarity: 'rare', // 稀有度：珍稀
    effect: {
      type: 'luckBoost',
      value: 0.001
    }
  },
  {
    id: 8,
    name: '点金手套',
    level: 0,
    description: '黄金点击几率增加',
    cost: 250000,
    rarity: 'rare',
    effect: {
      type: 'goldenChance',
      value: 0.001
    }
  },
  {
    id: 9,
    name: '财神像',
    level: 0,
    description: '所有收入增加',
    cost: 500000,
    rarity: 'epic', // 稀有度：史诗
    effect: {
      type: 'incomeMultiplier',
      value: 0.005
    }
  }
]

export const achievementTiers = {
  totalCoins: [
    { tier: 1, requirement: 1000, reward: 50, name: '储蓄新手' },
    { tier: 2, requirement: 10000, reward: 100, name: '小康之家' },
    { tier: 3, requirement: 100000, reward: 200, name: '财富自由' },
    { tier: 4, requirement: 1000000, reward: 500, name: '百万富翁' },
    { tier: 5, requirement: 100000000, reward: 1000, name: '亿万富豪' }
  ],
  totalClicks: [
    { tier: 1, requirement: 100, reward: 50, name: '点击起步' },
    { tier: 2, requirement: 1000, reward: 100, name: '点击达人' },
    { tier: 3, requirement: 10000, reward: 200, name: '点击狂人' },
    { tier: 4, requirement: 100000, reward: 500, name: '点击大师' },
    { tier: 5, requirement: 1000000, reward: 1000, name: '点击之神' }
  ],
  totalUpgrades: [
    { tier: 1, requirement: 10, reward: 100, name: '升级新手' },
    { tier: 2, requirement: 25, reward: 200, name: '升级达人' },
    { tier: 3, requirement: 50, reward: 300, name: '升级专家' },
    { tier: 4, requirement: 100, reward: 500, name: '升级大师' },
    { tier: 5, requirement: 200, reward: 1000, name: '升级之王' }
  ]
}