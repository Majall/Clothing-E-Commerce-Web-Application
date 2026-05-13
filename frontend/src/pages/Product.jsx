import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import QuantityInput from '../components/QuantityInput'
import Skeleton from '../components/Skeleton'
import { useShop } from '../context/useShop'

const Product = () => {
  const { id } = useParams()
  const { products, addToCart, recordProductView, getRecommendations, isLoading } = useShop()
  const product = products.find((item) => item._id === id)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showTryOn, setShowTryOn] = useState(false)
  const selectedSizeValue =
    selectedSize && product?.sizes.includes(selectedSize) ? selectedSize : product?.sizes[0]
  const selectedColorValue =
    selectedColor && product?.colors?.includes(selectedColor) ? selectedColor : product?.colors?.[0]

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter((item) => item._id !== product._id && item.category === product.category)
      .slice(0, 4)
  }, [product, products])

  useEffect(() => {
    if (product?._id) {
      recordProductView(product._id)
    }
  }, [product, recordProductView])

  if (!product) {
    if (isLoading) {
      return (
        <div className='grid gap-8 md:grid-cols-2'>
          <Skeleton className='h-96 w-full' />
          <div className='space-y-4'>
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
            <Skeleton className='h-10 w-32' />
            <Skeleton className='h-24 w-full' />
          </div>
        </div>
      )
    }

      return (
        <EmptyState
          title='Product not found'
          description='The product you are looking for does not exist.'
          action={
            <Link to='/collection' className='btn btn-primary inline-block px-4 py-2 text-sm'>
              Back to collection
            </Link>
          }
        />
      )
    }

  const handleAddToCart = () => {
    addToCart(product._id, selectedSizeValue, quantity, selectedColorValue)
    setMessage('Added to cart successfully!')
  }
  const selectedImageValue = product.image[selectedImage] || product.image[0]
  const recommendations = getRecommendations(product)

  return (
    <div className='space-y-10'>
      <section className='grid gap-8 md:grid-cols-2'>
        <div>
          <img
            src={selectedImageValue}
            alt={product.name}
            className='w-full rounded-2xl border border-border bg-card object-cover shadow-soft'
            decoding='async'
            fetchpriority='high'
          />
          {product.image.length > 1 ? (
            <div className='mt-3 grid grid-cols-4 gap-2'>
              {product.image.map((item, index) => (
                <button
                  key={`${product._id}-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-md border transition ${
                    selectedImage === index
                      ? 'border-primary'
                      : 'border-border'
                  }`}
                >
                  <img
                    src={item}
                    alt={`${product.name} view ${index + 1}`}
                    className='h-20 w-full object-cover'
                    loading='lazy'
                    decoding='async'
                  />
                </button>
              ))}
            </div>
          ) : null}
          {product.video ? (
            <div className='mt-4 overflow-hidden rounded-xl border border-border bg-accent'>
              <video controls className='h-60 w-full object-cover'>
                <source src={product.video} type='video/mp4' />
              </video>
            </div>
          ) : null}
        </div>

        <div>
          <PageHeader title={product.name} subtitle={product.description} />
          <div className='flex flex-wrap items-center gap-3'>
            <p className='text-2xl font-semibold text-foreground'>৳{product.price}</p>
            <span className='badge'>
              ⭐ {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>
          <p className='mt-2 text-sm text-muted'>
            Category: {product.category} • {product.subCategory}
          </p>
          <div className='mt-4 flex flex-wrap gap-2 text-xs text-muted'>
            <span className='rounded-full border border-border px-3 py-1'>
              Fabric: {product.fabric}
            </span>
            <span className='rounded-full border border-border px-3 py-1'>
              Style: {product.styleTags?.join(' / ')}
            </span>
          </div>

          <div className='mt-6'>
            <p className='mb-2 text-sm font-semibold text-foreground'>Select size</p>
            <div className='flex flex-wrap gap-2'>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-md border px-4 py-2 text-sm transition ${
                    selectedSizeValue === size
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              type='button'
              onClick={() => setShowSizeGuide(true)}
              className='mt-2 text-xs font-semibold text-muted underline underline-offset-4'
            >
              Size guide
            </button>
          </div>

          <div className='mt-5'>
            <p className='mb-2 text-sm font-semibold text-foreground'>Select color</p>
            <div className='flex flex-wrap gap-2'>
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    selectedColorValue === color
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted hover:border-primary/50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className='mt-5'>
            <p className='mb-2 text-sm font-semibold text-foreground'>Quantity</p>
            <QuantityInput value={quantity} onChange={setQuantity} />
          </div>

          <div className='mt-6 flex flex-wrap gap-3'>
            <button
              onClick={handleAddToCart}
              className='btn btn-primary px-6 py-3 text-sm'
            >
              Add to cart
            </button>
            <button
              type='button'
              onClick={() => setShowTryOn((prev) => !prev)}
              className='btn btn-outline px-6 py-3 text-sm'
            >
              {showTryOn ? 'Hide virtual try-on' : 'Virtual try-on'}
            </button>
          </div>

          {message ? <p className='mt-3 text-sm text-success'>{message}</p> : null}

          {showTryOn ? (
            <div className='mt-6 rounded-2xl border border-border bg-accent p-4'>
              <p className='text-sm font-semibold text-foreground'>Virtual try-on preview</p>
              <div className='relative mt-4 h-72 overflow-hidden rounded-xl bg-gradient-to-b from-accent to-background'>
                <div className='absolute inset-0 flex items-center justify-center text-xs text-muted'>
                  Fit preview
                </div>
                <img
                  src={selectedImageValue}
                  alt='Virtual try-on overlay'
                  className='absolute inset-0 h-full w-full object-contain mix-blend-multiply opacity-80'
                  loading='lazy'
                  decoding='async'
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className='card p-6'>
        <PageHeader title='Customer reviews' subtitle='What shoppers are saying about this product.' />
        <div className='space-y-4'>
          {product.reviews.map((review) => (
            <div key={review.id} className='rounded-lg border border-border p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold text-foreground'>{review.title}</p>
                  <p className='text-xs text-muted'>by {review.author}</p>
                </div>
                <span className='text-xs font-semibold text-warning'>⭐ {review.rating.toFixed(1)}</span>
              </div>
              <p className='mt-2 text-sm text-muted'>{review.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <PageHeader title='Complete the look' subtitle='AI-picked pieces to style together.' />
        {isLoading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={recommendations} />}
      </section>

      <section>
        <PageHeader title='You may also like' subtitle='Products from the same category.' />
        <ProductGrid products={relatedProducts} emptyTitle='No related products available' />
      </section>

      {showSizeGuide ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-overlay/60 p-4'>
          <div className='w-full max-w-md rounded-2xl bg-card p-6 shadow-soft'>
            <h3 className='text-lg font-semibold text-foreground'>Size guide</h3>
            <p className='mt-2 text-sm text-muted'>
              Compare chest and waist measurements to pick the best fit.
            </p>
            <div className='mt-4 space-y-2 text-sm text-muted'>
              <div className='flex justify-between'>
                <span>Small</span>
                <span>Chest 34-36"</span>
              </div>
              <div className='flex justify-between'>
                <span>Medium</span>
                <span>Chest 38-40"</span>
              </div>
              <div className='flex justify-between'>
                <span>Large</span>
                <span>Chest 42-44"</span>
              </div>
              <div className='flex justify-between'>
                <span>XL</span>
                <span>Chest 46-48"</span>
              </div>
            </div>
            <button
              type='button'
              onClick={() => setShowSizeGuide(false)}
              className='btn btn-primary mt-5 w-full px-4 py-2 text-sm'
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Product
