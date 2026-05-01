import { Route, Routes } from 'react-router-dom'
import CheckoutGuard from './components/CheckoutGuard'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './pages/About'
import Cart from './pages/Cart'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Login from './pages/Login'
import Order from './pages/Order'
import PlaceOrder from './pages/PlaceOrder'
import Product from './pages/Product'

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
