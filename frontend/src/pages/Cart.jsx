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
            <Link
              to='/collection'
              className='btn btn-primary inline-block px-5 py-2.5 text-sm'
            >
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
            className='panel grid gap-4 p-4 md:grid-cols-[96px_1fr_auto] md:items-center'
          >
            <img
              src={item.product.image[0]}
              alt={item.product.name}
              className='h-24 w-24 rounded-md object-cover'
              loading='lazy'
              decoding='async'
            />
            <div>
              <h2 className='font-semibold text-foreground'>{item.product.name}</h2>
              <p className='text-sm text-muted'>
                Size: {item.size} {item.color ? `• Color: ${item.color}` : ''}
              </p>
              <p className='mt-1 font-semibold text-foreground'>৳{item.product.price}</p>
            </div>
            <div className='flex items-center gap-3'>
              <QuantityInput value={item.quantity} onChange={(value) => updateCartQuantity(item.sku, value)} />
              <button
                className='btn btn-destructive px-3 py-2 text-xs'
                onClick={() => removeFromCart(item.sku)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside className='mt-8 ml-auto max-w-md rounded-2xl border border-border bg-card p-5 shadow-sm'>
        <h3 className='text-lg font-semibold text-foreground'>Order summary</h3>
        <div className='mt-4 space-y-2 text-sm text-muted'>
          <div className='flex justify-between'>
            <span>Subtotal</span>
            <span>৳{subtotal}</span>
          </div>
          {coupon ? (
            <div className='flex justify-between text-success'>
              <span>Coupon ({coupon.code})</span>
              <span>{getCouponLabel(coupon, discount)}</span>
            </div>
          ) : null}
          <div className='flex justify-between'>
            <span>Shipping</span>
            <span>{getShippingLabel({ shipping, coupon, baseShipping })}</span>
          </div>
          <div className='flex justify-between border-t border-border pt-2 text-base font-semibold text-foreground'>
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>

        <div className='mt-5 space-y-2'>
          <p className='text-sm font-semibold text-foreground'>Apply coupon</p>
          <div className='flex gap-2'>
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
              placeholder='Enter coupon code'
              className='input flex-1'
            />
            <button
              type='button'
              onClick={handleApplyCoupon}
              className='btn btn-outline px-4 py-2 text-sm'
            >
              Apply
            </button>
          </div>
          {coupon ? (
            <div className='flex items-center justify-between text-xs text-success'>
              <span>{coupon.code} applied</span>
              <button
                type='button'
                onClick={() => {
                  removeCoupon()
                  setCouponStatus({ type: 'success', message: 'Coupon removed.' })
                }}
                className='font-semibold text-foreground hover:text-primary'
              >
                Remove
              </button>
            </div>
          ) : null}
          {couponStatus?.message ? (
            <p
              className={`text-xs ${couponStatus.type === 'success' ? 'text-success' : 'text-destructive'}`}
            >
              {couponStatus.message}
            </p>
          ) : null}
        </div>

        <div className='mt-6 space-y-2'>
          <button
            onClick={() => navigate('/placeorder')}
            className='btn btn-primary w-full px-4 py-3 text-sm'
          >
            Continue to Checkout
          </button>
          <Link
            to='/collection'
            className='btn btn-outline block w-full px-4 py-3 text-center text-sm'
          >
            Continue shopping
          </Link>
        </div>
      </aside>
    </div>
  )
}

export default Cart
