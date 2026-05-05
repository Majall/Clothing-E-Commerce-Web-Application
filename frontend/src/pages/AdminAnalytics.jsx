import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import Skeleton from '../components/Skeleton'
import { useShop } from '../context/useShop'
import { api } from '../services/api'

const AdminAnalytics = () => {
  const { user } = useShop()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!api.isEnabled) {
        setSummary({
          orders: 128,
          revenue: 54600,
          users: 312,
          products: 54,
          topCategories: [],
        })
        setLoading(false)
        return
      }

      try {
        const data = await api.getAnalytics()
        setSummary(data)
      } catch {
        setSummary(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (!user || user.role !== 'admin') {
    return (
      <EmptyState
        title='Admin access required'
        description='Sign in with an admin account to view analytics.'
      />
    )
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Analytics dashboard' subtitle='Track sales, users, and category performance.' />
      {loading ? (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className='rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='mt-3 h-6 w-16' />
            </div>
          ))}
        </div>
      ) : summary ? (
        <>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {[
              { label: 'Orders', value: summary.orders },
              { label: 'Revenue', value: `৳${summary.revenue}` },
              { label: 'Users', value: summary.users },
              { label: 'Products', value: summary.products },
            ].map((stat) => (
              <div
                key={stat.label}
                className='rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900'
              >
                <p className='text-xs font-semibold uppercase text-slate-500 dark:text-slate-400'>{stat.label}</p>
                <p className='mt-2 text-2xl font-semibold text-slate-900 dark:text-white'>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className='rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900'>
            <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>Top categories</h3>
            <div className='mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300'>
              {summary.topCategories?.length ? (
                summary.topCategories.map((category) => (
                  <div key={category.category} className='flex justify-between'>
                    <span>{category.category}</span>
                    <span>{category.total} products</span>
                  </div>
                ))
              ) : (
                <p className='text-sm text-slate-500 dark:text-slate-400'>No category data available yet.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <EmptyState title='Unable to load analytics' description='Please try again later.' />
      )}
    </div>
  )
}

export default AdminAnalytics
