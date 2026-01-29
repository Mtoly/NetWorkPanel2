import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY || 'NetworkPanel_Default_Key_2024'

export const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
}

export const decrypt = (ciphertext: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return ''
  }
}
