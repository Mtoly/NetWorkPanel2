import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { SpeedTestState } from '@/types/speedTest'
import { storage } from '@/services/storage'

export const useSpeedTestStore = defineStore('speedTest', () => {
  const state = reactive<SpeedTestState>({
    show: {
      allUsed: '-',
      speed: '-',
      speedBit: '-'
    },
    predict: {
      min: '-',
      hour: '-',
      day: '-',
      mon: '-'
    },
    isChecking: false,
    bytesUsed: 0,
    logged: 0,
    lastLogTime: 0,
    recordUse: 0,
    recordTime: 0,
    startUse: 0,
    startTime: 0,
    maxUse: storage.get('maxUse', 0),
    maxSpeed: storage.get('maxSpeed', 0)
  })

  const isRunning = ref(false)
  const threadNum = ref<number>(storage.get('threadNum', 8))
  const runBackground = ref<boolean>(storage.get('runBackground', false))
  const autoStart = ref<boolean>(storage.get('autoStart', false))
  const chartShow = ref<boolean>(storage.get('chartShow', false))

  const setThreadNum = (num: number) => {
    threadNum.value = num
    storage.set('threadNum', num)
  }

  const setRunBackground = (value: boolean) => {
    runBackground.value = value
    storage.set('runBackground', value)
  }

  const setAutoStart = (value: boolean) => {
    autoStart.value = value
    storage.set('autoStart', value)
  }

  const setChartShow = (value: boolean) => {
    chartShow.value = value
    storage.set('chartShow', value)
  }

  const setMaxUse = (value: number) => {
    state.maxUse = value
    storage.set('maxUse', value)
  }

  const setMaxSpeed = (value: number) => {
    state.maxSpeed = value
    storage.set('maxSpeed', value)
  }

  return {
    state,
    isRunning,
    threadNum,
    runBackground,
    autoStart,
    chartShow,
    setThreadNum,
    setRunBackground,
    setAutoStart,
    setChartShow,
    setMaxUse,
    setMaxSpeed
  }
})
