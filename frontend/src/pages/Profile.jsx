import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AccountLayout from '../components/AccountLayout'
import { useShop } from '../context/useShop'

const Profile = () => {
  const { user, updateProfile, refreshProfile, loadAddresses, defaultAddress, featureFlags, loyaltyPoints } = useShop()
  const [status, setStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    refreshProfile()
    loadAddresses()
  }, [refreshProfile, loadAddresses])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    const formData = new FormData(event.currentTarget)
    const payload = {
      name: formData.get('name')?.toString().trim() || '',
      email: formData.get('email')?.toString().trim() || '',
      phone: formData.get('phone')?.toString().trim() || '',
    }

    const result = await updateProfile(payload)
    if (result.ok) {
      setStatus({ type: 'success', message: 'Profile updated successfully.' })
    } else {
      setStatus({ type: 'error', message: result.message || 'Unable to update profile.' })
    }
  }

  return (
    <AccountLayout
      title='Account profile'
      subtitle='Manage your contact details and default shipping address.'
    >
      <section className='rounded-lg border border-gray-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-gray-900'>Profile details</h2>
        <form key={user?.id || user?.email || 'profile'} onSubmit={handleSubmit} className='mt-4 grid gap-3 md:grid-cols-2'>
          <input
            name='name'
            required
            defaultValue={user?.name || ''}
            placeholder='Full name'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            name='email'
            required
            type='email'
            defaultValue={user?.email || ''}
            placeholder='Email address'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            name='phone'
            defaultValue={user?.phone || ''}
            placeholder='Phone (optional)'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none md:col-span-2'
          />
          <button
            type='submit'
            className='rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 md:col-span-2'
          >
            Save changes
          </button>
          {status.message ? (
            <p className={`text-sm md:col-span-2 ${status.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {status.message}
            </p>
          ) : null}
        </form>
      </section>

      <section className='rounded-lg border border-gray-200 bg-white p-5'>
        <div className='flex flex-wrap items-start justify-between gap-2'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>Default shipping address</h2>
            <p className='text-sm text-gray-600'>Used to prefill your checkout details.</p>
          </div>
          <Link
            to='/account/addresses'
            className='rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-100'
          >
            Manage addresses
          </Link>
        </div>

        {defaultAddress ? (
          <div className='mt-4 text-sm text-gray-700'>
            <p className='font-semibold text-gray-900'>{defaultAddress.fullName}</p>
            {defaultAddress.label ? <p className='text-xs text-gray-500'>{defaultAddress.label}</p> : null}
            <p className='mt-2'>
              {defaultAddress.line1}
              {defaultAddress.line2 ? `, ${defaultAddress.line2}` : ''}
            </p>
            <p>
              {defaultAddress.city}
              {defaultAddress.state ? `, ${defaultAddress.state}` : ''} {defaultAddress.postalCode}
            </p>
            <p>{defaultAddress.country}</p>
            {defaultAddress.phone ? <p className='mt-1'>{defaultAddress.phone}</p> : null}
          </div>
        ) : (
          <p className='mt-4 text-sm text-gray-500'>No default address set.</p>
        )}
      </section>

      {featureFlags.loyaltyPoints ? (
        <section className='rounded-lg border border-gray-200 bg-white p-5'>
          <h2 className='text-lg font-semibold text-gray-900'>Loyalty points</h2>
          <p className='mt-2 text-sm text-gray-600'>Earn points on every purchase.</p>
          <p className='mt-4 text-2xl font-semibold text-gray-900'>{loyaltyPoints}</p>
        </section>
      ) : null}
    </AccountLayout>
  )
}

export default Profile
