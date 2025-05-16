<template>
  <div class="achievements-panel">
    <div class="achievements-progress">
      <div class="progress-label">
        <span>解锁进度: {{ unlockedCount }}/{{ totalCount }}</span>
        <span>{{ Math.min(((unlockedCount / totalCount) * 100).toFixed(2), 100) }}%</span>
      </div>
      <ProgressBar :value="Math.min(((unlockedCount / totalCount) * 100).toFixed(2), 100)" />
    </div>
    <div class="achievements-list">
      <Card v-for="achievement in gameStore.achievements" :key="achievement.id" class="achievement-card"
        :class="{ unlocked: achievement.unlocked }">
        <template #header>
          <div class="achievement-header">
            <h3>{{ achievement.name }}</h3>
            <Badge v-if="achievement.unlocked" value="已解锁" severity="success" />
            <Badge v-else value="未解锁" severity="secondary" />
          </div>
        </template>
        <template #content>
          <p>{{ achievement.description }}</p>
          <div class="achievement-progress" v-if="!achievement.unlocked">
            <div class="progress-label">
              {{ getProgressText(achievement) }}
            </div>
            <ProgressBar :value="getProgressValue(achievement)" />
          </div>
          <div class="achievement-reward" v-if="achievement.unlocked">
            <span>奖励: {{ achievement.reward }} 金币</span>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

// 计算解锁的成就数量
const unlockedCount = computed(() => {
  return gameStore.achievements.filter(a => a.unlocked).length
})

// 计算总成就数量
const totalCount = computed(() => {
  return gameStore.achievements.length
})

// 获取成就进度文本
const getProgressText = (achievement) => {
  let currentValue = 0
  // 根据成就类型获取当前值
  switch (achievement.type) {
    case 'totalCoins':
      currentValue = gameStore.stats.totalCoinsEarned
      break
    case 'totalClicks':
      currentValue = gameStore.stats.totalClicks
      break
    case 'totalUpgrades':
      currentValue = gameStore.stats.totalUpgradesPurchased
      break
  }
  return `${Math.floor(Math.min(currentValue, achievement.requirement))}/${achievement.requirement}`
}

// 获取成就进度值（百分比）
const getProgressValue = (achievement) => {
  let currentValue = 0
  // 根据成就类型获取当前值
  switch (achievement.type) {
    case 'totalCoins':
      currentValue = gameStore.stats.totalCoinsEarned
      break
    case 'totalClicks':
      currentValue = gameStore.stats.totalClicks
      break
    case 'totalUpgrades':
      currentValue = gameStore.stats.totalUpgradesPurchased
      break
  }
  // 计算百分比，最大100%
  return Math.min(((currentValue / achievement.requirement) * 100).toFixed(2), 100)
}
</script>

<style scoped>
.achievements-panel {
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.achievements-progress {
  margin-bottom: 1.5rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.achievements-list {
  display: flex;
  flex-wrap: wrap;
}

.achievement-card {
  width: calc(50% - 10px);
  border-left: 4px solid #ccc;
  margin: 5px;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.achievement-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.achievement-card.unlocked {
  border-left-color: #4caf50;
  background-color: rgba(76, 175, 80, 0.05);
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.achievement-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.achievement-progress {
  margin-top: 1rem;
}

.achievement-reward {
  margin-top: 1rem;
  font-weight: bold;
  color: #f59e0b;
}

/* 自定义滚动条 */
.achievements-list::-webkit-scrollbar {
  width: 6px;
}

.achievements-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.achievements-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.achievements-list::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}


@media (max-width: 768px) {
  .achievement-card {
    width: 100%;
  }
}
</style> 