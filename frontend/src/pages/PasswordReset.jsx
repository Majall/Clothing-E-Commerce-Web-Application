import { useState } from 'react'
import AccountLayout from '../components/AccountLayout'
import { useShop } from '../context/useShop'

const PasswordReset = () => {
  const { requestPasswordReset, resetPassword } = useShop()
  const [requestEmail, setRequestEmail] = useState('')
  const [requestStatus, setRequestStatus] = useState({ type: '', message: '', token: '' })
  const [resetForm, setResetForm] = useState({ email: '', token: '', password: '', passwordConfirmation: '' })
  const [resetStatus, setResetStatus] = useState({ type: '', message: '' })

  const handleRequest = async (event) => {
    event.preventDefault()
    setRequestStatus({ type: '', message: '', token: '' })

    const result = await requestPasswordReset({ email: requestEmail })
    if (result.ok) {
      setRequestStatus({
        type: 'success',
        message: result.status || 'Check your email for reset instructions.',
        token: result.token || '',
      })
      if (result.token) {
        setResetForm((prev) => ({ ...prev, email: requestEmail, token: result.token }))
      }
    } else {
      setRequestStatus({ type: 'error', message: result.message || 'Unable to request reset.' })
    }
  }

  const handleReset = async (event) => {
    event.preventDefault()
    setResetStatus({ type: '', message: '' })

    const result = await resetPassword(resetForm)
    if (result.ok) {
      setResetStatus({ type: 'success', message: result.status || 'Password updated successfully.' })
      setResetForm({ email: '', token: '', password: '', passwordConfirmation: '' })
    } else {
      setResetStatus({ type: 'error', message: result.message || 'Unable to reset password.' })
    }
  }

  const updateResetField = (key, value) => setResetForm((prev) => ({ ...prev, [key]: value }))

  return (
    <AccountLayout
      title='Password reset'
      subtitle='Request a reset link or enter the token you received.'
    >
      <section className='rounded-lg border border-gray-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-gray-900'>Request a reset token</h2>
        <form onSubmit={handleRequest} className='mt-4 flex flex-col gap-3 sm:flex-row'>
          <input
            required
            type='email'
            value={requestEmail}
            onChange={(event) => setRequestEmail(event.target.value)}
            placeholder='Email address'
            className='flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <button
            type='submit'
            className='rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800'
          >
            Send reset token
          </button>
        </form>
        {requestStatus.message ? (
          <p className={`mt-3 text-sm ${requestStatus.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
            {requestStatus.message}
            {requestStatus.token ? (
              <span className='mt-2 block text-xs text-gray-500'>Token: {requestStatus.token}</span>
            ) : null}
          </p>
        ) : null}
      </section>

      <section className='rounded-lg border border-gray-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-gray-900'>Set a new password</h2>
        <form onSubmit={handleReset} className='mt-4 grid gap-3 md:grid-cols-2'>
          <input
            required
            type='email'
            value={resetForm.email}
            onChange={(event) => updateResetField('email', event.target.value)}
            placeholder='Email address'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            value={resetForm.token}
            onChange={(event) => updateResetField('token', event.target.value)}
            placeholder='Reset token'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            type='password'
            value={resetForm.password}
            onChange={(event) => updateResetField('password', event.target.value)}
            placeholder='New password'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <input
            required
            type='password'
            value={resetForm.passwordConfirmation}
            onChange={(event) => updateResetField('passwordConfirmation', event.target.value)}
            placeholder='Confirm password'
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          />
          <button
            type='submit'
            className='rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 md:col-span-2'
          >
            Reset password
          </button>
          {resetStatus.message ? (
            <p className={`text-sm md:col-span-2 ${resetStatus.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {resetStatus.message}
            </p>
          ) : null}
        </form>
      </section>
    </AccountLayout>
  )
}

export default PasswordReset
