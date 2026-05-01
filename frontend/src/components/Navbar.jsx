import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/frontend_assets/assets'
import { useShop } from '../context/useShop'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/collection', label: 'Collection' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/orders', label: 'Orders' },
  { to: '/account/profile', label: 'Account' },
]

const Navbar = () => {
  const { cartCount, user, logout } = useShop()
  const navigate = useNavigate()

  return (
    <header className='sticky top-0 z-10 mb-6 border-b border-gray-200 bg-white/95 backdrop-blur'>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 py-4'>
        <button className='cursor-pointer' onClick={() => navigate('/')}>
          <img src={assets.logo} className='w-32' alt='E-Commerce Web logo' />
        </button>

        <nav className='hidden items-center gap-5 text-sm font-medium text-gray-700 md:flex'>
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition hover:text-black ${isActive ? 'text-black underline underline-offset-4' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className='flex items-center gap-3'>
          <button
            className='relative cursor-pointer rounded-md p-2 transition hover:bg-gray-100'
            onClick={() => navigate('/cart')}
            aria-label='Open cart'
          >
            <img src={assets.cart_icon} alt='' className='h-5 w-5' />
            {cartCount > 0 ? (
              <span className='absolute -right-1 -top-1 rounded-full bg-black px-1.5 text-xs text-white'>
                {cartCount}
              </span>
            ) : null}
          </button>

          {user ? (
            <button
              onClick={logout}
              className='rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-100'
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='rounded-md bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-gray-800'
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
