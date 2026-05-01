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
      <section className='rounded-lg border border-gray-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-gray-900'>Recent notifications</h2>
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
              <article key={notification.id} className='rounded-lg border border-gray-200 p-4 text-sm'>
                <div className='flex flex-wrap items-start justify-between gap-3'>
                  <div>
                    <p className='font-semibold text-gray-900'>{notification.title}</p>
                    <p className='mt-1 text-gray-600'>{notification.body}</p>
                    {notification.createdAt ? (
                      <p className='mt-2 text-xs text-gray-400'>
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    ) : null}
                  </div>
                  <div className='flex items-center gap-2'>
                    {notification.readAt ? (
                      <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600'>
                        Read
                      </span>
                    ) : (
                      <button
                        type='button'
                        onClick={() => markNotificationRead(notification.id)}
                        className='rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100'
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
