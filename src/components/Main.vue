<template>
  <div class="radius card" :style="{ borderRadius: 'var(--el-border-radius-round)' }">
    <div style="margin-top: 10px;margin-left: 10px;margin-right: 10px;">
      <NodeSelector />
      <ControlPanel />
      <StatisticsDisplay 
        :allUsed="speedTestStore.state.show.allUsed"
        :speed="speedTestStore.state.show.speed"
        :speedBit="speedTestStore.state.show.speedBit"
        :predict="speedTestStore.state.predict"
        :maxUse="speedTestStore.state.maxUse"
        :maxSpeed="speedTestStore.state.maxSpeed"
        :isRunning="speedTestStore.isRunning"
        @edit-max="EditMaxVisible = true"
        @edit-speed="EditSpeedVisible = true"
      />

      <div style="width: fit-content;display: block;margin-top:2ch;margin-left: auto;margin-right: auto;">
        <a class="button" v-if="!speedTestStore.isRunning && !speedTestStore.state.isChecking" @click="tryStart">
          <svg t="1694957757562" class="svg-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4036" width="200" height="200">
            <path d="M823.8 603.5l-501.2 336c-50.7 34-119.3 20.4-153.2-30.2-12.2-18.2-18.7-39.6-18.7-61.5v-672c0-61 49.5-110.4 110.4-110.4 21.9 0 43.3 6.5 61.5 18.7l501.1 336c50.7 34 64.2 102.6 30.2 153.2-7.8 11.9-18.1 22.2-30.1 30.2z m0 0" p-id="4037"></path>
          </svg>
        </a>
        <a class="button" v-if="speedTestStore.state.isChecking">
          <el-icon :size="60" class="is-loading el-icon-loading"><Loading /></el-icon>
        </a>
        <a class="button" v-if="speedTestStore.isRunning && !speedTestStore.state.isChecking" @click="speedTestStore.isRunning = false">
          <svg t="1694958268344" fill="white" style="width: 80px;margin-top: -30px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7667" width="200" height="200">
            <path d="M352 768c-17.664 0-32-14.304-32-32V288c0-17.664 14.336-32 32-32s32 14.336 32 32v448c0 17.696-14.336 32-32 32zM672 768c-17.696 0-32-14.304-32-32V288c0-17.664 14.304-32 32-32s32 14.336 32 32v448c0 17.696-14.304 32-32 32z" p-id="7668"></path>
          </svg>
        </a>
      </div>
      
      <el-button style="float: left;margin-top: -20px;margin-right: 3px" type="primary" :icon="Histogram" link @click="showMark.show = true" />
      <el-button style="float: left;margin-top: -20px;margin-left: 39px" type="primary" :icon="FullScreen" link @click="isFullScreen = true" />
      <el-button style="float: right;margin-top: -20px;margin-right: 3px" type="primary" :icon="TrendCharts" link v-if="!speedTestStore.chartShow" @click="speedTestStore.setChartShow(true)" />
      <el-button style="float: right;margin-top: -20px;margin-right: 3px" type="primary" :icon="Hide" link v-if="speedTestStore.chartShow" @click="speedTestStore.setChartShow(false)" />
      
      <SpeedChart ref="chartRef" :show="speedTestStore.chartShow" />
    </div>
  </div>

  <el-dialog style="width: 90%;max-width: 300px;" v-model="EditMaxVisible" title="设置上限自动停止">
    <el-form>
      <div class="mt-4">
        <el-input type="number" min='1' v-model="maxUseInput.num" autocomplete="off" placeholder="留空则无上限" class="input-with-select">
          <template #append>
            <el-select v-model="maxUseInput.type" placeholder="Select" style="width: 65px">
              <el-option label="MB" value="MB" />
              <el-option label="GB" value="GB" />
              <el-option label="TB" value="TB" />
            </el-select>
          </template>
        </el-input>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="EditMaxVisible = false">取消</el-button>
        <el-button type="primary" @click="editMaxUse">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog style="width: 90%;max-width: 350px;" v-model="EditSpeedVisible" title="设置带宽上限">
    <el-form>
      <div class="mt-4">
        <el-input type="number" min='1' v-model="maxSpeedInput.num" autocomplete="off" placeholder="留空则无上限" class="input-with-select">
          <template #append>
            <el-select v-model="maxSpeedInput.type" placeholder="Select" style="width: 80px">
              <el-option label="Mbps" value="Mbps" />
              <el-option label="Gbps" value="Gbps" />
            </el-select>
          </template>
        </el-input>
        <br><br>
        <el-alert title="注意：" type="warning">
          浏览器会使用缓存策略<br>只能限制平均速度，无法限制峰值速度!<br>部分链接无法限速，请使用其它限速方法
        </el-alert>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="EditSpeedVisible = false">取消</el-button>
        <el-button type="primary" @click="editSpeedUse">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <MarkUI :show="showMark" />
  <audio v-if="isMobile && !isIOS && !isMiuiBrowser && speedTestStore.runBackground" @canplay="handleAudioCanPlay" @pause="handleAudioPause" @play="handleAudioPlay" controls loop ref="audioDom" style="display:none">
    <source :src="andoridSound" type="audio/mpeg">
  </audio>
  <audio v-if="isIOS && speedTestStore.runBackground" @canplay="handleAudioCanPlay" @pause="handleAudioPause" @play="handleAudioPlay" controls loop ref="audioDom" style="display:none">
    <source :src="iosSound" type="audio/mpeg">
  </audio>
  <FullScreenUI v-model="isFullScreen" :isRunning="speedTestStore.isRunning" :state="speedTestStore.state" />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, Histogram, FullScreen, TrendCharts, Hide } from '@element-plus/icons-vue'
