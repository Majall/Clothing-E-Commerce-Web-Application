import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import { useShop } from '../context/useShop'

const WishlistShare = () => {
  const { products, isLoading } = useShop()
  const [searchParams] = useSearchParams()

  const ids = useMemo(() => {
    const raw = searchParams.get('ids') || ''
    return raw ? raw.split(',').map((id) => id.trim()).filter(Boolean) : []
  }, [searchParams])

  const sharedProducts = useMemo(
    () => ids.map((id) => products.find((p) => p._id === id)).filter(Boolean),
    [ids, products],
  )

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Shared Wishlist'
        subtitle='Someone shared their wishlist with you.'
      />

      {isLoading ? (
        <p className='text-sm text-muted'>Loading products...</p>
      ) : sharedProducts.length === 0 ? (
        <EmptyState
          title='No products found'
          description='The shared wishlist link may be invalid or the products may no longer be available.'
          action={
            <Link to='/collection' className='btn btn-primary inline-block px-5 py-2.5 text-sm'>
              Browse collection
            </Link>
          }
        />
      ) : (
        <ProductGrid products={sharedProducts} />
      )}
    </div>
  )
}

export default WishlistShare
