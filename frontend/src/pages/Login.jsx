import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useShop } from '../context/useShop'

const Login = () => {
  const { user, login, loginWithSocial, logout } = useShop()
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

  const handleSocialLogin = async (provider) => {
    setError('')
    try {
      await loginWithSocial(provider)
      navigate(redirectTo, { replace: true })
    } catch {
      setError(`${provider === 'google' ? 'Google' : 'Facebook'} login failed. Please try again.`)
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

      <div className='mt-6'>
        <div className='relative flex items-center'>
          <div className='flex-1 border-t border-border' />
          <span className='mx-3 text-xs text-muted'>or continue with</span>
          <div className='flex-1 border-t border-border' />
        </div>
        <div className='mt-4 grid grid-cols-2 gap-3'>
          <button
            type='button'
            onClick={() => handleSocialLogin('google')}
            className='btn btn-outline flex items-center justify-center gap-2 px-4 py-2.5 text-sm'
          >
            <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
              <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4'/>
              <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853'/>
              <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z' fill='#FBBC05'/>
              <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335'/>
            </svg>
            Google
          </button>
          <button
            type='button'
            onClick={() => handleSocialLogin('facebook')}
            className='btn btn-outline flex items-center justify-center gap-2 px-4 py-2.5 text-sm'
          >
            <svg className='h-4 w-4' viewBox='0 0 24 24' fill='#1877F2' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>
              <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
            </svg>
            Facebook
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
