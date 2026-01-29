export interface RankingUser {
  user: string
  headimg: string
  data: string | number
  isp: string
  addr: string
  short: string
  type: string
}

export interface RankingQuery {
  grade: string
  sorted_by: string
  isPast: boolean
}

export interface LoginStatus {
  status: number
  uin?: number
  nick?: string
  data?: RankData
  AccessToken?: string
  session?: string
  img?: string
  url?: string
  msg?: string
}

export interface RankData {
  now: {
    [key: number]: {
      allUsed: [number, number]
      averageSpeed: [number, number]
      onlineTime: [number, number]
    }
  }
  prev: {
    [key: number]: {
      allUsed: [number, number]
      averageSpeed: [number, number]
      onlineTime: [number, number]
    }
  }
}

export interface UserStats {
  des: string
  allUsed: string | number
  averageSpeed: string | number
  onlineTime: string | number
}
