import AccountLayout from '../components/AccountLayout'
import EmptyState from '../components/EmptyState'
import { useShop } from '../context/useShop'

const Loyalty = () => {
  const { featureFlags, loyaltyPoints } = useShop()

  if (!featureFlags.loyaltyPoints) {
    return (
      <AccountLayout title='Loyalty points' subtitle='Track your rewards balance.'>
        <EmptyState
          title='Loyalty program disabled'
          description='Enable VITE_FEATURE_LOYALTY to turn on loyalty points.'
        />
      </AccountLayout>
    )
  }

  return (
    <AccountLayout title='Loyalty points' subtitle='Track your rewards balance.'>
      <section className='rounded-lg border border-gray-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-gray-900'>Available points</h2>
        <p className='mt-2 text-sm text-gray-600'>Redeem points during checkout.</p>
        <p className='mt-4 text-3xl font-semibold text-gray-900'>{loyaltyPoints}</p>
      </section>
    </AccountLayout>
  )
}

export default Loyalty
