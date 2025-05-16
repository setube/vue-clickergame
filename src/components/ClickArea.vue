<template>
  <div class="click-area-container">
    <div ref="clickArea" class="click-area" @click="handleClick">
      <div class="click-content">
        <i class="pi pi-dollar" style="font-size: 3rem"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { gsap } from 'gsap'

// 定义向父组件传递的事件
const emit = defineEmits(['click-completed'])

const gameStore = useGameStore()
const clickArea = ref(null)

// 处理点击事件
const handleClick = (event) => {
  // 更新游戏状态并获取点击结果
  const clickResult = gameStore.clickForCoins()
  if (!clickResult.amount) return
  // 创建点击动画效果
  createClickEffect(event, clickResult.isCritical)
  // 通知父组件更新数据
  emit('click-completed')
}

// 创建点击波纹效果
const createClickEffect = (event, isCritical = false) => {
  // 获取点击位置相对于点击区域的坐标
  if (!clickArea.value) return
  const rect = clickArea.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  // 创建波纹元素
  const ripple = document.createElement('div')
  ripple.className = 'ripple'
  if (isCritical) {
    ripple.classList.add('critical')
  }
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  // 添加到DOM
  clickArea.value.appendChild(ripple)
  // 使用GSAP创建动画
  gsap.fromTo(ripple, {
    scale: 0, opacity: 0.6
  }, {
    scale: 3,
    opacity: 0,
    duration: 1,
    ease: 'expo.out',
    onComplete: () => {
      if (clickArea.value && clickArea.value.contains(ripple)) {
        clickArea.value.removeChild(ripple)
      }
    }
  })
  // 添加点击区域动画，暴击时更强烈
  const timeline = gsap.timeline()
  if (isCritical) {
    // 暴击时的特殊效果
    timeline.to(clickArea.value, {
      scale: 0.95,
      rotation: -2,
      duration: 0.15,
      ease: 'power2.out'
    }).to(clickArea.value, {
      scale: 1.05,
      rotation: 2,
      duration: 0.15,
      ease: 'power2.out'
    }).to(clickArea.value, {
      scale: 1,
      rotation: 0,
      duration: 0.3,
      ease: 'elastic.out(1.2, 0.5)'
    })
  } else {
    // 普通点击效果
    timeline.to(clickArea.value, {
      scale: 0.8, duration: 0.1, ease: 'power2.out'
    }).to(clickArea.value, {
      scale: 1, duration: 0.2, ease: 'power2.out'
    })
  }
}
</script>

<style scoped>
.click-area-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.click-area {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(145deg, #f0b541, #e69500);
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  overflow: hidden;
  transition: transform 0.2s ease;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.click-area:hover {
  transform: scale(0.98);
}

.click-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 2;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  width: 20px;
  height: 20px;
}

.ripple.critical {
  background-color: rgba(255, 215, 0, 0.6);
}

.coin-float-enter-active,
.coin-float-leave-active {
  transition: opacity 0.5s ease;
}

.coin-float-enter-from,
.coin-float-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .click-area {
    width: 150px;
    height: 150px;
  }
}
</style> 