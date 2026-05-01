import { useMemo, useState } from 'react'
import AccountLayout from '../components/AccountLayout'
import EmptyState from '../components/EmptyState'
import { useShop } from '../context/useShop'

const Wishlist = () => {
  const { featureFlags, wishlistItems, addWishlistItem, removeWishlistItem, products } = useShop()
  const [selection, setSelection] = useState({ productId: '', size: '' })
  const [status, setStatus] = useState({ type: '', message: '' })

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
      setSelection({ productId: '', size: '' })
    } else {
      setStatus({ type: 'error', message: result.message || 'Unable to add item.' })
    }
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
      <section className='rounded-lg border border-gray-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-gray-900'>Add a product</h2>
        <form onSubmit={handleAdd} className='mt-4 grid gap-3 md:grid-cols-2'>
          <select
            required
            value={selection.productId}
            onChange={(event) =>
              setSelection({ productId: event.target.value, size: '' })
            }
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          >
            <option value=''>Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          <select
            required
            value={selection.size}
            onChange={(event) => setSelection((prev) => ({ ...prev, size: event.target.value }))}
            className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          >
            <option value=''>Select a size</option>
            {(selectedProduct?.sizes || []).map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button
            type='submit'
            className='rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 md:col-span-2'
          >
            Add to wishlist
          </button>
          {status.message ? (
            <p className={`text-sm md:col-span-2 ${status.type === 'success' ? 'text-green-700' : 'text-red-600'}`}>
              {status.message}
            </p>
          ) : null}
        </form>
      </section>

      <section className='rounded-lg border border-gray-200 bg-white p-5'>
        <h2 className='text-lg font-semibold text-gray-900'>Saved items</h2>
        {wishlistItems.length === 0 ? (
          <div className='mt-4'>
            <EmptyState
              title='No wishlist items yet'
              description='Add products to your wishlist to keep track of favorites.'
            />
          </div>
        ) : (
          <div className='mt-4 space-y-3'>
            {wishlistItems.map((item) => (
              <article key={item.id} className='rounded-lg border border-gray-200 p-4'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <div>
                    <p className='font-semibold text-gray-900'>{item.product?.name || item.productId}</p>
                    <p className='text-sm text-gray-600'>Size {item.size || 'N/A'}</p>
                  </div>
                  <button
                    type='button'
                    onClick={() => removeWishlistItem(item.id)}
                    className='rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100'
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AccountLayout>
  )
}

export default Wishlist