import iosSound from "../assets/ios.mp3"
import andoridSound from "../assets/android.mp3"
import { useSpeedTestStore } from '@/stores/speedTest'
import { useNodesStore } from '@/stores/nodes'
import { useUserStore } from '@/stores/user'
import { useRankingStore } from '@/stores/ranking'
import { checkUrl, formatter } from '@/services/speedTest'
import { rankingApi } from '@/services/ranking'
import NodeSelector from './NodeSelector.vue'
import ControlPanel from './ControlPanel.vue'
import StatisticsDisplay from './StatisticsDisplay.vue'
import SpeedChart from './SpeedChart.vue'
import MarkUI from './Mark.vue'
import FullScreenUI from './FullScreen.vue'

const props = defineProps<{ isVisible: Boolean }>()

const speedTestStore = useSpeedTestStore()
const nodesStore = useNodesStore()
const userStore = useUserStore()
const rankingStore = useRankingStore()

const showMark = ref({ show: false })
const isFullScreen = ref(false)
const chartRef = ref<InstanceType<typeof SpeedChart> | null>(null)
const audioDom = ref<HTMLAudioElement | null>(null)

const EditMaxVisible = ref(false)
const EditSpeedVisible = ref(false)
const maxUseInput = ref<{ num: number | null; type: "GB" | "MB" | "TB" }>({ num: null, type: 'GB' })
const maxSpeedInput = ref<{ num: number | null; type: "Gbps" | "Mbps" | "Kbps" }>({ num: null, type: 'Mbps' })

const isMobile = /Mobi|Android|iPhone|Macintosh/i.test(navigator.userAgent)
const isMiuiBrowser = /MiuiBrowser/i.test(navigator.userAgent)
const isIOS = /iPhone|Macintosh/i.test(navigator.userAgent)

let tasks: number[] = []
let solvedRunUrl = ''

const handleAudioCanPlay = () => {
  if (speedTestStore.isRunning) audioDom.value?.play()
}

const handleAudioPause = () => {
  if (speedTestStore.runBackground) speedTestStore.isRunning = false
}

const handleAudioPlay = () => {
  speedTestStore.isRunning = true
}

const tryStart = async () => {
  if (nodesStore.runUrl.startsWith("NetworkPanelApi://")) {
    speedTestStore.isRunning = true
    return
  }
  speedTestStore.state.isChecking = true
  const urlStatus = await checkUrl(nodesStore.runUrl)
  speedTestStore.state.isChecking = false
  if (!urlStatus.status) {
    ElMessage.error(urlStatus.info)
  } else {
    speedTestStore.isRunning = true
  }
}

async function apiSolver() {
  if (!nodesStore.runUrl.startsWith("NetworkPanelApi://")) {
    solvedRunUrl = nodesStore.runUrl
    return
  }
  const host = nodesStore.runUrl.split("NetworkPanelApi://")[1]
  const resp: any = await fetch(import.meta.env.VITE_API_URL + "url.ajax?" + new URLSearchParams({ host, cache: window.location.host }), {
    mode: "cors",
    redirect: "follow",
    referrerPolicy: "no-referrer"
  })
  const data = await resp.json()
  if (data['status'] != 0) {
    speedTestStore.isRunning = false
    return
  }
  solvedRunUrl = data['url']
}

