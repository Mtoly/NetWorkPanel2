export interface SpeedTestState {
  show: {
    allUsed: string
    speed: string
    speedBit: string
  }
  predict: {
    min: string
    hour: string
    day: string
    mon: string
  }
  isChecking: boolean
  bytesUsed: number
  logged: number
  lastLogTime: number
  recordUse: number
  recordTime: number
  startUse: number
  startTime: number
  maxUse: number
  maxSpeed: number
}

export interface SpeedTestConfig {
  threadNum: number
  runUrl: string
  runBackground: boolean
  autoStart: boolean
  maxUse: number
  maxSpeed: number
}

export interface UrlCheckResult {
  status: boolean
  info: string
}
