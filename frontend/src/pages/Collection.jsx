import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import { useShop } from '../context/useShop'

const Collection = () => {
  const { products } = useShop()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [subCategory, setSubCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  const categories = useMemo(() => ['All', ...new Set(products.map((item) => item.category))], [products])
  const subCategories = useMemo(
    () => ['All', ...new Set(products.map((item) => item.subCategory))],
    [products],
  )

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    let nextProducts = products.filter((item) => {
      const matchesQuery = query
        ? item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
        : true
      const matchesCategory = category === 'All' || item.category === category
      const matchesSubCategory = subCategory === 'All' || item.subCategory === subCategory
      return matchesQuery && matchesCategory && matchesSubCategory
    })

    if (sortBy === 'price-low') {
      nextProducts = [...nextProducts].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      nextProducts = [...nextProducts].sort((a, b) => b.price - a.price)
    } else if (sortBy === 'latest') {
      nextProducts = [...nextProducts].sort((a, b) => b.date - a.date)
    } else {
      nextProducts = [...nextProducts].sort((a, b) => Number(b.bestseller) - Number(a.bestseller))
    }

    return nextProducts
  }, [products, search, category, subCategory, sortBy])

  return (
    <div>
      <PageHeader title='Collection' subtitle='Search, filter, and sort to find your perfect product.' />

      <div className='mb-6 grid gap-3 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-4'>
        <input
          type='search'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder='Search by product name'
          className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          aria-label='Search products'
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          aria-label='Filter by category'
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={subCategory}
          onChange={(event) => setSubCategory(event.target.value)}
          className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          aria-label='Filter by sub category'
        >
          {subCategories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className='rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none'
          aria-label='Sort products'
        >
          <option value='featured'>Sort: Featured</option>
          <option value='latest'>Sort: Latest</option>
          <option value='price-low'>Sort: Price Low to High</option>
          <option value='price-high'>Sort: Price High to Low</option>
        </select>
      </div>

      <ProductGrid
        products={filteredProducts}
        emptyTitle='No matching products'
        emptyDescription='Try using another keyword or removing some filters.'
      />
    </div>
  )
}

export default Collection
