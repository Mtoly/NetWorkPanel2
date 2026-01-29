export interface LoginInfo {
  AccessToken: string
}

export interface RankData {
  now: Record<number, Record<string, [number, number]>>
  prev: Record<number, Record<string, [number, number]>>
}

export interface UserStatus {
  uin: number
  nick: string
  data: RankData
}
