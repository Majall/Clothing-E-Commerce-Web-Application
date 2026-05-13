import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import CheckoutGuard from './components/CheckoutGuard'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

const ChatbotWidget = lazy(() => import('./components/ChatbotWidget'))
const About = lazy(() => import('./pages/About'))
const Addresses = lazy(() => import('./pages/Addresses'))
const AdminAnalytics = lazy(() => import('./pages/AdminAnalytics'))
const Cart = lazy(() => import('./pages/Cart'))
const Collection = lazy(() => import('./pages/Collection'))
const Contact = lazy(() => import('./pages/Contact'))
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Loyalty = lazy(() => import('./pages/Loyalty'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Order = lazy(() => import('./pages/Order'))
const PasswordReset = lazy(() => import('./pages/PasswordReset'))
const PaymentMethods = lazy(() => import('./pages/PaymentMethods'))
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'))
const Product = lazy(() => import('./pages/Product'))
const Profile = lazy(() => import('./pages/Profile'))
const Wishlist = lazy(() => import('./pages/Wishlist'))

const App = () => {
  return (
    <div className='min-h-screen bg-background px-4 transition-colors sm:px-[5vw] md:px-[7vw] lg:px-[10vw]'>
      <Navbar />
      <main className='mx-auto max-w-7xl pb-12'>
        <Suspense
          fallback={
            <div className='card mt-8 flex items-center justify-center py-12 text-sm text-muted'>
              Loading page...
            </div>
          }
        >
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/collection' element={<Collection />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/product/:id' element={<Product />} />
            <Route path='/login' element={<Login />} />
            <Route
              path='/admin/analytics'
              element={
                <CheckoutGuard>
                  <AdminAnalytics />
                </CheckoutGuard>
              }
            />
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
        </Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <ChatbotWidget />
      </Suspense>
    </div>
  )
}

export default App
