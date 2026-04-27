import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import QuantityInput from '../components/QuantityInput'
import { useShop } from '../context/useShop'

const Cart = () => {
  const { cartItems, subtotal, shipping, total, removeFromCart, updateCartQuantity } = useShop()
  const navigate = useNavigate()

  if (!cartItems.length) {
    return (
      <EmptyState
        title='Your cart is empty'
        description='Browse our collection and add products to continue.'
        action={
          <Link to='/collection' className='inline-block rounded-md bg-black px-5 py-2.5 text-sm text-white'>
            Start shopping
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <PageHeader title='Your Cart' subtitle='Review your selected items before checkout.' />

      <div className='space-y-4'>
        {cartItems.map((item) => (
          <article
            key={item.sku}
            className='grid gap-4 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-[96px_1fr_auto] md:items-center'
          >
            <img src={item.product.image[0]} alt={item.product.name} className='h-24 w-24 rounded-md object-cover' />
            <div>
              <h2 className='font-semibold text-gray-900'>{item.product.name}</h2>
              <p className='text-sm text-gray-600'>Size: {item.size}</p>
              <p className='mt-1 font-semibold text-gray-900'>৳{item.product.price}</p>
            </div>
            <div className='flex items-center gap-3'>
              <QuantityInput value={item.quantity} onChange={(value) => updateCartQuantity(item.sku, value)} />
              <button
                className='rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50'
                onClick={() => removeFromCart(item.sku)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside className='mt-8 ml-auto max-w-md rounded-lg border border-gray-200 bg-white p-5'>
        <h3 className='text-lg font-semibold text-gray-900'>Order summary</h3>
        <div className='mt-4 space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span>Subtotal</span>
            <span>৳{subtotal}</span>
          </div>
          <div className='flex justify-between'>
            <span>Shipping</span>
            <span>{shipping ? `৳${shipping}` : 'Free'}</span>
          </div>
          <div className='flex justify-between border-t border-gray-200 pt-2 text-base font-bold'>
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/placeorder')}
          className='mt-5 w-full rounded-md bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800'
        >
          Continue to Checkout
        </button>
      </aside>
    </div>
  )
}

export default Cart