watch(() => speedTestStore.isRunning, async (newState) => {
  chartRef.value?.clearChart()
  if (newState) {
    speedTestStore.state.isChecking = true
    await apiSolver()
    speedTestStore.state.isChecking = false
    if (!speedTestStore.isRunning) return
    if (speedTestStore.state.maxUse && speedTestStore.state.bytesUsed >= speedTestStore.state.maxUse) {
      speedTestStore.state.bytesUsed = 0
      speedTestStore.state.logged = 0
    }
    speedTestStore.state.lastLogTime = new Date().getTime() / 1000
    speedTestStore.state.startUse = speedTestStore.state.bytesUsed
    speedTestStore.state.startTime = new Date().getTime() / 1000
    speedTestStore.state.recordUse = speedTestStore.state.bytesUsed
    speedTestStore.state.recordTime = new Date().getTime() / 1000
    for (let i = 0; i < speedTestStore.threadNum; i++) startThread(i)
    tasks.push(setInterval(frameEvent, 16))
    tasks.push(setInterval(uploadLog, 60000))
    tasks.push(setInterval(apiSolver, 60000))
    secEvent()
    tasks.push(setInterval(secEvent, 1000))
    speedTestStore.runBackground ? audioDom.value?.play() : ''
  } else {
    tasks.forEach(i => clearInterval(i))
    tasks = []
    uploadLog()
    audioDom.value?.pause()
    const speed = (speedTestStore.state.bytesUsed - speedTestStore.state.startUse) / (new Date().getTime() / 1000 - speedTestStore.state.startTime)
    setSpeed(speed)
    setUsed()
    if (!props.isVisible) setTitle()
  }
})

async function uploadLog() {
  const now = new Date().getTime() / 1000
  const num = speedTestStore.state.bytesUsed - speedTestStore.state.logged
  const time = now - speedTestStore.state.lastLogTime
  speedTestStore.state.logged = speedTestStore.state.bytesUsed
  speedTestStore.state.lastLogTime = now
  const data = await rankingApi.uploadLog({
    AccessToken: rankingStore.accessToken,
    url: nodesStore.runUrl,
    threadNum: speedTestStore.threadNum,
    used: num,
    time: time
  })
  if (data.status == -1) {
    rankingStore.clearAccessToken()
  }
}

watch(() => props.isVisible, (newState) => {
  if (!newState && speedTestStore.runBackground && speedTestStore.isRunning) secEvent()
  if (!newState && !speedTestStore.runBackground && speedTestStore.isRunning) speedTestStore.isRunning = false
  if (newState) setTitle()
})

watch(() => speedTestStore.threadNum, (newState, oldState) => {
  if (speedTestStore.isRunning && newState > oldState) {
    for (let i = oldState; i < newState; i++) startThread(i)
  }
})

const setTitle = (speed: number = 0) => {
  if (props.isVisible) {
    document.title = '网络面板'
  } else {
    if (speedTestStore.isRunning) {
      document.title = formatter(speedTestStore.state.bytesUsed, 0, [0, 0, 0, 0, 0, 0]) + ' ' + formatter(speed, 1, [0, 0, 0, 0, 0, 0])
    } else if (speedTestStore.state.maxUse && speedTestStore.state.bytesUsed >= speedTestStore.state.maxUse) {
      document.title = '已完成'
    } else {
      document.title = '已暂停'
    }
  }
}

const setUsed = () => {
  if (!speedTestStore.state.bytesUsed) speedTestStore.state.show.allUsed = '-'
  speedTestStore.state.show.allUsed = formatter(speedTestStore.state.bytesUsed, 0, [0, 0, 1, 2, 2, 2])
}

const setSpeed = (speed: number) => {
  speedTestStore.state.show.speed = formatter(speed, 1, [0, 0, 1, 2, 2, 2])
  speedTestStore.state.show.speedBit = formatter(speed * 8, 2, [0, 0, 0, 2, 2, 2])
  speedTestStore.state.predict.min = formatter(speed * 60, 0, [0, 0, 0, 1, 1, 1])
  speedTestStore.state.predict.hour = formatter(speed * 60 * 60, 0, [0, 0, 0, 1, 1, 1])
  speedTestStore.state.predict.day = formatter(speed * 60 * 60 * 24, 0, [0, 0, 0, 1, 1, 1])
  speedTestStore.state.predict.mon = formatter(speed * 60 * 60 * 24 * 30, 0, [0, 0, 0, 1, 1, 1])
}

const frameEvent = () => {
  if (props.isVisible) setUsed()
  if (speedTestStore.state.maxUse && speedTestStore.state.bytesUsed >= speedTestStore.state.maxUse) {
    speedTestStore.isRunning = false
  }
}

