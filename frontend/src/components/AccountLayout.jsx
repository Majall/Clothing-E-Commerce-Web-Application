import { NavLink } from 'react-router-dom'
import { useShop } from '../context/useShop'
import PageHeader from './PageHeader'

const AccountLayout = ({ title, subtitle, children }) => {
  const { featureFlags } = useShop()

  const links = [
    { to: '/account/profile', label: 'Profile' },
    { to: '/account/addresses', label: 'Addresses' },
    { to: '/orders', label: 'Orders' },
    { to: '/account/password-reset', label: 'Password reset' },
  ]

  if (featureFlags.wishlist) {
    links.push({ to: '/account/wishlist', label: 'Wishlist' })
  }

  if (featureFlags.paymentMethods) {
    links.push({ to: '/account/payment-methods', label: 'Payment methods' })
  }

  if (featureFlags.notifications) {
    links.push({ to: '/account/notifications', label: 'Notifications' })
  }

  if (featureFlags.loyaltyPoints) {
    links.push({ to: '/account/loyalty', label: 'Loyalty points' })
  }

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className='grid gap-6 lg:grid-cols-[220px_1fr]'>
        <nav className='rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'>
          <ul className='space-y-2'>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 font-medium transition ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className='space-y-6'>{children}</div>
      </div>
    </div>
  )
}

export default AccountLayout
