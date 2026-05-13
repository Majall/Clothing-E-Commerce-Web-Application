import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => (
  <article className='card group overflow-hidden transition hover:-translate-y-1 hover:shadow-soft'>
    <Link to={`/product/${product._id}`} className='block'>
      <div className='overflow-hidden'>
        <img
          src={product.image[0]}
          alt={product.name}
          className='h-64 w-full object-cover transition duration-300 group-hover:scale-105'
          loading='lazy'
          decoding='async'
        />
      </div>
      <div className='p-4'>
        <p className='text-xs font-medium uppercase tracking-wide text-muted'>
          {product.category} • {product.subCategory}
        </p>
        <h3 className='mt-1 line-clamp-2 text-base font-semibold text-foreground'>{product.name}</h3>
        <div className='mt-3 flex items-center justify-between'>
          <p className='text-lg font-bold text-foreground'>৳{product.price}</p>
          {product.rating ? (
            <span className='badge'>
              ⭐ {product.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  </article>
)

export default ProductCard
