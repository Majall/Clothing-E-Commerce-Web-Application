import { useState } from 'react'
import AccountLayout from '../components/AccountLayout'
import EmptyState from '../components/EmptyState'
import { useShop } from '../context/useShop'

const emptyForm = {
  label: '',
  brand: '',
  lastFour: '',
  expiryMonth: '',
  expiryYear: '',
  isDefault: false,
}

const PaymentMethods = () => {
  const { featureFlags, paymentMethods, addPaymentMethod, removePaymentMethod } = useShop()
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState({ type: '', message: '' })

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    const result = await addPaymentMethod({
      ...form,
      expiryMonth: Number(form.expiryMonth),
      expiryYear: Number(form.expiryYear),
    })

    if (result.ok) {
      setStatus({ type: 'success', message: 'Payment method saved.' })
      setForm(emptyForm)
    } else {
      setStatus({ type: 'error', message: result.message || 'Unable to save payment method.' })
    }
  }

  if (!featureFlags.paymentMethods) {
    return (
      <AccountLayout title='Payment methods' subtitle='Save payment methods for faster checkout.'>
        <EmptyState
          title='Payment methods disabled'
          description='Enable VITE_FEATURE_PAYMENTS to turn on saved payment methods.'
        />
      </AccountLayout>
    )
  }

  return (
    <AccountLayout title='Payment methods' subtitle='Save payment methods for faster checkout.'>
      <section className='rounded-lg border border-gray-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-gray-900'>Saved payment methods</h2>
        {paymentMethods.length === 0 ? (
          <div className='mt-4'>
            <EmptyState
              title='No saved methods'
              description='Add a payment method to see it here.'
            />
          </div>
        ) : (
          <div className='mt-4 space-y-3'>
            {paymentMethods.map((method) => (
              <article key={method.id} className='rounded-lg border border-gray-200 p-4 text-sm'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <div>
                    <p className='font-semibold text-gray-900'>
                      {method.brand} •••• {method.lastFour}
                    </p>
                    <p className='text-gray-600'>
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                    {method.label ? <p className='text-xs text-gray-500'>{method.label}</p> : null}
                  </div>
                  <div className='flex items-center gap-2'>
                    {method.isDefault ? (
                      <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700'>
                        Default
                      </span>
                    ) : null}
                    <button
                      type='button'
                      onClick={() => removePaymentMethod(method.id)}
                      className='rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className='rounded-lg border border-gray-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-gray-900'>Add payment method</h2>
        <form onSubmit={handleSubmit} className='mt-4 grid gap-3 md:grid-cols-2'>
          <input
            value={form.label}
            onChange={(event) => updateField('label', event.target.value)}
            placeholder='Label (Personal card)'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            value={form.brand}
            onChange={(event) => updateField('brand', event.target.value)}
            placeholder='Brand (Visa, MasterCard)'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            value={form.lastFour}
            onChange={(event) => updateField('lastFour', event.target.value)}
            placeholder='Last four digits'
            maxLength={4}
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            value={form.expiryMonth}
            onChange={(event) => updateField('expiryMonth', event.target.value)}
            placeholder='Expiry month (MM)'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            value={form.expiryYear}
            onChange={(event) => updateField('expiryYear', event.target.value)}
            placeholder='Expiry year (YYYY)'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <label className='flex items-center gap-2 text-sm text-gray-600 md:col-span-2'>
            <input
              type='checkbox'
              checked={form.isDefault}
              onChange={(event) => updateField('isDefault', event.target.checked)}
            />
            Set as default payment method
          </label>
          <button
            type='submit'
            className='rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 md:col-span-2'
          >
            Save payment method
          </button>
          {status.message ? (
            <p className={`text-sm md:col-span-2 ${status.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {status.message}
            </p>
          ) : null}
        </form>
      </section>
    </AccountLayout>
  )
}

export default PaymentMethods
