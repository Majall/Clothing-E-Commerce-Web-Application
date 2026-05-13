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
      <section className='card p-5'>
        <h2 className='text-lg font-semibold text-foreground'>Profile details</h2>
        <form key={user?.id || user?.email || 'profile'} onSubmit={handleSubmit} className='mt-4 grid gap-3 md:grid-cols-2'>
          <input
            name='name'
            required
            defaultValue={user?.name || ''}
            placeholder='Full name'
            className='input'
          />
          <input
            name='email'
            required
            type='email'
            defaultValue={user?.email || ''}
            placeholder='Email address'
            className='input'
          />
          <input
            name='phone'
            defaultValue={user?.phone || ''}
            placeholder='Phone (optional)'
            className='input md:col-span-2'
          />
          <button
            type='submit'
            className='btn btn-primary px-4 py-2 text-sm md:col-span-2'
          >
            Save changes
          </button>
          {status.message ? (
            <p
              className={`text-sm md:col-span-2 ${
                status.type === 'success' ? 'text-success' : 'text-destructive'
              }`}
            >
              {status.message}
            </p>
          ) : null}
        </form>
      </section>

      <section className='card p-5'>
        <div className='flex flex-wrap items-start justify-between gap-2'>
          <div>
            <h2 className='text-lg font-semibold text-foreground'>Default shipping address</h2>
            <p className='text-sm text-muted'>Used to prefill your checkout details.</p>
          </div>
          <Link
            to='/account/addresses'
            className='btn btn-outline px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted'
          >
            Manage addresses
          </Link>
        </div>

        {defaultAddress ? (
          <div className='mt-4 text-sm text-muted'>
            <p className='font-semibold text-foreground'>{defaultAddress.fullName}</p>
            {defaultAddress.label ? (
              <p className='text-xs text-muted'>{defaultAddress.label}</p>
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
          <p className='mt-4 text-sm text-muted'>No default address set.</p>
        )}
      </section>

      {featureFlags.loyaltyPoints ? (
        <section className='card p-5'>
          <h2 className='text-lg font-semibold text-foreground'>Loyalty points</h2>
          <p className='mt-2 text-sm text-muted'>Earn points on every purchase.</p>
          <p className='mt-4 text-2xl font-semibold text-foreground'>{loyaltyPoints}</p>
        </section>
      ) : null}
    </AccountLayout>
  )
}

export default Profile
