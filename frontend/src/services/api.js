const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const USER_STORAGE_KEY = 'shop_user_v1'
const API_ENABLED = Boolean(API_BASE_URL)

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
  if (!API_ENABLED) return null

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
    const error = new Error(`API request failed with status ${response.status} ${response.statusText}`)
    error.status = response.status
    throw error
  }

  if (response.status === 204) return null
  return response.json()
}

export const api = {
  isEnabled: API_ENABLED,
  async getProducts() {
    const data = await request('/products')
    return data?.products || []
  },
  async getProductFilters() {
    const data = await request('/products/filters')
    return data || null
  },
  async getProductReviews(productId) {
    const data = await request(`/products/${productId}/reviews`)
    return data?.reviews || []
  },
  async createProductReview(productId, payload) {
    const data = await request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data?.review || null
  },
  async getRecommendations(params = {}) {
    const query = new URLSearchParams(params).toString()
    const data = await request(`/recommendations${query ? `?${query}` : ''}`)
    return data?.products || []
  },
  async visualSearch(payload) {
    const data = await request('/visual-search', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data?.matches || []
  },
  async getTryOnAssets(productId) {
    const data = await request(`/try-on/${productId}`)
    return data || null
  },
  async trackEvent(payload) {
    const data = await request('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data || null
  },
  async getAnalytics() {
    const data = await request('/analytics')
    return data || null
  },
  async login(payload) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data?.user || null
  },
  async requestPasswordReset(payload) {
    const data = await request('/auth/password/forgot', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data || null
  },
  async resetPassword(payload) {
    const data = await request('/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data || null
  },
  async getProfile() {
    const data = await request('/profile')
    return data?.user || null
  },
  async updateProfile(payload) {
    const data = await request('/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    return data?.user || null
  },
  async getAddresses() {
    const data = await request('/addresses')
    return data?.addresses || []
  },
  async createAddress(payload) {
    const data = await request('/addresses', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data?.address || null
  },
  async updateAddress(id, payload) {
    const data = await request(`/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    return data?.address || null
  },
  async deleteAddress(id) {
    const data = await request(`/addresses/${id}`, { method: 'DELETE' })
    return data || null
  },
  async getOrders() {
    const data = await request('/orders')
    return data?.orders || []
  },
  async placeOrder(payload) {
    const data = await request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data?.order || null
  },
  async getWishlist() {
    const data = await request('/wishlist')
    return data?.items || []
  },
  async addWishlistItem(payload) {
    const data = await request('/wishlist', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data?.item || null
  },
  async removeWishlistItem(id) {
    const data = await request(`/wishlist/${id}`, { method: 'DELETE' })
    return data || null
  },
  async getPaymentMethods() {
    const data = await request('/payment-methods')
    return data?.methods || []
  },
  async addPaymentMethod(payload) {
    const data = await request('/payment-methods', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return data?.method || null
  },
  async removePaymentMethod(id) {
    const data = await request(`/payment-methods/${id}`, { method: 'DELETE' })
    return data || null
  },
  async getNotifications() {
    const data = await request('/notifications')
    return data?.notifications || []
  },
  async markNotificationRead(id) {
    const data = await request(`/notifications/${id}/read`, { method: 'PATCH' })
    return data?.notification || null
  },
  async getLoyaltyPoints() {
    const data = await request('/loyalty-points')
    return data?.points ?? 0
  },
}
