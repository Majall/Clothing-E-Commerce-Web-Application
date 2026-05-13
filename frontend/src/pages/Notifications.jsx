import AccountLayout from '../components/AccountLayout'
import EmptyState from '../components/EmptyState'
import { useShop } from '../context/useShop'

const Notifications = () => {
  const { featureFlags, notifications, markNotificationRead } = useShop()

  if (!featureFlags.notifications) {
    return (
      <AccountLayout title='Notifications' subtitle='Stay updated on your orders and promotions.'>
        <EmptyState
          title='Notifications disabled'
          description='Enable VITE_FEATURE_NOTIFICATIONS to turn on account notifications.'
        />
      </AccountLayout>
    )
  }

  return (
    <AccountLayout title='Notifications' subtitle='Stay updated on your orders and promotions.'>
      <section className='card p-5'>
        <h2 className='text-lg font-semibold text-foreground'>Recent notifications</h2>
        {notifications.length === 0 ? (
          <div className='mt-4'>
            <EmptyState
              title='No notifications yet'
              description='Updates about orders and promotions will appear here.'
            />
          </div>
        ) : (
          <div className='mt-4 space-y-3'>
            {notifications.map((notification) => (
              <article key={notification.id} className='rounded-lg border border-border p-4 text-sm'>
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <div>
                    <p className='font-semibold text-foreground'>{notification.title}</p>
                    <p className='mt-1 text-muted'>{notification.body}</p>
                    {notification.createdAt ? (
                      <p className='mt-2 text-xs text-muted'>
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                  <div className='flex items-center gap-2'>
                    {notification.readAt ? (
                      <span className='badge'>
                        Read
                      </span>
                    ) : (
                      <button
                        type='button'
                        onClick={() => markNotificationRead(notification.id)}
                        className='btn btn-outline px-3 py-1 text-xs text-muted'
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AccountLayout>
  )
}

export default Notifications
