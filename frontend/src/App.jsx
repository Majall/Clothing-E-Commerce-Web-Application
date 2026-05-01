import { Route, Routes } from 'react-router-dom'
import CheckoutGuard from './components/CheckoutGuard'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './pages/About'
import Addresses from './pages/Addresses'
import Cart from './pages/Cart'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Login from './pages/Login'
import Loyalty from './pages/Loyalty'
import Notifications from './pages/Notifications'
import Order from './pages/Order'
import PasswordReset from './pages/PasswordReset'
import PaymentMethods from './pages/PaymentMethods'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'

const App = () => {
  return (
    <div className='min-h-screen bg-gray-50 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[10vw]'>
      <Navbar />
      <main className='mx-auto max-w-7xl pb-8'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='/account/profile'
            element={
              <CheckoutGuard>
                <Profile />
              </CheckoutGuard>
            }
          />
          <Route
            path='/account/addresses'
            element={
              <CheckoutGuard>
                <Addresses />
              </CheckoutGuard>
            }
          />
          <Route path='/account/password-reset' element={<PasswordReset />} />
          <Route
            path='/account/wishlist'
            element={
              <CheckoutGuard>
                <Wishlist />
              </CheckoutGuard>
            }
          />
          <Route
            path='/account/payment-methods'
            element={
              <CheckoutGuard>
                <PaymentMethods />
              </CheckoutGuard>
            }
          />
          <Route
            path='/account/notifications'
            element={
              <CheckoutGuard>
                <Notifications />
              </CheckoutGuard>
            }
          />
          <Route
            path='/account/loyalty'
            element={
              <CheckoutGuard>
                <Loyalty />
              </CheckoutGuard>
            }
          />
          <Route
            path='/placeorder'
            element={
              <CheckoutGuard requireCart requireAuth={false}>
                <PlaceOrder />
              </CheckoutGuard>
            }
          />
          <Route
            path='/orders'
            element={
              <CheckoutGuard>
                <Order />
              </CheckoutGuard>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
