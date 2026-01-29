export function formatter(num: number, desIndex: number, flo?: number[]): string {
  const defaultFlo = [0, 0, 0, 1, 1, 1]
  const floArray = flo || defaultFlo
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
  return cnum.toFixed(floArray[total_index]) + describe[total_index]
}

export function timeFormatter(n: number): string {
  if (n < 60) return n.toFixed(0) + '秒'
  n /= 60
  if (n < 60) return n.toFixed(0) + '分钟'
  n /= 60
  if (n < 24) return n.toFixed(0) + '小时'
  n /= 24
  return n.toFixed(0) + '天'
}
