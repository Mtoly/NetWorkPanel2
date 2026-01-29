<template>
  <div class="ItemContainer">
    <div class="showItem">
      <span class="font-background" style="font-size: larger;">总流量</span>
      <el-text size="small" class="mx-1">{{ maxUse ? '/' + formatter(maxUse, 0, [0, 0, 0, 0, 0, 0]) : "" }}</el-text>
      <el-button type="primary" style="height: 15px;" :icon="Edit" link @click="emit('edit-max')" />
      <div class="state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-15 w-15 float-right pt-3">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
        </svg>
      </div>
      <el-text class="font-data">{{ allUsed }}</el-text>
    </div>
    <div class="showItem">
      <span class="font-background" style="font-size: larger;">{{ isRunning ? '实时速度' : '平均速度' }}</span>
      <el-popover placement="top-start" title="用量预测" :width="150" trigger="click">
        <template #reference>
          <el-button type="primary" style="height: 15px;vertical-align: -2px;" :icon="Calendar" link />
        </template>
        每分钟&nbsp;&nbsp;{{ predict.min }}<br>
        每小时&nbsp;&nbsp;{{ predict.hour }}<br>
        每天&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ predict.day }}<br>
        每月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ predict.mon }}
      </el-popover>
      <div class="state-icon state-icon-main">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-15 w-15 float-right pt-3">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16.469,8.924l-2.414,2.413c-0.156,0.156-0.408,0.156-0.564,0c-0.156-0.155-0.156-0.408,0-0.563l2.414-2.414c1.175-1.175,1.175-3.087,0-4.262c-0.57-0.569-1.326-0.883-2.132-0.883s-1.562,0.313-2.132,0.883L9.227,6.511c-1.175,1.175-1.175,3.087,0,4.263c0.288,0.288,0.624,0.511,0.997,0.662c0.204,0.083,0.303,0.315,0.22,0.52c-0.171,0.422-0.643,0.17-0.52,0.22c-0.473-0.191-0.898-0.474-1.262-0.838c-1.487-1.485-1.487-3.904,0-5.391l2.414-2.413c0.72-0.72,1.678-1.117,2.696-1.117s1.976,0.396,2.696,1.117C17.955,5.02,17.955,7.438,16.469,8.924 M10.076,7.825c-0.205-0.083-0.437,0.016-0.52,0.22c-0.083,0.205,0.016,0.437,0.22,0.52c0.374,0.151,0.709,0.374,0.997,0.662c1.176,1.176,1.176,3.088,0,4.263l-2.414,2.413c-0.569,0.569-1.326,0.883-2.131,0.883s-1.562-0.313-2.132-0.883c-1.175-1.175-1.175-3.087,0-4.262L6.51,9.227c0.156-0.155,0.156-0.408,0-0.564c-0.156-0.156-0.408-0.156-0.564,0l-2.414,2.414c-1.487,1.485-1.487,3.904,0,5.391c0.72,0.72,1.678,1.116,2.696,1.116s1.976-0.396,2.696-1.116l2.414-2.413c1.487-1.486,1.487-3.905,0-5.392C10.974,8.298,10.55,8.017,10.076,7.825"></path>
        </svg>
      </div>
      <el-text class="font-data state-icon-main">{{ speed }}</el-text>
    </div>
    <div class="showItem">
      <span class="font-background" style="font-size: larger;">带宽</span>
      <el-text size="small" class="mx-1">{{ maxSpeed ? '/' + formatter(maxSpeed, 2, [0, 0, 0, 0, 0, 0]) : "" }}</el-text>
      <el-button type="primary" style="height: 15px;" :icon="Edit" link @click="emit('edit-speed')" />
      <div class="state-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-15 w-15 float-right pt-3">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      </div>
      <el-text class="font-data">{{ speedBit }}</el-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Edit, Calendar } from '@element-plus/icons-vue'
import { formatter } from '@/services/speedTest'

defineProps<{
  allUsed: string
  speed: string
  speedBit: string
  predict: {
    min: string
    hour: string
    day: string
    mon: string
  }
  maxUse: number
  maxSpeed: number
  isRunning: boolean
}>()

const emit = defineEmits<{
  'edit-max': []
  'edit-speed': []
}>()
</script>

<style scoped>
.ItemContainer {
  column-count: 3;
  margin-top: 10px;
}

@media screen and (max-width: 800px) {
  .ItemContainer {
    column-count: 1;
  }
}

.showItem {
  border: 1px solid #dbdfea !important;
  padding: 20px 15px 15px 30px
}

.font-data {
  white-space: nowrap;
  grid-column-start: 1;
  font-weight: 700;
  line-height: 2.5rem;
  font-size: 30px;
}

.font-background {
  color: #344357;
  font-size: 14px;
}

.state-icon {
  display: block;
  margin-right: 10px;
  margin-left: auto;
  margin-top: -10px;
  width: 40px;
  height: 20px;
  color: rgb(96, 98, 102);
}

.state-icon-main {
  color: rgb(9, 194, 222);
}

@media (prefers-color-scheme: dark) {
  .showItem {
    border: 1px solid rgb(61, 63, 66) !important;
  }
  .state-icon {
    color: rgb(165, 167, 172);
  }
  .state-icon-main {
    color: rgb(30, 105, 131);
  }
  .font-background {
    color: rgb(193, 206, 230);
  }
}
</style>
