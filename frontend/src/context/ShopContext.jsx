import { useEffect, useMemo, useState } from 'react'
import { products as localProducts } from '../assets/frontend_assets/assets'
import { api } from '../services/api'
import { ShopContext } from './context'

const CART_STORAGE_KEY = 'shop_cart_v1'
const ORDERS_STORAGE_KEY = 'shop_orders_v1'
const USER_STORAGE_KEY = 'shop_user_v1'
const COUPON_STORAGE_KEY = 'shop_coupon_v1'
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
  const [orders, setOrders] = useState(() => parseStored(ORDERS_STORAGE_KEY, []))
  const [user, setUser] = useState(() => parseStored(USER_STORAGE_KEY, null))
  const [coupon, setCoupon] = useState(() => parseStored(COUPON_STORAGE_KEY, null))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const remoteProducts = await api.getProducts()
        setProducts(remoteProducts.length ? remoteProducts : localProducts)
      } catch {
        setError('Unable to load products from API. Showing local catalog.')
        setProducts(localProducts)
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
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

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

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([sku, quantity]) => {
          const [productId, size] = sku.split('|')
          const product = products.find((item) => item._id === productId)
          if (!product) return null

          return {
            sku,
            productId,
            size,
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
      return Math.round((subtotal * coupon.value) / 100)
    }
    if (coupon.type === 'amount') {
      return Math.min(subtotal, coupon.value)
    }
    return 0
  }, [coupon, subtotal])

  const total = useMemo(() => Math.max(subtotal - discount + shipping, 0), [subtotal, discount, shipping])

  const addToCart = (productId, size, quantity = 1) => {
    if (!size || quantity < 1) return
    const sku = `${productId}|${size}`

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

  const login = async ({ name, email, password }) => {
    const payload = await api.login({ name, email, password })
    const signedUser = payload || { name: name || 'Customer', email }
    setUser(signedUser)
    return signedUser
  }

  const logout = () => setUser(null)

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
    }

    try {
      const createdOrder = user ? await api.placeOrder(orderPayload) : null
      const finalOrder = createdOrder || orderPayload
      setOrders((prev) => [finalOrder, ...prev])
      clearCart()
      removeCoupon()
      return { ok: true, order: finalOrder }
    } catch {
      return {
        ok: false,
        message: user
          ? 'Order placement failed while contacting the server. Please try again.'
          : 'Order placement failed. Please check your details and try again.',
      }
    }
  }

  const value = {
    products,
    isLoading,
    error,
    user,
    orders,
    cartItems,
    cartCount,
    subtotal,
    baseShipping,
    shipping,
    discount,
    total,
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
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
