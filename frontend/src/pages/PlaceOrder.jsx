import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useShop } from '../context/useShop'

const PlaceOrder = () => {
  const { cartItems, subtotal, baseShipping, shipping, discount, total, coupon, user, placeOrder } = useShop()
  const navigate = useNavigate()
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'Cash on Delivery',
  })

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: '', message: '' })
    setConfirmation(null)

    const result = await placeOrder({
      shippingAddress: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
      },
      paymentMethod: form.paymentMethod,
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

        <form onSubmit={handleSubmit} className='grid gap-3 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-2'>
          <input
            required
            value={form.fullName}
            onChange={(event) => updateField('fullName', event.target.value)}
            placeholder='Full name'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            type='email'
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder='Email'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            placeholder='Phone'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            value={form.city}
            onChange={(event) => updateField('city', event.target.value)}
            placeholder='City'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            value={form.address}
            onChange={(event) => updateField('address', event.target.value)}
            placeholder='Street address'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none md:col-span-2'
          />
          <input
            required
            value={form.postalCode}
            onChange={(event) => updateField('postalCode', event.target.value)}
            placeholder='Postal code'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            value={form.country}
            onChange={(event) => updateField('country', event.target.value)}
            placeholder='Country'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />

          <select
            value={form.paymentMethod}
            onChange={(event) => updateField('paymentMethod', event.target.value)}
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none md:col-span-2'
          >
            <option>Credit / Debit Card</option>
            <option>Cash on Delivery</option>
            <option>Bank Transfer</option>
            <option>Digital Wallet</option>
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
              <span>{discount ? `-৳${discount}` : coupon.type === 'shipping' ? 'Free shipping' : 'Applied'}</span>
            </div>
          ) : null}
          <div className='flex justify-between'>
            <span>Shipping</span>
            <span>
              {shipping
                ? `৳${shipping}`
                : coupon?.type === 'shipping' && baseShipping > 0
                  ? `Free (${coupon.code})`
                  : 'Free'}
            </span>
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
