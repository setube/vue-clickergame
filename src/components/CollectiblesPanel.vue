<template>
  <div class="collectibles-panel">
    <div class="rarity-filters">
      <span class="filter-label">按稀有度筛选：</span>
      <Select v-model="selectedRarity" :options="rarityOptions" optionLabel="label" optionValue="value"
        placeholder="全部稀有度" class="rarity-dropdown" />
    </div>
    <div class="collectibles-container">
      <Card v-for="item in filteredCollectibles" :key="item.id" class="collectible-card" :class="item.rarity">
        <template #header>
          <div class="collectible-header">
            <span class="collectible-icon">{{ item.name }}</span>
            <Badge :value="'Lv.' + item.level" severity="info" />
          </div>
        </template>
        <template #title>
        </template>
        <template #content>
          <p class="collectible-description">
            {{ item.description }}
            +{{ item.id == 2 || item.id == 3 ? item.effect.value * (item.level || 1) : (item.effect.value * (item.level
              || 1) * 100).toFixed(1) }}
            {{ item.id == 2 || item.id == 3 ? '' : '%' }}
          </p>
          <div class="collectible-status">
            <div class="collectible-cost">
              <i class="pi pi-dollar"></i>
              <span>{{ gameStore.formatNumber(calculateUpgradeCost(item)) }}</span>
            </div>
            <Button :label="canBuyCollectible(item) ? '升级' : '金币不足'" :disabled="!canBuyCollectible(item)"
              @click="buyCollectible(item.id)" :severity="canBuyCollectible(item) ? 'success' : 'secondary'"
              icon="pi pi-shopping-cart">
              {{ item.level >= item.maxLevel ? '已满级' : canBuyCollectible(item) ? '升级' : '金币不足' }}
            </Button>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { gsap } from 'gsap'

const gameStore = useGameStore()
const selectedRarity = ref(null)

// 稀有度选项
const rarityOptions = [
  { label: '全部', value: null },
  { label: '普通', value: 'common' },
  { label: '稀有', value: 'uncommon' },
  { label: '珍稀', value: 'rare' },
  { label: '史诗', value: 'epic' },
  { label: '传说', value: 'legendary' }
]

// 按照稀有度和拥有状态筛选收藏品
const filteredCollectibles = computed(() => {
  // 如果没有选择稀有度筛选器，显示所有收藏品
  if (!selectedRarity.value) {
    return gameStore.collectibles
  }
  // 按照选定的稀有度筛选
  return gameStore.collectibles.filter(item => item.rarity === selectedRarity.value)
})

// 检查是否可以购买收藏品
const canBuyCollectible = (item) => {
  // 检查是否达到最大等级
  if (item.maxLevel && item.level >= item.maxLevel) return false
  return gameStore.coins >= calculateUpgradeCost(item)
}

// 计算升级所需的金币数量
const calculateUpgradeCost = (item) => {
  return item.cost * (item.level || 1)
}

// 定义向父组件传递的事件
const emit = defineEmits(['collectible-purchased'])

// 升级收藏品
const buyCollectible = (collectibleId) => {
  const success = gameStore.buyCollectible(collectibleId)
  if (success) {
    // 通知父组件更新数据
    emit('collectible-purchased')
    // 使用GSAP添加购买成功的动画效果
    nextTick(() => {
      const card = document.querySelector(`.collectible-card:nth-child(${collectibleId})`)
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
.collectibles-panel {
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.rarity-filters {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-label {
  margin-right: 0.5rem;
  color: #666;
}

.rarity-dropdown {
  width: 150px;
}

.collectibles-container {
  display: flex;
  flex-wrap: wrap;
}

.collectible-card {
  border: 1px solid #ddd;
  width: calc(50% - 10px);
  margin: 5px;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.collectible-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.collectible-card.common {
  border-left: 4px solid #9e9e9e;
}

.collectible-card.uncommon {
  border-left: 4px solid #2196f3;
}

.collectible-card.rare {
  border-left: 4px solid #ff9800;
}

.collectible-card.epic {
  border-left: 4px solid #f44336;
}

.collectible-card.legendary {
  border-left: 4px solid #9c27b0;
  background: linear-gradient(135deg,
      rgba(156, 39, 176, 0.05) 0%,
      rgba(255, 255, 255, 1) 100%);
}

.collectible-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collectible-icon {
  font-size: 1.1rem;
  color: #333;
}

.collectible-description {
  color: #666;
  margin-bottom: 1rem;
}

.collectible-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collectible-cost {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: bold;
  color: #f59e0b;
}

@media (max-width: 768px) {
  .collectible-card {
    width: 100%;
  }
}
</style>