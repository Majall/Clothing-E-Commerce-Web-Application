import { Navigate, useLocation } from 'react-router-dom'
import { useShop } from '../context/useShop'

const CheckoutGuard = ({ children, requireCart = false, requireAuth = true }) => {
  const { user, cartCount } = useShop()
  const location = useLocation()

  if (requireAuth && !user) {
    return <Navigate to='/login' replace state={{ redirectTo: location.pathname }} />
  }

  if (requireCart && cartCount === 0) {
    return <Navigate to='/cart' replace />
  }

  return children
}

export default CheckoutGuard
