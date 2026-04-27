import EmptyState from './EmptyState'
import ProductCard from './ProductCard'

const ProductGrid = ({ products, emptyTitle = 'No products found', emptyDescription = 'Try adjusting filters.' }) => {
  if (!products.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
