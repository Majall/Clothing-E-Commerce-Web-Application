import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => (
  <article className='overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-md'>
    <Link to={`/product/${product._id}`} className='block'>
      <img src={product.image[0]} alt={product.name} className='h-64 w-full object-cover' />
      <div className='p-4'>
        <p className='text-xs font-medium uppercase tracking-wide text-gray-500'>
          {product.category} • {product.subCategory}
        </p>
        <h3 className='mt-1 line-clamp-2 text-base font-semibold text-gray-900'>{product.name}</h3>
        <p className='mt-3 text-lg font-bold text-gray-900'>৳{product.price}</p>
      </div>
    </Link>
  </article>
)

export default ProductCard
