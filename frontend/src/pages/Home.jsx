import Hero from '../components/Hero'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import { useShop } from '../context/useShop'

const Home = () => {
  const { products, isLoading, error } = useShop()
  const featured = products.filter((item) => item.bestseller).slice(0, 8)
  const latest = [...products].sort((a, b) => b.date - a.date).slice(0, 8)

  return (
    <div className='space-y-10'>
      <Hero />

      {error ? <p className='rounded-md bg-amber-100 p-3 text-amber-900'>{error}</p> : null}

      <section>
        <PageHeader title='Best Sellers' subtitle='Most loved products picked for you.' />
        {isLoading ? <p className='text-gray-600'>Loading products...</p> : <ProductGrid products={featured} />}
      </section>

      <section>
        <PageHeader title='Latest Drops' subtitle='Fresh arrivals updated from our catalog.' />
        {isLoading ? <p className='text-gray-600'>Loading products...</p> : <ProductGrid products={latest} />}
      </section>
    </div>
  )
}

export default Home
