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
      <section className='card p-5'>
        <h2 className='text-lg font-semibold text-foreground'>Available points</h2>
        <p className='mt-2 text-sm text-muted'>Redeem points during checkout.</p>
        <p className='mt-4 text-3xl font-semibold text-foreground'>{loyaltyPoints}</p>
      </section>
    </AccountLayout>
  )
}

export default Loyalty
