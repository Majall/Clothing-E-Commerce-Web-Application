import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useShop } from '../context/useShop'
import { getCouponLabel, getShippingLabel } from '../utils/coupon'

const PAYMENT_METHODS = ['Credit/Debit Card', 'Cash on Delivery', 'Bank Transfer', 'Digital Wallet']

const PlaceOrder = () => {
  const { cartItems, subtotal, baseShipping, shipping, discount, total, coupon, user, placeOrder, defaultAddress } = useShop()
  const navigate = useNavigate()
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const formKey = defaultAddress?.id || user?.email || 'guest'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })
    setConfirmation(null)

    const formData = new FormData(event.currentTarget)
    const shippingAddress = {
      fullName: formData.get('fullName')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      phone: formData.get('phone')?.toString().trim() || '',
      address: formData.get('address')?.toString().trim() || '',
      city: formData.get('city')?.toString().trim() || '',
      postalCode: formData.get('postalCode')?.toString().trim() || '',
      country: formData.get('country')?.toString().trim() || '',
    }
    const paymentMethod = formData.get('paymentMethod')?.toString() || 'Cash on Delivery'

    const result = await placeOrder({
      shippingAddress,
      paymentMethod,
    })

    if (result.ok) {
      setStatus({ type: 'success', message: 'Your order has been placed successfully.' })
      setConfirmation(result.order)
    } else {
      setStatus({ type: 'error', message: result.message })
    }

    setIsSubmitting(false)
  }

  return (
    <div className='grid gap-8 lg:grid-cols-[1fr_360px]'>
      <section>
        <PageHeader title='Checkout' subtitle='Enter shipping details and confirm payment method.' />

        {!user ? (
          <div className='mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900'>
            <p className='text-sm font-semibold'>Guest checkout enabled</p>
            <p className='mt-1 text-amber-800'>
              You can place your order now or sign in to track it later.
            </p>
            <div className='mt-3 flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={() => navigate('/login', { state: { redirectTo: '/placeorder' } })}
                className='rounded-md border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100'
              >
                Login / Register
              </button>
              <button
                type='button'
                onClick={() => navigate('/collection')}
                className='rounded-md border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100'
              >
                Continue shopping
              </button>
            </div>
          </div>
        ) : null}

        {confirmation ? (
          <div className='mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900'>
            <p className='text-base font-semibold'>Order confirmation</p>
            <p className='mt-1'>
              Order <span className='font-semibold'>{confirmation.id}</span> confirmed on{' '}
              {new Date(confirmation.createdAt).toLocaleString()}.
            </p>
            <div className='mt-3 grid gap-4 md:grid-cols-2'>
              <div>
                <p className='text-xs font-semibold uppercase text-green-800'>Shipping to</p>
                <p className='mt-1'>{confirmation.shippingAddress.fullName}</p>
                <p className='text-sm text-green-800'>
                  {confirmation.shippingAddress.address}, {confirmation.shippingAddress.city},{' '}
                  {confirmation.shippingAddress.postalCode}
                </p>
                <p className='text-sm text-green-800'>{confirmation.shippingAddress.country}</p>
              </div>
              <div>
                <p className='text-xs font-semibold uppercase text-green-800'>Payment method</p>
                <p className='mt-1'>{confirmation.paymentMethod}</p>
                <p className='mt-3 text-xs font-semibold uppercase text-green-800'>Total</p>
                <p className='text-lg font-semibold'>৳{confirmation.total}</p>
              </div>
            </div>
            <div className='mt-4'>
              <p className='text-xs font-semibold uppercase text-green-800'>Items</p>
              <div className='mt-2 space-y-1 text-sm text-green-900'>
                {confirmation.items.map((item) => (
                  <div key={item.sku} className='flex justify-between'>
                    <span>
                      {item.product.name} • Size {item.size} × {item.quantity}
                    </span>
                    <span>৳{item.lineTotal}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className='mt-4 flex flex-wrap gap-2'>
              <button
                type='button'
                onClick={() => navigate('/collection')}
                className='rounded-md bg-green-700 px-4 py-2 text-xs font-semibold text-white hover:bg-green-800'
              >
                Continue shopping
              </button>
              {user ? (
                <button
                  type='button'
                  onClick={() => navigate('/orders')}
                  className='rounded-md border border-green-300 px-4 py-2 text-xs font-semibold text-green-900 hover:bg-green-100'
                >
                  View orders
                </button>
              ) : (
                <button
                  type='button'
                  onClick={() => navigate('/login', { state: { redirectTo: '/orders' } })}
                  className='rounded-md border border-green-300 px-4 py-2 text-xs font-semibold text-green-900 hover:bg-green-100'
                >
                  Create account to track orders
                </button>
              )}
            </div>
          </div>
        ) : null}

        <form
          key={formKey}
          onSubmit={handleSubmit}
          className='grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2'
        >
          <input
            required
            name='fullName'
            defaultValue={defaultAddress?.fullName || user?.name || ''}
            placeholder='Full name'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            type='email'
            name='email'
            defaultValue={user?.email || ''}
            placeholder='Email'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            name='phone'
            defaultValue={defaultAddress?.phone || ''}
            placeholder='Phone'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            name='city'
            defaultValue={defaultAddress?.city || ''}
            placeholder='City'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            name='address'
            defaultValue={defaultAddress?.line1 || ''}
            placeholder='Street address'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none md:col-span-2'
          />
          <input
            required
            name='postalCode'
            defaultValue={defaultAddress?.postalCode || ''}
            placeholder='Postal code'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            name='country'
            defaultValue={defaultAddress?.country || ''}
            placeholder='Country'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />

          <select
            name='paymentMethod'
            defaultValue='Cash on Delivery'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none md:col-span-2'
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          <button
            type='submit'
            disabled={isSubmitting || cartItems.length === 0}
            className='rounded-md bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 md:col-span-2'
          >
            {isSubmitting ? 'Placing order...' : 'Place order'}
          </button>

          {status.message ? (
            <p className={`text-sm md:col-span-2 ${status.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {status.message}
            </p>
          ) : null}
        </form>
      </section>

      <aside className='h-fit rounded-lg border border-gray-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-gray-900'>Order summary</h2>
        <div className='mt-4 space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span>Items ({cartItems.length})</span>
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
      </aside>
    </div>
  )
}

export default PlaceOrder
