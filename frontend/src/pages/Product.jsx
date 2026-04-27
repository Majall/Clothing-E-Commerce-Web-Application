import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import QuantityInput from '../components/QuantityInput'
import { useShop } from '../context/useShop'

const Product = () => {
  const { id } = useParams()
  const { products, addToCart } = useShop()
  const product = products.find((item) => item._id === id)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const selectedSizeValue =
    selectedSize && product?.sizes.includes(selectedSize) ? selectedSize : product?.sizes[0]

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter((item) => item._id !== product._id && item.category === product.category)
      .slice(0, 4)
  }, [product, products])

  if (!product) {
    return (
      <EmptyState
        title='Product not found'
        description='The product you are looking for does not exist.'
        action={
          <Link to='/collection' className='inline-block rounded-md bg-black px-4 py-2 text-sm text-white'>
            Back to collection
          </Link>
        }
      />
    )
  }

  const handleAddToCart = () => {
    addToCart(product._id, selectedSizeValue, quantity)
    setMessage('Added to cart successfully!')
  }
  const selectedImageValue = product.image[selectedImage] || product.image[0]

  return (
    <div className='space-y-10'>
      <section className='grid gap-8 md:grid-cols-2'>
        <div>
          <img
            src={selectedImageValue}
            alt={product.name}
            className='w-full rounded-xl border border-gray-200 bg-white object-cover'
          />
          {product.image.length > 1 ? (
            <div className='mt-3 grid grid-cols-4 gap-2'>
              {product.image.map((item, index) => (
                <button
                  key={`${product._id}-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-md border ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <img src={item} alt={`${product.name} view ${index + 1}`} className='h-20 w-full object-cover' />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <PageHeader title={product.name} subtitle={product.description} />
          <p className='text-2xl font-bold text-gray-900'>৳{product.price}</p>
          <p className='mt-2 text-sm text-gray-600'>
            Category: {product.category} • {product.subCategory}
          </p>

          <div className='mt-6'>
            <p className='mb-2 text-sm font-semibold text-gray-800'>Select size</p>
            <div className='flex flex-wrap gap-2'>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-md border px-4 py-2 text-sm ${
                    selectedSizeValue === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className='mt-5'>
            <p className='mb-2 text-sm font-semibold text-gray-800'>Quantity</p>
            <QuantityInput value={quantity} onChange={setQuantity} />
          </div>

          <button
            onClick={handleAddToCart}
            className='mt-6 rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800'
          >
            Add to cart
          </button>

          {message ? <p className='mt-3 text-sm text-green-700'>{message}</p> : null}
        </div>
      </section>

      <section>
        <PageHeader title='You may also like' subtitle='Products from the same category.' />
        <ProductGrid products={relatedProducts} emptyTitle='No related products available' />
      </section>
    </div>
  )
}

export default Product
