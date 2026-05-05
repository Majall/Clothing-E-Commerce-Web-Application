import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'
import { useShop } from '../context/useShop'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const { cartCount, user, logout } = useShop()
  const navigate = useNavigate()
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/collection', label: 'Collection' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/orders', label: 'Orders' },
    { to: '/account/profile', label: 'Account' },
    ...(user?.role === 'admin' ? [{ to: '/admin/analytics', label: 'Analytics' }] : []),
  ]

  return (
    <header className='sticky top-0 z-10 mb-6 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 py-4'>
        <button className='cursor-pointer' onClick={() => navigate('/')}>
          <img src={assets.logo} className='w-32' alt='E-Commerce Web logo' />
        </button>

        <nav className='hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex dark:text-slate-300'>
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition hover:text-slate-900 dark:hover:text-white ${isActive ? 'text-slate-900 underline underline-offset-4 dark:text-white' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className='flex items-center gap-3'>
          <ThemeToggle />
          <button
            className='relative cursor-pointer rounded-md p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800'
            onClick={() => navigate('/cart')}
            aria-label='Open cart'
          >
            <img src={assets.cart_icon} alt='' className='h-5 w-5' />
            {cartCount > 0 ? (
              <span className='absolute -right-1 -top-1 rounded-full bg-slate-900 px-1.5 text-xs text-white dark:bg-slate-100 dark:text-slate-900'>
                {cartCount}
              </span>
            ) : null}
          </button>

          {user ? (
            <button
              onClick={logout}
              className='rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
