import type { RankingQuery, LoginStatus } from '@/types/ranking'

const API_BASE = import.meta.env.VITE_API_URL

export const rankingApi = {
  async getRankings(query: RankingQuery) {
    const params = new URLSearchParams({
      grade: query.grade,
      sorted_by: query.sorted_by,
      isPast: query.isPast ? 'true' : 'false',
      cache: window.location.host
    })
    const response = await fetch(`${API_BASE}get.ajax?${params}`, {
      mode: 'cors',
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
    })
    return await response.json()
  },

  async thirdQQLogin(accessToken: string): Promise<LoginStatus> {
    const response = await fetch(`${API_BASE}third_qq_login`, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ AccessToken: accessToken })
    })
    return await response.json()
  },

  async thirdQQCheck(session: string): Promise<LoginStatus> {
    const response = await fetch(`${API_BASE}third_qq_check`, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session })
    })
    return await response.json()
  },

  async thirdQQBind(uin: string, session: string): Promise<LoginStatus> {
    const response = await fetch(`${API_BASE}third_qq_bind`, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uin, session })
    })
    return await response.json()
  },

  async getStatus(accessToken: string): Promise<LoginStatus> {
    const response = await fetch(`${API_BASE}get_status`, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ AccessToken: accessToken })
    })
    return await response.json()
  },

  async kickOld(accessToken: string): Promise<LoginStatus> {
    const response = await fetch(`${API_BASE}kick_old`, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ AccessToken: accessToken })
    })
    return await response.json()
  },

  async uploadLog(data: {
    AccessToken: string
    url: string
    threadNum: number
    used: number
    time: number
  }) {
    const response = await fetch(`${API_BASE}log`, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await response.json()
  }
}
