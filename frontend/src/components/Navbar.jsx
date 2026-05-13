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
    <header className='sticky top-0 z-20 mb-6 border-b border-border bg-background/90 backdrop-blur shadow-sm'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 py-4'>
        <button className='cursor-pointer' onClick={() => navigate('/')}>
          <img src={assets.logo} className='w-32' alt='E-Commerce Web logo' />
        </button>

        <nav className='hidden items-center gap-5 text-sm font-medium text-muted md:flex'>
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition hover:text-foreground ${isActive ? 'text-foreground underline underline-offset-4' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className='flex items-center gap-3'>
          <ThemeToggle />
          <button
            className='relative cursor-pointer rounded-md p-2 transition hover:bg-accent'
            onClick={() => navigate('/cart')}
            aria-label='Open cart'
          >
            <img src={assets.cart_icon} alt='' className='h-5 w-5' />
            {cartCount > 0 ? (
              <span className='absolute -right-1 -top-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground'>
                {cartCount}
              </span>
            ) : null}
          </button>

          {user ? (
            <button
              onClick={logout}
              className='btn btn-outline px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted'
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='btn btn-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide'
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
