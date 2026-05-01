import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import { useShop } from '../context/useShop'

const Order = () => {
  const { orders } = useShop()

  if (!orders.length) {
    return (
      <EmptyState
        title='No orders yet'
        description='Once you place an order, it will appear here.'
        action={
          <Link to='/collection' className='inline-block rounded-md bg-black px-5 py-2.5 text-sm text-white'>
            Shop now
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <PageHeader title='My Orders' subtitle='Track your recent purchases and order status.' />

      <div className='space-y-4'>
        {orders.map((order) => (
          <article key={order.id} className='rounded-lg border border-gray-200 bg-white p-5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h2 className='text-lg font-semibold text-gray-900'>{order.id}</h2>
                <p className='text-sm text-gray-600'>
                  {new Date(order.createdAt).toLocaleString()} • {order.items.length} item(s)
                </p>
              </div>
              <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700'>
                {order.status}
              </span>
            </div>

            <div className='mt-4 space-y-2'>
              {order.items.map((item) => (
                <div key={item.sku} className='flex justify-between text-sm text-gray-700'>
                  <span>
                    {item.product.name} • Size {item.size} × {item.quantity}
                  </span>
                  <span>৳{item.lineTotal}</span>
                </div>
              ))}
            </div>

            <div className='mt-4 border-t border-gray-200 pt-3 text-sm text-gray-700'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span>৳{order.subtotal ?? order.total}</span>
              </div>
              {order.discount ? (
                <div className='flex justify-between text-green-700'>
                  <span>Discount</span>
                  <span>-৳{order.discount}</span>
                </div>
              ) : null}
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span>{order.shipping ? `৳${order.shipping}` : 'Free'}</span>
              </div>
              <div className='mt-2 flex justify-between text-base font-semibold text-gray-900'>
                <span>Total</span>
                <span>৳{order.total}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Order
