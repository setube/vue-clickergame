<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div v-for="notification in gameStore.notifications" :key="notification.id"
        class="notification" :class="notification.type">
        <div class="notification-header">
          <span class="notification-title">{{ notification.title }}</span>
          <i class="pi pi-times notification-close" @click="closeNotification(notification.id)" v-if="notification.duration"></i>
        </div>
        <div class="notification-content">
          {{ notification.message }}
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

// 关闭通知
const closeNotification = (id) => {
  gameStore.removeNotification(id)
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 350px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.notification {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px;
  margin-bottom: 10px;
  min-width: 250px;
  max-width: 350px;
  pointer-events: auto;
  border-left: 4px solid #4caf50;
}

.notification.achievement {
  border-left-color: #ffc107;
}

.notification.income {
  border-left-color: #2196f3;
}

.notification.error {
  border-left-color: #f44336;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.notification-title {
  font-weight: bold;
  color: #333;
}

.notification-close {
  cursor: pointer;
  color: #999;
  font-size: 0.8rem;
  padding: 4px;
}

.notification-close:hover {
  color: #333;
}

.notification-content {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 通知动画 */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 