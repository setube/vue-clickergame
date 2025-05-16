<template>
  <div class="settings-panel">
    <div class="settings-section">
      <h3>游戏设置</h3>
      <div class="data-actions">
        <div class="setting-item">
          <div class="setting-label">
            <label>自动保存</label>
            <ToggleSwitch v-model="gameStore.settings.autoSave" />
          </div>
        </div>
        <div class="setting-item">
          <div class="setting-label">
            <label>自动保存间隔(毫秒)</label>
            <InputNumber v-model="gameStore.settings.autoSaveInterval" mode="decimal" showButtons :min="5000"
              :max="600000" fluid />
          </div>
        </div>
      </div>
    </div>
    <div class="settings-section">
      <h3>游戏数据</h3>
      <div class="data-actions">
        <Button icon="pi pi-download" label="导出存档" @click="exportSave" severity="secondary" />
        <FileUpload mode="basic" accept="application/json" @select="importSave($event)" customUpload auto
          severity="secondary" chooseLabel="导入存档" />
        <Button icon="pi pi-check" label="保存数据" @click="gameStore.saveGame" severity="success" />
        <Button icon="pi pi-trash" label="清除数据" @click="resetConfirmVisible = true" severity="danger" />
        <Button icon="pi pi-github" as="a" label="开源地址" href="https://github.com/setube/vue-clickergame" target="_blank"
          severity="contrast" />
        <ConfirmPopup group="headless">
          <template #container>
            <div class="rounded">920930589</div>
          </template>
        </ConfirmPopup>
        <Button label="开源地址" @click="requireConfirmation($event)" severity="contrast">
          <svg class="icon" viewBox="0 0 1024 1024" version="1.1">
            <path d="M512 0C229.224296 0 0 229.224296 0 512s229.224296 512 512 512 512-229.224296 512-512S794.775704 0 512 0zM801.261037 
                668.86163c-21.731556 18.640593-49.948444-61.345185-54.006519-49.038222-9.879704 29.923556-14.506667 49.929481-43.633778 
                82.507852-1.554963 1.744593 33.659259 14.468741 43.633778 41.642667 9.557333 26.017185 28.141037 67.26163-93.487407 
                80.213333-71.35763 7.585185-122.936889-38.020741-128.075852-37.584593-9.53837 0.83437-5.290667 0-15.530667 0-8.38163 
                0-8.931556 0.606815-16.820148 0-2.161778-0.170667-25.884444 37.584593-131.963259 37.584593-82.223407 
                0-103.518815-51.749926-86.983111-80.213333 16.535704-28.463407 44.126815-36.750222 
                40.239407-41.263407-19.152593-22.186667-32.350815-45.909333-40.239407-67.356444-1.953185-5.347556-3.584-10.543407-4.873481-15.530667-2.996148-11.45363-25.884444 
                67.204741-50.460444 49.038222-24.576-18.166519-22.376296-64.417185-6.46637-108.676741 16.042667-44.619852 56.471704-87.589926 56.926815-97.071407 1.611852-35.290074-3.489185-41.14963 0-50.422519 
                7.755852-20.764444 17.199407-12.8 17.199407-23.570963 0-135.736889 100.864-245.76 225.28-245.76s225.28 110.042074 225.28 245.76c0 
                5.195852 13.520593 0 19.986963 23.570963 1.327407 4.873481 2.23763 23.665778 0.663704 50.422519-0.739556 12.856889 34.266074 28.501333 
                52.375704 97.071407C828.434963 628.754963 810.30637 661.105778 801.261037 668.86163z" fill="#ffffff">
            </path>
          </svg>
          QQ群聊
        </Button>
      </div>
    </div>
    <!-- 确认对话框 -->
    <Dialog v-model:visible="resetConfirmVisible" header="确认重置" modal :draggable="false">
      <p>确定要清除所有游戏数据吗？此操作无法撤销！</p>
      <template #footer>
        <Button label="取消" @click="resetConfirmVisible = false" severity="secondary" />
        <Button label="确认清除" @click="resetGame" severity="danger" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { saveAs } from 'file-saver'
import { useConfirm } from 'primevue/useconfirm'

const confirm = useConfirm()

const appName = __APP_NAME__
const gameStore = useGameStore()
const resetConfirmVisible = ref(false)

const requireConfirmation = (event) => {
  confirm.require({
    target: event.currentTarget,
    group: 'headless'
  })
}

// 重置游戏
const resetGame = () => {
  gameStore.autoSaveInterval = null
  gameStore.passiveIncomeInterval = null
  localStorage.removeItem(appName)
  location.reload()
}

// 导出游戏存档
const exportSave = () => {
  try {
    saveAs(
      new Blob([localStorage.getItem(appName)], { type: 'application/json' }),
      `${__APP_TITLE__}存档数据-${new Date().toISOString().slice(0, 10)}-${Date.now()}.json`
    )
    gameStore.addNotification({
      type: 'success',
      title: '导出成功',
      message: '游戏存档已导出',
      duration: 3000
    })
  } catch (error) {
    gameStore.addNotification({
      type: 'error',
      title: '导出失败',
      message: error,
      duration: 0
    })
  }
}

// 导入游戏存档
const importSave = (event) => {
  const file = event.files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      localStorage.setItem(__APP_NAME__, e.target.result)
      location.reload()
    } catch (error) {
      gameStore.addNotification({
        type: 'error',
        title: '存档导入失败',
        message: error,
        duration: 0
      })
    }
  }
  reader.readAsText(file);
}
</script>

<style scoped>
.settings-panel {
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.settings-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.2rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
  width: 100%;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  flex: 1;
}

.setting-label label {
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 0.5rem;
}

.setting-description {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.data-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.rounded {
  padding: 1rem;
}

svg {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 768px) {
  .data-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>