import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useShop } from '../context/useShop'

const PlaceOrder = () => {
  const { cartItems, subtotal, shipping, total, placeOrder } = useShop()
  const navigate = useNavigate()
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
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
    } else {
      setStatus({ type: 'error', message: result.message })
    }

    setIsSubmitting(false)
  }

  return (
    <div className='grid gap-8 lg:grid-cols-[1fr_360px]'>
      <section>
        <PageHeader title='Place Order' subtitle='Enter shipping details and confirm payment method.' />

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
            <option>Cash on Delivery</option>
            <option>Card</option>
            <option>Mobile Banking</option>
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

          {status.type === 'success' ? (
            <button
              type='button'
              onClick={() => navigate('/orders')}
              className='rounded-md border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 md:col-span-2'
            >
              View orders
            </button>
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
          <div className='flex justify-between'>
            <span>Shipping</span>
            <span>{shipping ? `৳${shipping}` : 'Free'}</span>
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
