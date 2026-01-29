import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useSpeedTestStore } from '@/stores/speedTest'
import { useNodesStore } from '@/stores/nodes'
import { useUserStore } from '@/stores/user'
import { checkUrl, formatter } from '@/services/speedTest'

export function useSpeedTest(isVisible: boolean) {
  const speedTestStore = useSpeedTestStore()
  const nodesStore = useNodesStore()
  const userStore = useUserStore()

  let tasks: number[] = []
  let solvedRunUrl = ''

  const tryStart = async () => {
    if (nodesStore.runUrl.startsWith("NetworkPanelApi://")) {
      speedTestStore.isRunning = true
      return
    }
    speedTestStore.state.isChecking = true
    const urlStatus = await checkUrl(nodesStore.runUrl)
    speedTestStore.state.isChecking = false
    if (!urlStatus.status) {
      return { success: false, error: urlStatus.info }
    }
    speedTestStore.isRunning = true
    return { success: true }
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

  async function uploadLog() {
    const now = new Date().getTime() / 1000
    const num = speedTestStore.state.bytesUsed - speedTestStore.state.logged
    const time = now - speedTestStore.state.lastLogTime
    speedTestStore.state.logged = speedTestStore.state.bytesUsed
    speedTestStore.state.lastLogTime = now
    const resp = await fetch(import.meta.env.VITE_API_URL + "log", {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        AccessToken: userStore.accessToken,
        url: nodesStore.runUrl,
        threadNum: speedTestStore.threadNum,
        used: num,
        time: time
      })
    })
    const data = await resp.json()
    if (data.status == -1) {
      userStore.clearAccessToken()
    }
  }

  const setTitle = (speed: number = 0) => {
    if (isVisible) {
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
    if (isVisible) setUsed()
    if (speedTestStore.state.maxUse && speedTestStore.state.bytesUsed >= speedTestStore.state.maxUse) {
      speedTestStore.isRunning = false
    }
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

  return {
    tryStart,
    apiSolver,
    uploadLog,
    setTitle,
    setUsed,
    setSpeed,
    frameEvent,
    startThread,
    tasks,
    solvedRunUrl
  }
}
