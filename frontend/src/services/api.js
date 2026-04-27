const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const USER_STORAGE_KEY = 'shop_user_v1'

const getAuthToken = () => {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)?.token || null
  } catch {
    return null
  }
}

const request = async (path, options = {}) => {
  if (!API_BASE_URL) return null

  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  async getProducts() {
    const data = await request('/products')
    return data?.products || []
  },
  async login(payload) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data?.user || null
  },
  async placeOrder(payload) {
    const data = await request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data?.order || null
  },
}
