<template>
  <div class="stats-panel">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-dollar"></i>
        </div>
        <div class="stat-content">
          <h3>总金币</h3>
          <p>{{ gameStore.formatNumber(gameStore.stats.totalCoinsEarned) }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-bolt"></i>
        </div>
        <div class="stat-content">
          <h3>总点击数</h3>
          <p>{{ gameStore.formatNumber(gameStore.stats.totalClicks) }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-arrow-up"></i>
        </div>
        <div class="stat-content">
          <h3>购买升级</h3>
          <p>{{ gameStore.formatNumber(gameStore.stats.totalUpgradesPurchased) }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-star"></i>
        </div>
        <div class="stat-content">
          <h3>暴击次数</h3>
          <p>{{ gameStore.formatNumber(gameStore.stats.criticalHits) }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-calendar"></i>
        </div>
        <div class="stat-content">
          <h3>游戏天数</h3>
          <p>{{ Math.floor(gameStore.playTime / (1000 * 60 * 60 * 24)) }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <i class="pi pi-clock"></i>
        </div>
        <div class="stat-content">
          <h3>游戏时长</h3>
          <p>{{ formatTime(gameStore.playTime) }}</p>
        </div>
      </div>
    </div>
    <h3 class="section-title">游戏效率</h3>
    <div class="efficiency-stats">
      <div class="efficiency-stat">
        <span>平均每次点击:</span>
        <span>{{ gameStore.stats.totalClicks ? gameStore.formatNumber(gameStore.stats.totalCoinsEarned /
          gameStore.stats.totalClicks) : '0' }}
          金币</span>
      </div>
      <div class="efficiency-stat">
        <span>每分钟点击次数:</span>
        <span>{{ gameStore.playTime ? gameStore.formatNumber((gameStore.stats.totalClicks / gameStore.playTime) * 60000)
          : '0' }}</span>
      </div>
      <div class="efficiency-stat">
        <span>每小时获得金币:</span>
        <span>{{ gameStore.playTime ? gameStore.formatNumber((gameStore.stats.totalCoinsEarned / gameStore.playTime) *
          3600000) : '0' }}</span>
      </div>
      <div class="efficiency-stat">
        <span>暴击率:</span>
        <span>{{ gameStore.stats.totalClicks ? ((gameStore.stats.criticalHits / gameStore.stats.totalClicks) *
          100).toFixed(2) : '0' }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

// 格式化时间
const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`
  } else if (minutes > 0) {
    return `${minutes}分钟${seconds % 60}秒`
  } else {
    return `${seconds}秒`
  }
}
</script>

<style scoped>
.stats-panel {
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
}

.stat-icon i {
  color: #f59e0b;
  font-size: 1.2rem;
}

.stat-content h3 {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.stat-content p {
  margin: 0.3rem 0 0 0;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.section-title {
  margin: 1.5rem 0 1rem 0;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.efficiency-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.efficiency-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.efficiency-stat:hover {
  transform: translateY(-3px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.efficiency-stat span:last-child {
  font-weight: bold;
  color: #f59e0b;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .efficiency-stats {
    grid-template-columns: 1fr;
  }
}
</style>