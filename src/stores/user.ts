import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginInfo } from '@/types/user'
import { storage } from '@/services/storage'
import { encrypt, decrypt } from '@/services/crypto'

export const useUserStore = defineStore('user', () => {
  const encryptedToken = storage.get('AccessToken', '')
  const accessToken = ref<string>(encryptedToken ? decrypt(encryptedToken) : '')

  const setAccessToken = (token: string) => {
    accessToken.value = token
    storage.set('AccessToken', encrypt(token))
  }

  const clearAccessToken = () => {
    accessToken.value = ''
    storage.remove('AccessToken')
  }

  return {
    accessToken,
    setAccessToken,
    clearAccessToken
  }
})
