export const storage = {
  get<T>(key: string, defaultValue: T): T {
    const value = localStorage.getItem(key)
    if (!value) return defaultValue
    try {
      return JSON.parse(value)
    } catch {
      return value as T
    }
  },

  set(key: string, value: any): void {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
  },

  remove(key: string): void {
    localStorage.removeItem(key)
  },

  clear(): void {
    localStorage.clear()
  }
}
