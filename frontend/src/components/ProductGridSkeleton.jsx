import Skeleton from './Skeleton'

const ProductGridSkeleton = ({ count = 8 }) => (
  <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className='overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'
      >
        <Skeleton className='h-56 w-full rounded-lg' />
        <Skeleton className='mt-4 h-3 w-1/2' />
        <Skeleton className='mt-2 h-4 w-4/5' />
        <Skeleton className='mt-4 h-5 w-24' />
      </div>
    ))}
  </div>
)

export default ProductGridSkeleton
