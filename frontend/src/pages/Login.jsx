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
  const [mode, setMode] = useState('login')
  const isRegister = mode === 'register'

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
      <div className='card mx-auto max-w-lg p-6 text-center'>
        <PageHeader title={`Welcome, ${user.name || 'Customer'}!`} subtitle={`Signed in as ${user.email}.`} />
        <button
          onClick={logout}
          className='btn btn-outline px-4 py-2 text-sm text-muted'
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className='card mx-auto max-w-lg p-6'>
      <PageHeader
        title={isRegister ? 'Create account' : 'Login'}
        subtitle={isRegister ? 'Register to track and manage your orders.' : 'Sign in to place and track orders.'}
      />

      <div className='mb-4 flex gap-2'>
        <button
          type='button'
          onClick={() => setMode('login')}
          className={`flex-1 rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
            !isRegister ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted hover:bg-accent'
          }`}
        >
          Login
        </button>
        <button
          type='button'
          onClick={() => setMode('register')}
          className={`flex-1 rounded-md border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
            isRegister ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted hover:bg-accent'
          }`}
        >
          Register
        </button>
      </div>

      <p className='mb-3 text-xs text-muted'>Fields marked with * are required.</p>

      <form onSubmit={handleSubmit} className='space-y-3'>
        <input
          value={form.name}
          required={isRegister}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder={isRegister ? 'Full name *' : 'Name (optional)'}
          className='input'
        />
        <input
          required
          type='email'
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          placeholder='Email *'
          className='input'
        />
        <input
          required
          type='password'
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          placeholder='Password *'
          className='input'
        />

        <button type='submit' className='btn btn-primary w-full px-4 py-3 text-sm'>
          {isRegister ? 'Create account' : 'Sign in'}
        </button>

        <button
          type='button'
          onClick={() => navigate(redirectTo, { replace: true })}
          className='btn btn-outline w-full px-4 py-3 text-sm text-muted'
        >
          Continue as guest
        </button>

        <button
          type='button'
          onClick={() => navigate('/account/password-reset')}
          className='btn btn-outline w-full px-4 py-3 text-sm text-muted'
        >
          Forgot password?
        </button>

        {error ? <p className='text-sm text-destructive'>{error}</p> : null}
      </form>
    </div>
  )
}

export default Login
