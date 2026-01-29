<template>
  <div>
    <div style="margin-top:20px;">
      <span class="font-background">线程数：{{ threadNum }}</span>
      <el-slider :show-tooltip="false" :min="1" :max='64' v-model="threadNum" @change="handleThreadChange" />
    </div>
    <div style="width: 100%;height:32px;">
      <div style="float: left;">
        <el-switch v-model="runBackground" @change="handleBackgroundChange" active-text="保持后台运行" />
      </div>
      <div style="float: right;">
        <el-switch v-model="autoStart" @change="handleAutoStartChange" active-text="自动运行" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSpeedTestStore } from '@/stores/speedTest'

const speedTestStore = useSpeedTestStore()

const threadNum = computed({
  get: () => speedTestStore.threadNum,
  set: (val) => speedTestStore.setThreadNum(val)
})

const runBackground = computed({
  get: () => speedTestStore.runBackground,
  set: (val) => speedTestStore.setRunBackground(val)
})

const autoStart = computed({
  get: () => speedTestStore.autoStart,
  set: (val) => speedTestStore.setAutoStart(val)
})

const handleThreadChange = (val: number) => {
  speedTestStore.setThreadNum(val)
}

const handleBackgroundChange = (val: boolean) => {
  speedTestStore.setRunBackground(val)
}

const handleAutoStartChange = (val: boolean) => {
  speedTestStore.setAutoStart(val)
}
</script>

<style scoped>
.font-background {
  color: #344357;
  font-size: 14px;
}

@media (prefers-color-scheme: dark) {
  .font-background {
    color: rgb(193, 206, 230);
  }
}
</style>
