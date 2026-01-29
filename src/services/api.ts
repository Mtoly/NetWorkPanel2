export const api = async (action: string, args?: Record<string, any>) => {
  const url = new URL(action, import.meta.env.VITE_API_URL)
  const response = await fetch(url.toString(), {
    method: args ? 'POST' : 'GET',
    mode: 'cors',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    headers: args ? { 'Content-Type': 'application/json' } : undefined,
    body: args ? JSON.stringify(args) : undefined
  })
  return await response.json()
}

export const apiGet = async (action: string, params?: string[][]) => {
  const searchParams = new URLSearchParams(params)
  searchParams.append('cache', window.location.host)
  const url = `${import.meta.env.VITE_API_URL}${action}?${searchParams.toString()}`
  const response = await fetch(url, {
    mode: 'cors',
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  })
  return await response.json()
}
