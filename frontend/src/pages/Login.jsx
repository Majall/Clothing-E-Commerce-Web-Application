import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useShop } from '../context/useShop'

const Login = () => {
  const { user, login, logout } = useShop()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.redirectTo || '/'

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login(form)
      navigate(redirectTo, { replace: true })
    } catch {
      setError('Login failed. Please try again.')
    }
  }

  if (user) {
    return (
      <div className='mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6 text-center'>
        <PageHeader title={`Welcome, ${user.name || 'Customer'}!`} subtitle={`Signed in as ${user.email}.`} />
        <button
          onClick={logout}
          className='rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100'
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className='mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6'>
      <PageHeader title='Login' subtitle='Sign in to place and track orders.' />

      <form onSubmit={handleSubmit} className='space-y-3'>
        <input
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder='Name (optional)'
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
        />
        <input
          required
          type='email'
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder='Email'
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
        />
        <input
          required
          type='password'
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          placeholder='Password'
          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
        />

        <button type='submit' className='w-full rounded-md bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800'>
          Sign in
        </button>

        {error ? <p className='text-sm text-red-600'>{error}</p> : null}
      </form>
    </div>
  )
}

export default Login
