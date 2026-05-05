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
      <section className='rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900'>
        <h2 className='text-lg font-semibold text-slate-900 dark:text-white'>Profile details</h2>
        <form key={user?.id || user?.email || 'profile'} onSubmit={handleSubmit} className='mt-4 grid gap-3 md:grid-cols-2'>
          <input
            name='name'
            required
            defaultValue={user?.name || ''}
            placeholder='Full name'
            className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
          />
          <input
            name='email'
            required
            type='email'
            defaultValue={user?.email || ''}
            placeholder='Email address'
            className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
          />
          <input
            name='phone'
            defaultValue={user?.phone || ''}
            placeholder='Phone (optional)'
            className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none md:col-span-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
          />
          <button
            type='submit'
            className='rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 md:col-span-2 dark:bg-white dark:text-slate-900'
          >
            Save changes
          </button>
          {status.message ? (
            <p
              className={`text-sm md:col-span-2 ${
                status.type === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-600'
              }`}
            >
              {status.message}
            </p>
          ) : null}
        </form>
      </section>

      <section className='rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900'>
        <div className='flex flex-wrap items-start justify-between gap-2'>
          <div>
            <h2 className='text-lg font-semibold text-slate-900 dark:text-white'>Default shipping address</h2>
            <p className='text-sm text-slate-600 dark:text-slate-300'>Used to prefill your checkout details.</p>
          </div>
          <Link
            to='/account/addresses'
            className='rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          >
            Manage addresses
          </Link>
        </div>

        {defaultAddress ? (
          <div className='mt-4 text-sm text-slate-700 dark:text-slate-200'>
            <p className='font-semibold text-slate-900 dark:text-white'>{defaultAddress.fullName}</p>
            {defaultAddress.label ? (
              <p className='text-xs text-slate-500 dark:text-slate-400'>{defaultAddress.label}</p>
            ) : null}
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
          <p className='mt-4 text-sm text-slate-500 dark:text-slate-400'>No default address set.</p>
        )}
      </section>

      {featureFlags.loyaltyPoints ? (
        <section className='rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900'>
          <h2 className='text-lg font-semibold text-slate-900 dark:text-white'>Loyalty points</h2>
          <p className='mt-2 text-sm text-slate-600 dark:text-slate-300'>Earn points on every purchase.</p>
          <p className='mt-4 text-2xl font-semibold text-slate-900 dark:text-white'>{loyaltyPoints}</p>
        </section>
      ) : null}
    </AccountLayout>
  )
}

export default Profile
