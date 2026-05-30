import { useMemo } from 'react'
import Hero from '../components/Hero'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import { useShop } from '../context/useShop'

const Home = () => {
  const { products, isLoading, error, getRecommendations, recentlyViewed } = useShop()
  const featured = products.filter((item) => item.bestseller).slice(0, 8)
  const latest = [...products].sort((a, b) => b.date - a.date).slice(0, 8)
  const trending = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8)
  const recommendations = getRecommendations()

  const recentlyViewedProducts = useMemo(
    () => recentlyViewed.map((id) => products.find((p) => p._id === id)).filter(Boolean).slice(0, 8),
    [recentlyViewed, products],
  )

  return (
    <div className='space-y-10'>
      <Hero />

      {error ? (
        <p className='rounded-md border border-warning/30 bg-warning/10 p-3 text-warning'>
          {error}
        </p>
      ) : null}

      <section>
        <PageHeader title='Best Sellers' subtitle='Most loved products picked for you.' />
        {isLoading ? <ProductGridSkeleton count={8} /> : <ProductGrid products={featured} />}
      </section>

      <section>
        <PageHeader title='Trending Now' subtitle='High-rated pieces making waves this week.' />
        {isLoading ? <ProductGridSkeleton count={8} /> : <ProductGrid products={trending} />}
      </section>

      <section>
        <PageHeader title='AI Recommendations' subtitle='Curated looks based on your browsing history.' />
        {isLoading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={recommendations} />}
      </section>

      <section>
        <PageHeader title='Latest Drops' subtitle='Fresh arrivals updated from our catalog.' />
        {isLoading ? <ProductGridSkeleton count={8} /> : <ProductGrid products={latest} />}
      </section>

      {recentlyViewedProducts.length > 0 && (
        <section>
          <PageHeader title='Recently Viewed' subtitle='Pick up where you left off.' />
          <ProductGrid products={recentlyViewedProducts} />
        </section>
      )}
    </div>
  )
}

export default Home
