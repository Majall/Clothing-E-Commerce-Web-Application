import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountLayout from '../components/AccountLayout'
import EmptyState from '../components/EmptyState'
import { useShop } from '../context/useShop'

const Wishlist = () => {
  const {
    featureFlags,
    wishlistItems,
    addWishlistItem,
    removeWishlistItem,
    updateWishlistAlerts,
    products,
  } = useShop()
  const navigate = useNavigate()
  const [selection, setSelection] = useState({ productId: '', size: '', notifyPriceDrop: false, notifyBackInStock: false })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [shareStatus, setShareStatus] = useState('')

  const selectedProduct = useMemo(
    () => products.find((item) => item._id === selection.productId),
    [products, selection.productId],
  )

  const handleAdd = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })

    const result = await addWishlistItem(selection)
    if (result.ok) {
      setStatus({ type: 'success', message: 'Added to wishlist.' })
      setSelection({ productId: '', size: '', notifyPriceDrop: false, notifyBackInStock: false })
    } else {
      setStatus({ type: 'error', message: result.message || 'Unable to add item.' })
    }
  }

  const handleShare = async () => {
    const ids = wishlistItems.map((item) => item.productId).join(',')
    const url = `${window.location.origin}/wishlist/share?ids=${encodeURIComponent(ids)}`
    try {
      await navigator.clipboard.writeText(url)
      setShareStatus('Link copied!')
    } catch {
      setShareStatus(url)
    }
    setTimeout(() => setShareStatus(''), 3000)
  }

  if (!featureFlags.wishlist) {
    return (
      <AccountLayout title='Wishlist' subtitle='Save items you want to buy later.'>
        <EmptyState
          title='Wishlist disabled'
          description='Enable VITE_FEATURE_WISHLIST to turn on wishlist support.'
        />
      </AccountLayout>
    )
  }

  return (
    <AccountLayout title='Wishlist' subtitle='Save items you want to buy later.'>
      <section className='card p-5'>
        <h2 className='text-lg font-semibold text-foreground'>Add a product</h2>
        <form onSubmit={handleAdd} className='mt-4 grid gap-3 md:grid-cols-2'>
          <select
            required
            value={selection.productId}
            onChange={(event) =>
              setSelection((prev) => ({ ...prev, productId: event.target.value, size: '' }))
            }
            className='input'
          >
            <option value=''>Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} — ৳{product.price}{!product.inStock ? ' (Out of stock)' : ''}
              </option>
            ))}
          </select>
          <select
            required
            value={selection.size}
            onChange={(event) => setSelection((prev) => ({ ...prev, size: event.target.value }))}
            className='input'
          >
            <option value=''>Select a size</option>
            {(selectedProduct?.sizes || []).map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <label className='flex items-center gap-2 text-sm text-muted md:col-span-2'>
            <input
              type='checkbox'
              checked={selection.notifyPriceDrop}
              onChange={(e) => setSelection((prev) => ({ ...prev, notifyPriceDrop: e.target.checked }))}
              className='h-4 w-4 rounded border-border accent-primary'
            />
            Notify me when the price drops
          </label>
          <label className='flex items-center gap-2 text-sm text-muted md:col-span-2'>
            <input
              type='checkbox'
              checked={selection.notifyBackInStock}
              onChange={(e) => setSelection((prev) => ({ ...prev, notifyBackInStock: e.target.checked }))}
              className='h-4 w-4 rounded border-border accent-primary'
            />
            Notify me when back in stock
          </label>
          <button
            type='submit'
            className='btn btn-primary px-4 py-2 text-sm md:col-span-2'
          >
            Add to wishlist
          </button>
          {status.message ? (
            <p
              className={`text-sm md:col-span-2 ${status.type === 'success' ? 'text-success' : 'text-destructive'}`}
            >
              {status.message}
            </p>
          ) : null}
        </form>
      </section>

      <section className='card p-5'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 className='text-lg font-semibold text-foreground'>Saved items</h2>
          {wishlistItems.length > 0 && (
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={handleShare}
                className='btn btn-outline px-3 py-1.5 text-xs font-semibold'
              >
                Share wishlist
              </button>
              {shareStatus && (
                <span className='text-xs text-success'>{shareStatus}</span>
              )}
            </div>
          )}
        </div>
        {wishlistItems.length === 0 ? (
          <div className='mt-4'>
            <EmptyState
              title='No wishlist items yet'
              description='Add products to your wishlist to keep track of favorites.'
            />
          </div>
        ) : (
          <div className='mt-4 space-y-3'>
            {wishlistItems.map((item) => {
              const currentProduct = products.find((p) => p._id === item.productId) || item.product
              const currentPrice = currentProduct?.price
              const priceDrop = item.priceWhenAdded && currentPrice && currentPrice < item.priceWhenAdded
                ? item.priceWhenAdded - currentPrice
                : 0
              const isNowInStock = item.inStockWhenAdded === false && currentProduct?.inStock === true

              return (
                <article key={item.id} className='rounded-lg border border-border p-4'>
                  <div className='flex flex-wrap items-start justify-between gap-3'>
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-foreground'>{currentProduct?.name || item.productId}</p>
                      <p className='text-sm text-muted'>Size {item.size || 'N/A'}</p>
                      <div className='mt-1 flex flex-wrap items-center gap-2'>
                        {currentPrice ? (
                          <span className='text-sm font-medium text-foreground'>৳{currentPrice}</span>
                        ) : null}
                        {item.priceWhenAdded && item.priceWhenAdded !== currentPrice ? (
                          <span className='text-xs text-muted line-through'>৳{item.priceWhenAdded}</span>
                        ) : null}
                        {priceDrop > 0 && (
                          <span className='badge badge-success text-xs'>Price dropped ৳{priceDrop}!</span>
                        )}
                        {isNowInStock && (
                          <span className='badge badge-success text-xs'>Back in stock!</span>
                        )}
                        {currentProduct && !currentProduct.inStock && (
                          <span className='badge text-xs'>Out of stock</span>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        type='button'
                        onClick={() => navigate(`/product/${item.productId}`)}
                        className='btn btn-primary px-3 py-1 text-xs'
                      >
                        View
                      </button>
                      <button
                        type='button'
                        onClick={() => removeWishlistItem(item.id)}
                        className='btn btn-outline px-3 py-1 text-xs text-muted'
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className='mt-3 flex flex-wrap gap-4 border-t border-border pt-3'>
                    <label className='flex items-center gap-1.5 text-xs text-muted'>
                      <input
                        type='checkbox'
                        checked={item.notifyPriceDrop ?? false}
                        onChange={(e) => updateWishlistAlerts(item.id, { notifyPriceDrop: e.target.checked })}
                        className='h-3.5 w-3.5 rounded accent-primary'
                      />
                      Price drop alert
                    </label>
                    <label className='flex items-center gap-1.5 text-xs text-muted'>
                      <input
                        type='checkbox'
                        checked={item.notifyBackInStock ?? false}
                        onChange={(e) => updateWishlistAlerts(item.id, { notifyBackInStock: e.target.checked })}
                        className='h-3.5 w-3.5 rounded accent-primary'
                      />
                      Back-in-stock alert
                    </label>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </AccountLayout>
  )
}

export default Wishlist
