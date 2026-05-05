import { useCallback, useEffect, useMemo, useState } from 'react'
import { products as localProducts } from '../assets/frontend_assets/assets'
import { featureFlags } from '../config/features'
import { api } from '../services/api'
import { enhanceProduct } from '../utils/productEnhancers'
import { ShopContext } from './context'

const CART_STORAGE_KEY = 'shop_cart_v1'
const ORDERS_STORAGE_KEY = 'shop_orders_v1'
const USER_STORAGE_KEY = 'shop_user_v1'
const COUPON_STORAGE_KEY = 'shop_coupon_v1'
const ADDRESS_STORAGE_KEY = 'shop_addresses_v1'
const WISHLIST_STORAGE_KEY = 'shop_wishlist_v1'
const PAYMENT_STORAGE_KEY = 'shop_payment_methods_v1'
const NOTIFICATION_STORAGE_KEY = 'shop_notifications_v1'
const LOYALTY_STORAGE_KEY = 'shop_loyalty_points_v1'
const RECENTLY_VIEWED_STORAGE_KEY = 'shop_recently_viewed_v1'
const FREE_SHIPPING_THRESHOLD = 500
const STANDARD_SHIPPING_FEE = 40
const AVAILABLE_COUPONS = [
  { code: 'WELCOME10', type: 'percent', value: 10, description: '10% off your order' },
  { code: 'SAVE50', type: 'amount', value: 50, description: '৳50 off your order' },
  { code: 'FREESHIP', type: 'shipping', value: 0, description: 'Free standard shipping' },
]

const parseStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState(() => parseStored(CART_STORAGE_KEY, {}))
  const [localOrders, setLocalOrders] = useState(() => parseStored(ORDERS_STORAGE_KEY, []))
  const [remoteOrders, setRemoteOrders] = useState([])
  const [user, setUser] = useState(() => parseStored(USER_STORAGE_KEY, null))
  const [coupon, setCoupon] = useState(() => parseStored(COUPON_STORAGE_KEY, null))
  const [addresses, setAddresses] = useState(() => parseStored(ADDRESS_STORAGE_KEY, []))
  const [wishlistItems, setWishlistItems] = useState(() => parseStored(WISHLIST_STORAGE_KEY, []))
  const [paymentMethods, setPaymentMethods] = useState(() => parseStored(PAYMENT_STORAGE_KEY, []))
  const [notifications, setNotifications] = useState(() => parseStored(NOTIFICATION_STORAGE_KEY, []))
  const [loyaltyPoints, setLoyaltyPoints] = useState(() => parseStored(LOYALTY_STORAGE_KEY, 0))
  const [recentlyViewed, setRecentlyViewed] = useState(() => parseStored(RECENTLY_VIEWED_STORAGE_KEY, []))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')

  const hasApiSession = Boolean(api.isEnabled && user?.token)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const remoteProducts = await api.getProducts()
        const source = remoteProducts.length ? remoteProducts : localProducts
        setProducts(source.map((item) => enhanceProduct(item)))
      } catch {
        setError('Unable to load products from API. Showing local catalog.')
        setProducts(localProducts.map((item) => enhanceProduct(item)))
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (!hasApiSession) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(localOrders))
    }
  }, [localOrders, hasApiSession])

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
      return
    }
    localStorage.removeItem(USER_STORAGE_KEY)
  }, [user])

  useEffect(() => {
    if (coupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon))
      return
    }
    localStorage.removeItem(COUPON_STORAGE_KEY)
  }, [coupon])

  useEffect(() => {
    if (!hasApiSession) {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses))
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems))
      localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(paymentMethods))
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications))
      localStorage.setItem(LOYALTY_STORAGE_KEY, JSON.stringify(loyaltyPoints))
    }
  }, [addresses, wishlistItems, paymentMethods, notifications, loyaltyPoints, hasApiSession])

  useEffect(() => {
    localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(recentlyViewed))
  }, [recentlyViewed])

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([sku, quantity]) => {
          const [productId, size, color] = sku.split('|')
          const product = products.find((item) => item._id === productId)
          if (!product) return null

          const normalizedColor = !color || color === 'default' ? product.colors?.[0] || '' : color

          return {
            sku,
            productId,
            size,
            color: normalizedColor,
            quantity,
            product,
            lineTotal: product.price * quantity,
          }
        })
        .filter(Boolean),
    [cart, products],
  )

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.lineTotal, 0),
    [cartItems],
  )

  const baseShipping = useMemo(() => {
    if (!subtotal) return 0
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
  }, [subtotal])

  const shipping = useMemo(() => (coupon?.type === 'shipping' ? 0 : baseShipping), [coupon, baseShipping])

  const discount = useMemo(() => {
    if (!coupon || !subtotal) return 0
    if (coupon.type === 'percent') {
      return Math.floor((subtotal * coupon.value) / 100)
    }
    if (coupon.type === 'amount') {
      return Math.floor(Math.min(subtotal, coupon.value))
    }
    return 0
  }, [coupon, subtotal])

  const total = useMemo(() => Math.max(subtotal - discount + shipping, 0), [subtotal, discount, shipping])

  const orders = useMemo(
    () => (hasApiSession ? remoteOrders : localOrders),
    [hasApiSession, remoteOrders, localOrders],
  )

  const defaultAddress = useMemo(() => addresses.find((item) => item.isDefault), [addresses])

  const availableFilters = useMemo(() => {
    const colors = new Set()
    const fabrics = new Set()
    const styleTags = new Set()
    let minPrice = Number.POSITIVE_INFINITY
    let maxPrice = 0

    products.forEach((product) => {
      product.colors?.forEach((color) => colors.add(color))
      product.styleTags?.forEach((tag) => styleTags.add(tag))
      if (product.fabric) fabrics.add(product.fabric)
      minPrice = Math.min(minPrice, product.price)
      maxPrice = Math.max(maxPrice, product.price)
    })

    return {
      colors: [...colors],
      fabrics: [...fabrics],
      styleTags: [...styleTags],
      minPrice: Number.isFinite(minPrice) ? minPrice : 0,
      maxPrice,
    }
  }, [products])

  const recordProductView = (productId) => {
    if (!productId) return
    setRecentlyViewed((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)]
      return next.slice(0, 10)
    })

    if (api.isEnabled) {
      api
        .trackEvent({ productId, eventType: 'view' })
        .catch(() => {})
    }
  }

  const getRecommendations = (baseProduct) => {
    if (!products.length) return []
    if (!baseProduct) {
      const viewed = recentlyViewed.map((id) => products.find((item) => item._id === id)).filter(Boolean)
      if (viewed.length) {
        return viewed
      }
      return products.filter((item) => item.bestseller).slice(0, 6)
    }

    const related = products.filter(
      (item) =>
        item._id !== baseProduct._id &&
        (item.category === baseProduct.category ||
          item.styleTags?.some((tag) => baseProduct.styleTags?.includes(tag))),
    )
    return related.slice(0, 6)
  }

  const addToCart = (productId, size, quantity = 1, color = '') => {
    if (!size || quantity < 1) return
    const sku = `${productId}|${size}|${color || 'default'}`

    setCart((prev) => ({
      ...prev,
      [sku]: (prev[sku] || 0) + quantity,
    }))
  }

  const updateCartQuantity = (sku, quantity) => {
    if (quantity <= 0) {
      removeFromCart(sku)
      return
    }

    setCart((prev) => ({ ...prev, [sku]: quantity }))
  }

  const removeFromCart = (sku) => {
    setCart((prev) => {
      const next = { ...prev }
      delete next[sku]
      return next
    })
  }

  const clearCart = () => setCart({})

  const applyCoupon = (code) => {
    const normalized = code.trim().toUpperCase()
    if (!normalized) {
      return { ok: false, message: 'Enter a coupon code to apply.' }
    }
    if (!subtotal) {
      return { ok: false, message: 'Add items to your cart before applying a coupon.' }
    }
    const matched = AVAILABLE_COUPONS.find((item) => item.code === normalized)
    if (!matched) {
      return { ok: false, message: 'Invalid coupon code.' }
    }
    setCoupon(matched)
    return { ok: true, message: `${matched.code} applied successfully.` }
  }

  const removeCoupon = () => setCoupon(null)

  const refreshProfile = useCallback(async () => {
    if (!hasApiSession) return null

    try {
      const profile = await api.getProfile()
      if (profile) {
        setUser((prev) => (prev ? { ...prev, ...profile } : profile))
      }
      return profile
    } catch {
      return null
    }
  }, [hasApiSession])

  const updateProfile = async ({ name, email, phone }) => {
    if (!hasApiSession) {
      const updated = { ...(user || {}), name, email, phone }
      setUser(updated)
      return { ok: true, user: updated }
    }

    try {
      const updated = await api.updateProfile({ name, email, phone })
      if (updated) {
        setUser((prev) => (prev ? { ...prev, ...updated } : updated))
      }
      return { ok: true, user: updated }
    } catch {
      return { ok: false, message: 'Unable to update profile. Please try again.' }
    }
  }

  const loadOrders = useCallback(async () => {
    if (!hasApiSession) return
    setOrdersLoading(true)
    setOrdersError('')

    try {
      const remote = await api.getOrders()
      setRemoteOrders(remote)
    } catch {
      setOrdersError('Unable to load order history from the server.')
    } finally {
      setOrdersLoading(false)
    }
  }, [hasApiSession])

  const loadAddresses = useCallback(async () => {
    if (!hasApiSession) {
      setAddresses(parseStored(ADDRESS_STORAGE_KEY, []))
      return
    }

    try {
      const remote = await api.getAddresses()
      setAddresses(remote)
    } catch {
      setAddresses([])
    }
  }, [hasApiSession])

  const addAddress = async (payload) => {
    if (hasApiSession) {
      try {
        const created = await api.createAddress(payload)
        if (created) {
          setAddresses((prev) => {
            const next = created.isDefault
              ? prev.map((item) => ({ ...item, isDefault: false }))
              : prev
            return [created, ...next]
          })
        }
        return { ok: true, address: created }
      } catch {
        return { ok: false, message: 'Unable to save address. Please try again.' }
      }
    }

    const id = `addr-${Date.now()}`
    setAddresses((prev) => {
      const next = payload.isDefault
        ? prev.map((item) => ({ ...item, isDefault: false }))
        : prev
      const hasDefault = next.some((item) => item.isDefault)
      return [
        {
          ...payload,
          id,
          isDefault: payload.isDefault || !hasDefault,
        },
        ...next,
      ]
    })

    return { ok: true, address: { ...payload, id } }
  }

  const updateAddress = async (id, payload) => {
    if (hasApiSession) {
      try {
        const updated = await api.updateAddress(id, payload)
        if (updated) {
          setAddresses((prev) =>
            prev.map((item) =>
              item.id === id
                ? updated
                : updated.isDefault
                  ? { ...item, isDefault: false }
                  : item,
            ),
          )
        }
        return { ok: true, address: updated }
      } catch {
        return { ok: false, message: 'Unable to update address.' }
      }
    }

    setAddresses((prev) => {
      const hasDefault = prev.some((item) => item.isDefault && item.id !== id)
      return prev.map((item) => {
        if (item.id !== id) {
          return payload.isDefault ? { ...item, isDefault: false } : item
        }
        return {
          ...item,
          ...payload,
          isDefault: payload.isDefault || !hasDefault,
        }
      })
    })

    return { ok: true }
  }

  const deleteAddress = async (id) => {
    if (hasApiSession) {
      try {
        await api.deleteAddress(id)
        setAddresses((prev) => {
          const next = prev.filter((item) => item.id !== id)
          if (!next.some((item) => item.isDefault) && next.length > 0) {
            next[0] = { ...next[0], isDefault: true }
          }
          return [...next]
        })
        return { ok: true }
      } catch {
        return { ok: false, message: 'Unable to delete address.' }
      }
    }

    setAddresses((prev) => {
      const next = prev.filter((item) => item.id !== id)
      if (!next.some((item) => item.isDefault) && next.length > 0) {
        next[0] = { ...next[0], isDefault: true }
      }
      return [...next]
    })

    return { ok: true }
  }

  const loadWishlist = useCallback(async () => {
    if (!featureFlags.wishlist) return

    if (!hasApiSession) {
      setWishlistItems(parseStored(WISHLIST_STORAGE_KEY, []))
      return
    }

    try {
      const remote = await api.getWishlist()
      setWishlistItems(remote)
    } catch {
      setWishlistItems([])
    }
  }, [hasApiSession])

  const addWishlistItem = async ({ productId, size }) => {
    if (!featureFlags.wishlist) return { ok: false, message: 'Wishlist is disabled.' }

    if (hasApiSession) {
      try {
        const created = await api.addWishlistItem({ productId, size })
        if (created) {
          setWishlistItems((prev) => [created, ...prev.filter((item) => item.id !== created.id)])
        }
        return { ok: true, item: created }
      } catch {
        return { ok: false, message: 'Unable to update wishlist.' }
      }
    }

    const product = products.find((item) => item._id === productId)
    if (!product) return { ok: false, message: 'Select a valid product.' }

    const id = `wish-${Date.now()}`
    const item = {
      id,
      productId,
      size,
      product,
      createdAt: new Date().toISOString(),
    }
    setWishlistItems((prev) => [item, ...prev])
    return { ok: true, item }
  }

  const removeWishlistItem = async (id) => {
    if (!featureFlags.wishlist) return { ok: false, message: 'Wishlist is disabled.' }

    if (hasApiSession) {
      try {
        await api.removeWishlistItem(id)
        setWishlistItems((prev) => prev.filter((item) => item.id !== id))
        return { ok: true }
      } catch {
        return { ok: false, message: 'Unable to remove wishlist item.' }
      }
    }

    setWishlistItems((prev) => prev.filter((item) => item.id !== id))
    return { ok: true }
  }

  const loadPaymentMethods = useCallback(async () => {
    if (!featureFlags.paymentMethods) return

    if (!hasApiSession) {
      setPaymentMethods(parseStored(PAYMENT_STORAGE_KEY, []))
      return
    }

    try {
      const remote = await api.getPaymentMethods()
      setPaymentMethods(remote)
    } catch {
      setPaymentMethods([])
    }
  }, [hasApiSession])

  const addPaymentMethod = async (payload) => {
    if (!featureFlags.paymentMethods) return { ok: false, message: 'Saved payments are disabled.' }

    if (hasApiSession) {
      try {
        const created = await api.addPaymentMethod(payload)
        if (created) {
          setPaymentMethods((prev) => {
            const next = created.isDefault
              ? prev.map((item) => ({ ...item, isDefault: false }))
              : prev
            return [created, ...next]
          })
        }
        return { ok: true, method: created }
      } catch {
        return { ok: false, message: 'Unable to save payment method.' }
      }
    }

    const id = `pm-${Date.now()}`
    setPaymentMethods((prev) => {
      const next = payload.isDefault
        ? prev.map((item) => ({ ...item, isDefault: false }))
        : prev
      const hasDefault = next.some((item) => item.isDefault)
      return [
        {
          ...payload,
          id,
          isDefault: payload.isDefault || !hasDefault,
        },
        ...next,
      ]
    })
    return { ok: true }
  }

  const removePaymentMethod = async (id) => {
    if (!featureFlags.paymentMethods) return { ok: false, message: 'Saved payments are disabled.' }

    if (hasApiSession) {
      try {
        await api.removePaymentMethod(id)
        setPaymentMethods((prev) => {
          const next = prev.filter((item) => item.id !== id)
          if (!next.some((item) => item.isDefault) && next.length > 0) {
            next[0] = { ...next[0], isDefault: true }
          }
          return [...next]
        })
        return { ok: true }
      } catch {
        return { ok: false, message: 'Unable to delete payment method.' }
      }
    }

    setPaymentMethods((prev) => prev.filter((item) => item.id !== id))
    return { ok: true }
  }

  const loadNotifications = useCallback(async () => {
    if (!featureFlags.notifications) return

    if (!hasApiSession) {
      setNotifications(parseStored(NOTIFICATION_STORAGE_KEY, []))
      return
    }

    try {
      const remote = await api.getNotifications()
      setNotifications(remote)
    } catch {
      setNotifications([])
    }
  }, [hasApiSession])

  const markNotificationRead = async (id) => {
    if (!featureFlags.notifications) return { ok: false, message: 'Notifications are disabled.' }

    if (hasApiSession) {
      try {
        const updated = await api.markNotificationRead(id)
        if (updated) {
          setNotifications((prev) => prev.map((item) => (item.id === id ? updated : item)))
        }
        return { ok: true }
      } catch {
        return { ok: false, message: 'Unable to update notification.' }
      }
    }

    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, readAt: new Date().toISOString() } : item)))
    return { ok: true }
  }

  const loadLoyaltyPoints = useCallback(async () => {
    if (!featureFlags.loyaltyPoints) return

    if (!hasApiSession) {
      setLoyaltyPoints(parseStored(LOYALTY_STORAGE_KEY, 0))
      return
    }

    try {
      const points = await api.getLoyaltyPoints()
      setLoyaltyPoints(points)
    } catch {
      setLoyaltyPoints(0)
    }
  }, [hasApiSession])

  const login = async ({ name, email, password }) => {
    const payload = await api.login({ name, email, password })
    const signedUser = payload || { name: name || 'Customer', email }
    setUser(signedUser)
    return signedUser
  }

  const logout = () => {
    setUser(null)
    setRemoteOrders([])
    setAddresses(parseStored(ADDRESS_STORAGE_KEY, []))
    setWishlistItems(parseStored(WISHLIST_STORAGE_KEY, []))
    setPaymentMethods(parseStored(PAYMENT_STORAGE_KEY, []))
    setNotifications(parseStored(NOTIFICATION_STORAGE_KEY, []))
    setLoyaltyPoints(parseStored(LOYALTY_STORAGE_KEY, 0))
  }

  const placeOrder = async ({ shippingAddress, paymentMethod }) => {
    if (!cartItems.length) {
      return { ok: false, message: 'Your cart is empty.' }
    }

    const orderUser = user || {
      name: shippingAddress.fullName || 'Guest',
      email: shippingAddress.email,
      guest: true,
    }

    const orderPayload = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      user: orderUser,
      items: cartItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      discount,
      total,
      coupon: coupon ? { code: coupon.code, type: coupon.type, value: coupon.value } : null,
      status: 'Confirmed',
      tracking: {
        carrier: 'Express Logistics',
        trackingNumber: `TRK-${Math.floor(Math.random() * 999999)}`,
        eta: new Date(Date.now() + 4 * 86400000).toISOString(),
        history: [
          { status: 'Order confirmed', at: new Date().toISOString() },
          { status: 'Preparing shipment', at: new Date(Date.now() + 86400000).toISOString() },
          { status: 'Out for delivery', at: new Date(Date.now() + 3 * 86400000).toISOString() },
        ],
      },
    }

    const finalizeOrder = (finalOrder) => {
      if (hasApiSession) {
        setRemoteOrders((prev) => [finalOrder, ...prev])
      } else {
        setLocalOrders((prev) => [finalOrder, ...prev])
      }
      clearCart()
      removeCoupon()
      return { ok: true, order: finalOrder }
    }

    if (!hasApiSession) {
      return finalizeOrder(orderPayload)
    }

    try {
        const createdOrder = await api.placeOrder({
          shippingAddress,
          paymentMethod,
          items: cartItems.map((item) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          })),
        })
      return finalizeOrder(createdOrder || orderPayload)
    } catch (error) {
      const status = error && typeof error === 'object' && 'status' in error ? error.status : null
      const message = status === 401
        ? 'Your session expired. Please login again to place the order.'
        : 'Order placement failed while contacting the server. Please try again.'
      return { ok: false, message }
    }
  }

  const requestPasswordReset = async ({ email }) => {
    if (!api.isEnabled) {
      return { ok: false, message: 'Password reset requires the API server.' }
    }

    try {
      const response = await api.requestPasswordReset({ email })
      return { ok: true, ...response }
    } catch {
      return { ok: false, message: 'Unable to request a password reset.' }
    }
  }

  const resetPassword = async ({ email, token, password, passwordConfirmation }) => {
    if (!api.isEnabled) {
      return { ok: false, message: 'Password reset requires the API server.' }
    }

    try {
      const response = await api.resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      })
      return { ok: true, ...response }
    } catch {
      return { ok: false, message: 'Unable to reset password. Please verify the token.' }
    }
  }

  useEffect(() => {
    if (!hasApiSession) {
      setRemoteOrders([])
      return
    }

    refreshProfile()
    loadOrders()
    loadAddresses()
    loadWishlist()
    loadPaymentMethods()
    loadNotifications()
    loadLoyaltyPoints()
  }, [
    hasApiSession,
    refreshProfile,
    loadOrders,
    loadAddresses,
    loadWishlist,
    loadPaymentMethods,
    loadNotifications,
    loadLoyaltyPoints,
  ])

  const value = {
    products,
    isLoading,
    error,
    user,
    orders,
    ordersLoading,
    ordersError,
    cartItems,
    cartCount,
    subtotal,
    baseShipping,
    shipping,
    discount,
    total,
    availableFilters,
    recentlyViewed,
    recordProductView,
    getRecommendations,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
    login,
    logout,
    placeOrder,
    refreshProfile,
    updateProfile,
    addresses,
    defaultAddress,
    loadAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    requestPasswordReset,
    resetPassword,
    featureFlags,
    wishlistItems,
    addWishlistItem,
    removeWishlistItem,
    paymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    notifications,
    markNotificationRead,
    loyaltyPoints,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
