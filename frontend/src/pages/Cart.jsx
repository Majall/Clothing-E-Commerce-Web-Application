import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import QuantityInput from '../components/QuantityInput'
import { useShop } from '../context/useShop'
import { getCouponLabel, getShippingLabel } from '../utils/coupon'

const Cart = () => {
  const {
    cartItems,
    subtotal,
    baseShipping,
    shipping,
    discount,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
    removeFromCart,
    updateCartQuantity,
  } = useShop()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [couponStatus, setCouponStatus] = useState(null)

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode)
    setCouponStatus({ type: result.ok ? 'success' : 'error', message: result.message })
    if (result.ok) {
      setCouponCode('')
    }
  }

  if (!cartItems.length) {
    return (
      <EmptyState
        title='Your cart is empty'
        description='Browse our collection and add products to continue.'
        action={
          <Link to='/collection' className='inline-block rounded-md bg-black px-5 py-2.5 text-sm text-white'>
            Start shopping
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <PageHeader title='Your Cart' subtitle='Review your selected items before checkout.' />

      <div className='space-y-4'>
        {cartItems.map((item) => (
          <article
            key={item.sku}
            className='grid gap-4 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-[96px_1fr_auto] md:items-center'
          >
            <img src={item.product.image[0]} alt={item.product.name} className='h-24 w-24 rounded-md object-cover' />
            <div>
              <h2 className='font-semibold text-gray-900'>{item.product.name}</h2>
              <p className='text-sm text-gray-600'>Size: {item.size}</p>
              <p className='mt-1 font-semibold text-gray-900'>৳{item.product.price}</p>
            </div>
            <div className='flex items-center gap-3'>
              <QuantityInput value={item.quantity} onChange={(value) => updateCartQuantity(item.sku, value)} />
              <button
                className='rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50'
                onClick={() => removeFromCart(item.sku)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside className='mt-8 ml-auto max-w-md rounded-lg border border-gray-200 bg-white p-5'>
        <h3 className='text-lg font-semibold text-gray-900'>Order summary</h3>
        <div className='mt-4 space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span>Subtotal</span>
            <span>৳{subtotal}</span>
          </div>
          {coupon ? (
            <div className='flex justify-between text-green-700'>
              <span>Coupon ({coupon.code})</span>
              <span>{getCouponLabel(coupon, discount)}</span>
            </div>
          ) : null}
          <div className='flex justify-between'>
            <span>Shipping</span>
            <span>{getShippingLabel({ shipping, coupon, baseShipping })}</span>
          </div>
          <div className='flex justify-between border-t border-gray-200 pt-2 text-base font-bold'>
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>

        <div className='mt-5 space-y-2'>
          <p className='text-sm font-semibold text-gray-800'>Apply coupon</p>
          <div className='flex gap-2'>
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              placeholder='Enter coupon code'
              className='flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
            />
            <button
              type='button'
              onClick={handleApplyCoupon}
              className='rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100'
            >
              Apply
            </button>
          </div>
          {coupon ? (
            <div className='flex items-center justify-between text-xs text-green-700'>
              <span>{coupon.code} applied</span>
              <button
                type='button'
                onClick={() => {
                  removeCoupon()
                  setCouponStatus({ type: 'success', message: 'Coupon removed.' })
                }}
                className='font-semibold text-gray-700 hover:text-black'
              >
                Remove
              </button>
            </div>
          ) : null}
          {couponStatus?.message ? (
            <p className={`text-xs ${couponStatus.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {couponStatus.message}
            </p>
          ) : null}
        </div>

        <div className='mt-6 space-y-2'>
          <button
            onClick={() => navigate('/placeorder')}
            className='w-full rounded-md bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800'
          >
            Continue to Checkout
          </button>
          <Link
            to='/collection'
            className='block w-full rounded-md border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-100'
          >
            Continue shopping
          </Link>
        </div>
      </aside>
    </div>
  )
}

export default Cart
