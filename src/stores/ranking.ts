import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RankData } from '@/types/ranking'
import { rankingApi } from '@/services/ranking'
import { storage } from '@/services/storage'
import { encrypt, decrypt } from '@/services/crypto'

export const useRankingStore = defineStore('ranking', () => {
  const loginStatus = ref(0)
  const uin = ref(0)
  const nick = ref('')
  const rankData = ref<RankData>({ now: {}, prev: {} })
  const session = ref('')
  
  const encryptedToken = storage.get('RankingAccessToken', '')
  const accessToken = ref<string>(encryptedToken ? decrypt(encryptedToken) : '')

  const setAccessToken = (token: string) => {
    accessToken.value = token
    storage.set('RankingAccessToken', encrypt(token))
  }

  const clearAccessToken = () => {
    accessToken.value = ''
    storage.remove('RankingAccessToken')
    loginStatus.value = 0
  }

  const setLoginStatus = (status: number) => {
    loginStatus.value = status
  }

  const setUserInfo = (qqUin: number, nickname: string, data: RankData) => {
    uin.value = qqUin
    nick.value = nickname
    rankData.value = data
  }

  const setSession = (sessionId: string) => {
    session.value = sessionId
    storage.set('third_qq_login_session', sessionId)
  }

  const clearSession = () => {
    session.value = ''
    storage.remove('third_qq_login_session')
  }

  const getSession = () => {
    return storage.get('third_qq_login_session', '')
  }

  return {
    loginStatus,
    uin,
    nick,
    rankData,
    accessToken,
    session,
    setAccessToken,
    clearAccessToken,
    setLoginStatus,
    setUserInfo,
    setSession,
    clearSession,
    getSession
  }
})
