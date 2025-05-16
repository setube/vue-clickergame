<template>
  <div class="upgrade-shop">
    <div class="upgrades-container">
      <Card v-for="item in gameStore.upgrades" :key="item.id" class="upgrade-card">
        <template #header>
          <div class="upgrade-header">
            <h3>{{ item.name }}</h3>
            <Badge :value="'Lv.' + item.level" severity="info" />
          </div>
        </template>
        <template #content>
          <p>
            {{ item.description }}
            <span class="upgrade-effect">
              {{ item.id == 1 || item.id == 2 ? item.effect * (item.level || 1) : item.effect * (item.level || 1) * 100 }}
              {{ item.id == 1 || item.id == 2 ? '' : '%' }}
            </span>
          </p>
        </template>
        <template #footer>
          <div class="upgrade-footer">
            <div class="upgrade-cost">
              <i class="pi pi-dollar"></i>
              <span>{{ gameStore.formatNumber(gameStore.getUpgradeCost(item.id)) }}</span>
            </div>
            <Button @click="buyUpgrade(item.id)" :disabled="!gameStore.canBuyUpgrade(item.id)"
              :severity="gameStore.canBuyUpgrade(item.id) ? 'success' : 'secondary'" size="small">
              {{ item.level === item.maxLevel ? '已满级' : gameStore.canBuyUpgrade(item.id) ? '购买' : '金币不足' }}
            </Button>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { gsap } from 'gsap'

const gameStore = useGameStore()

// 定义向父组件传递的事件
const emit = defineEmits(['upgrade-purchased'])

// 购买升级
const buyUpgrade = (upgradeId) => {
  const success = gameStore.buyUpgrade(upgradeId)
  if (success) {
    // 通知父组件更新数据
    emit('upgrade-purchased')
    // 使用GSAP添加购买成功的动画效果
    nextTick(() => {
      const card = document.querySelector(`.upgrade-card:nth-child(${upgradeId})`)
      if (card) {
        gsap.timeline().to(card, {
          scale: 1.05, duration: 0.2, ease: 'back.out(1.7)'
        }).to(card, {
          scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.3)'
        })
      }
    })
  }
}
</script>

<style scoped>
.upgrade-shop {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.upgrades-container {
  display: flex;
  flex-wrap: wrap;
}

.upgrade-card {
  width: calc(50% - 1rem);
  margin: 5px;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.upgrade-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.upgrade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upgrade-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.upgrade-effect {
  margin-top: 1rem;
  font-weight: bold;
  color: #4caf50;
}

.upgrade-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upgrade-cost {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f59e0b;
  font-weight: bold;
}

/* 自定义滚动条 */
.upgrades-container::-webkit-scrollbar {
  width: 6px;
}

.upgrades-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.upgrades-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.upgrades-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

@media (max-width: 768px) {
  .upgrade-card {
    width: 100%;
  }
}
</style>