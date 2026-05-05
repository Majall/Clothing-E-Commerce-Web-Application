import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => (
  <article className='group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900'>
    <Link to={`/product/${product._id}`} className='block'>
      <div className='overflow-hidden'>
        <img
          src={product.image[0]}
          alt={product.name}
          className='h-64 w-full object-cover transition duration-300 group-hover:scale-105'
        />
      </div>
      <div className='p-4'>
        <p className='text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400'>
          {product.category} • {product.subCategory}
        </p>
        <h3 className='mt-1 line-clamp-2 text-base font-semibold text-slate-900 dark:text-white'>{product.name}</h3>
        <div className='mt-3 flex items-center justify-between'>
          <p className='text-lg font-bold text-slate-900 dark:text-white'>৳{product.price}</p>
          {product.rating ? (
            <span className='rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200'>
              ⭐ {product.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  </article>
)

export default ProductCard
