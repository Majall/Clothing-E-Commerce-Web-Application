import { Link } from 'react-router-dom'
import AccountLayout from '../components/AccountLayout'
import EmptyState from '../components/EmptyState'
import Skeleton from '../components/Skeleton'
import { useShop } from '../context/useShop'
import { downloadInvoice } from '../utils/invoiceGenerator'

const Order = () => {
  const { orders, ordersLoading, ordersError } = useShop()

  return (
    <AccountLayout title='My orders' subtitle='Track your recent purchases and order status.'>
      {ordersLoading ? (
        <div className='space-y-3'>
          <div className='card p-5'>
            <Skeleton className='h-4 w-40' />
            <Skeleton className='mt-3 h-3 w-56' />
            <Skeleton className='mt-4 h-16 w-full' />
          </div>
        </div>
      ) : null}

      {ordersError ? (
        <div className='rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive'>
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
              className='btn btn-primary inline-block px-5 py-2.5 text-sm'
            >
              Shop now
            </Link>
          }
        />
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => (
            <article key={order.id} className='rounded-2xl border border-border bg-card p-5 shadow-sm'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <h2 className='text-lg font-semibold text-foreground'>{order.id}</h2>
                  <p className='text-sm text-muted'>
                    {new Date(order.createdAt).toLocaleString()} • {order.items.length} item(s)
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='badge badge-success'>
                    {order.status}
                  </span>
                  <button
                    type='button'
                    onClick={() => downloadInvoice(order)}
                    className='btn btn-outline px-3 py-1 text-xs font-semibold'
                  >
                    Download Invoice
                  </button>
                </div>
              </div>

              <div className='mt-4 space-y-2 text-sm text-muted'>
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
                <div className='mt-4 rounded-lg border border-border bg-accent p-4 text-sm text-muted'>
                  <p className='text-xs font-semibold uppercase text-muted'>Order tracking</p>
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

              <div className='mt-4 border-t border-border pt-3 text-sm text-muted'>
                <div className='flex justify-between'>
                  <span>Subtotal</span>
                  <span>৳{order.subtotal ?? order.total}</span>
                </div>
                {order.discount ? (
                  <div className='flex justify-between text-success'>
                    <span>Discount</span>
                    <span>-৳{order.discount}</span>
                  </div>
                ) : null}
                <div className='flex justify-between'>
                  <span>Shipping</span>
                  <span>{order.shipping ? `৳${order.shipping}` : 'Free'}</span>
                </div>
                <div className='mt-2 flex justify-between text-base font-semibold text-foreground'>
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
