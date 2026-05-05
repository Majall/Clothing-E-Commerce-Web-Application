import { Link } from 'react-router-dom'
import AccountLayout from '../components/AccountLayout'
import EmptyState from '../components/EmptyState'
import Skeleton from '../components/Skeleton'
import { useShop } from '../context/useShop'

const Order = () => {
  const { orders, ordersLoading, ordersError } = useShop()

  return (
    <AccountLayout title='My orders' subtitle='Track your recent purchases and order status.'>
      {ordersLoading ? (
        <div className='space-y-3'>
          <div className='rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900'>
            <Skeleton className='h-4 w-40' />
            <Skeleton className='mt-3 h-3 w-56' />
            <Skeleton className='mt-4 h-16 w-full' />
          </div>
        </div>
      ) : null}

      {ordersError ? (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/30 dark:text-red-100'>
          {ordersError}
        </div>
      ) : null}

      {!ordersLoading && !orders.length ? (
        <EmptyState
          title='No orders yet'
          description='Once you place an order, it will appear here.'
          action={
            <Link
              to='/collection'
              className='inline-block rounded-md bg-slate-900 px-5 py-2.5 text-sm text-white dark:bg-white dark:text-slate-900'
            >
              Shop now
            </Link>
          }
        />
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => (
            <article key={order.id} className='rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <h2 className='text-lg font-semibold text-slate-900 dark:text-white'>{order.id}</h2>
                  <p className='text-sm text-slate-600 dark:text-slate-300'>
                    {new Date(order.createdAt).toLocaleString()} • {order.items.length} item(s)
                  </p>
                </div>
                <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-200'>
                  {order.status}
                </span>
              </div>

              <div className='mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-200'>
                {order.items.map((item) => (
                  <div key={item.sku} className='flex justify-between'>
                    <span>
                      {item.product.name} • Size {item.size} {item.color ? `• ${item.color}` : ''} × {item.quantity}
                    </span>
                    <span>৳{item.lineTotal}</span>
                  </div>
                ))}
              </div>

              {order.tracking?.history?.length ? (
                <div className='mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200'>
                  <p className='text-xs font-semibold uppercase text-slate-500 dark:text-slate-400'>Order tracking</p>
                  <p className='mt-2 text-sm'>
                    Carrier: {order.tracking.carrier} • Tracking #{order.tracking.trackingNumber}
                  </p>
                  <div className='mt-3 space-y-2'>
                    {order.tracking.history.map((entry, index) => (
                      <div key={`${order.id}-track-${index}`} className='flex justify-between text-xs'>
                        <span>{entry.status}</span>
                        <span>{new Date(entry.at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className='mt-4 border-t border-slate-200 pt-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>৳{order.subtotal ?? order.total}</span>
                </div>
                {order.discount ? (
                  <div className='flex justify-between text-green-700 dark:text-green-400'>
                    <span>Discount</span>
                    <span>-৳{order.discount}</span>
                  </div>
                ) : null}
                <div className='flex justify-between'>
                  <span>Shipping</span>
                  <span>{order.shipping ? `৳${order.shipping}` : 'Free'}</span>
                </div>
                <div className='mt-2 flex justify-between text-base font-semibold text-slate-900 dark:text-white'>
                  <span>Total</span>
                  <span>৳{order.total}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AccountLayout>
  )
}

export default Order