const secEvent = () => {
  const speed = (speedTestStore.state.bytesUsed - speedTestStore.state.recordUse) / (new Date().getTime() / 1000 - speedTestStore.state.recordTime)
  if (!isNaN(speed)) chartRef.value?.updateChart(speed)
  else chartRef.value?.updateChart(0)
  if (speed <= 0 || isNaN(speed)) {
    speedTestStore.state.show.speed = '-'
    speedTestStore.state.show.speedBit = '-'
  } else if (props.isVisible) {
    setSpeed(speed)
  } else if (speedTestStore.runBackground) {
    setTitle(speed)
  }
  speedTestStore.state.recordUse = speedTestStore.state.bytesUsed
  speedTestStore.state.recordTime = new Date().getTime() / 1000
}

const speedCtr = () => {
  if (speedTestStore.state.bytesUsed - speedTestStore.state.recordUse > speedTestStore.state.maxSpeed / 8) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(0), 1000 - (new Date().getTime() % 1000))
    })
  }
}

async function startThread(index: number) {
  try {
    if (solvedRunUrl == "") {
      speedTestStore.isRunning = false
      return
    }
    const _url = solvedRunUrl
    const response = await fetch(_url, { cache: "no-store", mode: 'cors', referrerPolicy: 'no-referrer' })
    if (!response.body) throw "Nobody"
    const contentLength = response.headers.get('content-length')
    let realLength = Infinity
    if (contentLength) realLength = parseInt(contentLength)
    const reader = response.body.getReader()
    let decodeLength = 0
    while (true) {
      if (speedTestStore.state.maxSpeed) await speedCtr()
      const { value } = await reader.read()
      const chunkLength = value?.length
      if (!chunkLength || solvedRunUrl != _url) {
        startThread(index)
        break
      }
      let usefulChunkLength = chunkLength
      if (decodeLength >= realLength) {
        usefulChunkLength = 0
      } else if (decodeLength + chunkLength > realLength) {
        usefulChunkLength = realLength - decodeLength
      }
      speedTestStore.state.bytesUsed += usefulChunkLength
      if (index >= speedTestStore.threadNum || !speedTestStore.isRunning) break
      decodeLength += chunkLength
    }
    reader.cancel()
  } catch (err) {
    console.log(err)
    if (speedTestStore.isRunning) startThread(index)
  }
}

const editMaxUse = () => {
  const map = { "MB": 1024 * 1024, "GB": 1024 * 1024 * 1024, "TB": 1024 * 1024 * 1024 * 1024 }
  let tmp = 0
  if (maxUseInput.value.num) {
    tmp = Math.floor(maxUseInput.value.num * map[maxUseInput.value.type])
  }
  speedTestStore.setMaxUse(tmp)
  maxUseInput.value.num = null
  EditMaxVisible.value = false
}

const editSpeedUse = () => {
  const map = { "Kbps": 1024, "Mbps": 1024 * 1024, "Gbps": 1024 * 1024 * 1024 }
  let tmp = 0
  if (maxSpeedInput.value.num) {
    tmp = Math.floor(maxSpeedInput.value.num * map[maxSpeedInput.value.type])
  }
  speedTestStore.setMaxSpeed(tmp)
  maxSpeedInput.value.num = null
  EditSpeedVisible.value = false
}

onMounted(() => {
  if (speedTestStore.autoStart) tryStart()
})

onUnmounted(() => {
  tasks.forEach(i => clearInterval(i))
  tasks = []
})
</script>

<style scoped>
.card {
  max-width: 800px;
  height: fit-content;
  display: block;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 2%
}

@media (prefers-color-scheme: dark) {
  .card {
    background-color: rgb(18, 18, 18);
  }
}

.svg-icon {
  fill: rgb(255, 255, 255);
  width: 50px;
  margin-left: 10px;
  margin-top: -30px;
}

.el-icon-loading {
  margin-top: 40px;
  color: rgb(255, 255, 255);
}

@media (prefers-color-scheme: dark) {
  .svg-icon {
    fill: rgb(220, 220, 220);
  }
}

.button {
  display: block;
  text-decoration: none;
  background-color: #485bed;
  background-image: -webkit-linear-gradient(145deg, #485bed, #6576ff);
  font-size: 30px;
  font-weight: 700 !important;
  margin: 36px;
  width: 144px;
  height: 144px;
  position: relative;
  text-align: center;
  line-height: 144px;
  border-radius: 50%;
  box-shadow: 0px 3px 8px #485bed, inset 0px 2px 3px #6576ff;
}
</style>
