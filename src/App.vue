<script setup>
import { onMounted, shallowRef, onUnmounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import ClickArea from './components/ClickArea.vue'
import UpgradeShop from './components/UpgradeShop.vue'
import AchievementsPanel from './components/AchievementsPanel.vue'
import StatsPanel from './components/StatsPanel.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import CollectiblesPanel from './components/CollectiblesPanel.vue'
import NotificationSystem from './components/NotificationSystem.vue'

const gameStore = useGameStore()

const title = __APP_TITLE__
// 使用原始值而不是响应式数据来防止循环更新
const coinsData = shallowRef(0)
const coinsPerClickData = shallowRef(0)
const coinsPerSecondData = shallowRef(0)

// 更新UI数据
const updateUIData = () => {
  if (!gameStore) return
  coinsData.value = gameStore.coins
  // 直接计算而不是使用getter
  coinsPerClickData.value = gameStore.coinsPerClick + gameStore.collectibleClickPowerBonus
  coinsPerSecondData.value = gameStore.coinsPerSecond + gameStore.collectiblePassiveIncomeBonus
}

// 组件挂载
onMounted(() => {
  if (!gameStore) return
  // 加载存档
  try {
    gameStore.loadGame()
    // 初始更新UI数据
    updateUIData()
  } catch (error) {
    gameStore.addNotification({
      type: 'error',
      title: '存档加载失败',
      message: error,
      duration: 0
    })
  }
  // 自动保存
  if (gameStore.settings.autoSave) {
    gameStore.autoSaveInterval = setInterval(() => {
      try {
        gameStore.saveGame()
      } catch (error) {
        gameStore.addNotification({
          type: 'error',
          title: '数据自动保存失败',
          message: error,
          duration: 0
        })
      }
    }, gameStore.settings.autoSaveInterval)
  }
  // 设置被动收入间隔（每秒）
  gameStore.passiveIncomeInterval = setInterval(() => {
    try {
      if (coinsPerSecondData.value > 0) {
        gameStore.clickForCoins(2)
        updateUIData() // 更新UI数据
      }
    } catch (error) {
      gameStore.addNotification({
        type: 'error',
        title: '自动点击失败',
        message: error,
        duration: 0
      })
    }
  }, 1000)
})

onUnmounted(() => {
  gameStore.loadGame()
})
</script>

<template>
  <header class="game-header">
    <h1>{{ title }}</h1>
    <div class="game-resources">
      <div class="resource">
        <i class="pi pi-dollar"></i>
        <span>{{ gameStore.formatNumber(coinsData) }}</span>
      </div>
      <div class="resource">
        <i class="pi pi-plus"></i>
        <span>{{ gameStore.formatNumber(coinsPerClickData) }}/点击</span>
      </div>
      <div class="resource">
        <i class="pi pi-clock"></i>
        <span>{{ gameStore.formatNumber(coinsPerSecondData) }}/秒</span>
      </div>
    </div>
  </header>
  <main class="game-content">
    <Tabs value="0">
      <TabList>
        <Tab value="0">主页</Tab>
        <Tab value="1">藏品</Tab>
        <Tab value="3">成就</Tab>
        <Tab value="4">统计</Tab>
        <Tab value="5">设置</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <div class="game-main-content">
            <ClickArea @click-completed="updateUIData" />
            <UpgradeShop @upgrade-purchased="updateUIData" />
          </div>
        </TabPanel>
        <TabPanel value="1">
          <CollectiblesPanel @collectible-purchased="updateUIData" />
        </TabPanel>
        <TabPanel value="3">
          <AchievementsPanel />
        </TabPanel>
        <TabPanel value="4">
          <StatsPanel />
        </TabPanel>
        <TabPanel value="5">
          <SettingsPanel />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </main>
  <!-- 通知系统 -->
  <NotificationSystem v-if="gameStore" />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: Arial, sans-serif;
  height: 100%;
  background-color: var(--p-slate-50);
}

a {
  text-decoration: none;
}
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  padding: 10px 40px 0 40px;
}

.game-header {
  padding: 1rem;
  background-color: var(--p-surface-0);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.game-header h1 {
  color: #333;
  font-size: 1.8rem;
  margin: 0;
}

.game-resources {
  display: flex;
  gap: 20px;
}

.resource {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  color: #666;
}

.resource i {
  color: #f59e0b;
}

.game-content {
  flex: 1;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.game-tabs {
  height: 100%;
}

.game-main-content {
  display: flex;
  gap: 1.5rem;
  height: 100%;
  flex-wrap: wrap;
}

/* PrimeVue组件样式覆盖 */
.p-card {
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin-bottom: 1rem;
}

.p-card .p-card-header {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.p-card .p-card-content {
  padding: 1rem;
}

.p-card .p-card-footer {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.p-tablist-tab-list {
  border-radius: 10px 10px 0 0;
}

.p-tabpanels {
  border-radius: 0 0 10px 10px;
}

.p-fileupload-basic .p-button {
  width: 100%;
}

/* 移动设备适配 */
@media (max-width: 768px) {
  #app {
    padding: 10px;
  }

  .game-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .game-main-content {
    flex-direction: column;
  }

  .game-resources {
    width: 100%;
    justify-content: space-between;
  }

  .game-content {
    flex-direction: column;
  }

  .resource-display {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
