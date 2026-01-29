import type { UrlCheckResult } from '@/types/speedTest'

const BLOCK_LIST = ['ljxnet.cn', 'netart.cn', '.gov.cn']

export const checkUrl = async (url: string): Promise<UrlCheckResult> => {
  try {
    const structUrl = new URL(url)
    if (BLOCK_LIST.some((i) => structUrl.host.endsWith(i))) {
      throw '你不对劲，我要拿小本本把你记下来然后交给警察蜀黍！'
    }

    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 5000)
    const response = await fetch(url, {
      cache: 'no-store',
      mode: 'cors',
      referrerPolicy: 'no-referrer',
      signal: controller.signal
    })
    clearTimeout(id)

    if (response.status === 404) throw '资源响应异常' + response.status
    if (!response.body) throw '资源响应异常 Nobody'

    const reader = response.body.getReader()
    const { value } = await reader.read()
    if (!value || value.length <= 0) throw '资源响应异常 Nobody'
    reader.cancel()

    return { status: true, info: '' }
  } catch (err) {
    return {
      status: false,
      info: err instanceof Error ? err.message : String(err)
    }
  }
}

export const formatter = (num: number, desIndex: number, flo: number[]): string => {
  const describeString = [
    ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
    ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s'],
    ['Bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps', 'Pbps']
  ]
  const describe = describeString[desIndex]
  let cnum = num
  let total_index = 0
  while (cnum >= 1024) {
    if (total_index === describe.length - 1) break
    cnum = cnum / 1024
    total_index++
  }
  return cnum.toFixed(flo[total_index]) + describe[total_index]
}

export const urlParser = (ipt: string): string => {
  try {
    const match = ipt.match(/https?:\/\/([\w-]+\.)+[\w-]+(:[0-9]+)?(\/\S*)?/)
    if (!match) return ''
    const url = new URL(match[0])
    if (!['http:', 'https:'].includes(url.protocol)) return ''
    if (url.hostname.length > 253) return ''
    return match[0]
  } catch {
    return ''
  }
}
