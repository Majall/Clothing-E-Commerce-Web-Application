import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import ProductGrid from '../components/ProductGrid'
import ProductGridSkeleton from '../components/ProductGridSkeleton'
import { useShop } from '../context/useShop'
import { api } from '../services/api'

const Collection = () => {
  const { products, availableFilters, isLoading } = useShop()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [subCategory, setSubCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedStyles, setSelectedStyles] = useState([])
  const [selectedFabrics, setSelectedFabrics] = useState([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })
  const [visualPreview, setVisualPreview] = useState('')
  const [visualResults, setVisualResults] = useState([])
  const [isVisualSearching, setIsVisualSearching] = useState(false)

  useEffect(() => {
    setPriceRange({ min: availableFilters.minPrice, max: availableFilters.maxPrice })
  }, [availableFilters.minPrice, availableFilters.maxPrice])

  const categories = useMemo(() => ['All', ...new Set(products.map((item) => item.category))], [products])
  const subCategories = useMemo(
    () => ['All', ...new Set(products.map((item) => item.subCategory))],
    [products],
  )

  const toggleFilter = (list, value, setter) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value])
  }

  const activeFilters = [
    ...selectedColors.map((value) => ({ type: 'Color', value })),
    ...selectedStyles.map((value) => ({ type: 'Style', value })),
    ...selectedFabrics.map((value) => ({ type: 'Fabric', value })),
  ]

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    let nextProducts = products.filter((item) => {
      const matchesQuery = query
        ? item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
        : true
      const matchesCategory = category === 'All' || item.category === category
      const matchesSubCategory = subCategory === 'All' || item.subCategory === subCategory
      const matchesColors = selectedColors.length
        ? selectedColors.some((color) => item.colors?.includes(color))
        : true
      const matchesStyles = selectedStyles.length
        ? selectedStyles.some((style) => item.styleTags?.includes(style))
        : true
      const matchesFabrics = selectedFabrics.length ? selectedFabrics.includes(item.fabric) : true
      const matchesPrice = item.price >= priceRange.min && item.price <= priceRange.max
      return matchesQuery && matchesCategory && matchesSubCategory && matchesColors && matchesStyles && matchesFabrics && matchesPrice
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
  }, [
    products,
    search,
    category,
    subCategory,
    sortBy,
    selectedColors,
    selectedStyles,
    selectedFabrics,
    priceRange,
  ])

  const handleVisualSearch = async (file) => {
    if (!file) return
    setIsVisualSearching(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const imageData = reader.result?.toString() || ''
      setVisualPreview(imageData)
      try {
        if (api.isEnabled) {
          const matches = await api.visualSearch({ image: imageData })
          setVisualResults(matches)
          setIsVisualSearching(false)
          return
        }
      } catch {
        // fallback
      }
      setVisualResults(products.slice(0, 6))
      setIsVisualSearching(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className='space-y-8'>
      <PageHeader title='Collection' subtitle='Search, filter, and sort to find your perfect product.' />

      <section className='grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1.4fr_1fr] dark:border-slate-800 dark:bg-slate-900'>
        <div>
          <p className='text-sm font-semibold uppercase text-slate-500 dark:text-slate-400'>Visual search</p>
          <h2 className='mt-2 text-xl font-semibold text-slate-900 dark:text-white'>Upload a look</h2>
          <p className='mt-1 text-sm text-slate-600 dark:text-slate-300'>
            Drop an inspiration photo and we’ll pull similar pieces from the catalog.
          </p>
          <div className='mt-4 flex flex-wrap items-center gap-3'>
            <label className='cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900'>
              Upload image
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(event) => handleVisualSearch(event.target.files?.[0])}
              />
            </label>
            <span className='text-xs text-slate-500 dark:text-slate-400'>
              Supported: JPG, PNG • Up to 10 MB
            </span>
          </div>
        </div>
        <div className='rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-950'>
          {visualPreview ? (
            <img src={visualPreview} alt='Visual search preview' className='mx-auto max-h-48 rounded-lg object-cover' />
          ) : (
            <p className='text-sm text-slate-500 dark:text-slate-400'>No image selected.</p>
          )}
        </div>
      </section>

      {visualPreview ? (
        <section>
          <PageHeader title='Visual search results' subtitle='Matches inspired by your uploaded image.' />
          {isVisualSearching ? <ProductGridSkeleton count={6} /> : <ProductGrid products={visualResults} />}
        </section>
      ) : null}

      <div className='grid gap-6 lg:grid-cols-[280px_1fr]'>
        <aside className='space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
          <div>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Search</p>
            <input
              type='search'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Search by product name'
              className='mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
              aria-label='Search products'
            />
          </div>

          <div>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Category</p>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className='mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
              aria-label='Filter by category'
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Sub category</p>
            <select
              value={subCategory}
              onChange={(event) => setSubCategory(event.target.value)}
              className='mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
              aria-label='Filter by sub category'
            >
              {subCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Colors</p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {availableFilters.colors.map((color) => (
                <button
                  key={color}
                  type='button'
                  onClick={() => toggleFilter(selectedColors, color, setSelectedColors)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selectedColors.includes(color)
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Style</p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {availableFilters.styleTags.map((style) => (
                <button
                  key={style}
                  type='button'
                  onClick={() => toggleFilter(selectedStyles, style, setSelectedStyles)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selectedStyles.includes(style)
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Fabric</p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {availableFilters.fabrics.map((fabric) => (
                <button
                  key={fabric}
                  type='button'
                  onClick={() => toggleFilter(selectedFabrics, fabric, setSelectedFabrics)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selectedFabrics.includes(fabric)
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  {fabric}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-semibold text-slate-900 dark:text-white'>Price range</p>
              <span className='text-xs text-slate-500 dark:text-slate-400'>
                ৳{priceRange.min} - ৳{priceRange.max}
              </span>
            </div>
            <div className='mt-3 grid gap-2'>
              <input
                type='range'
                min={availableFilters.minPrice}
                max={availableFilters.maxPrice}
                value={priceRange.min}
                onChange={(event) =>
                  setPriceRange((prev) => {
                    const nextMin = Number(event.target.value)
                    return { ...prev, min: Math.min(nextMin, prev.max) }
                  })
                }
              />
              <input
                type='range'
                min={availableFilters.minPrice}
                max={availableFilters.maxPrice}
                value={priceRange.max}
                onChange={(event) =>
                  setPriceRange((prev) => {
                    const nextMax = Number(event.target.value)
                    return { ...prev, max: Math.max(nextMax, prev.min) }
                  })
                }
              />
            </div>
          </div>

          <div>
            <p className='text-sm font-semibold text-slate-900 dark:text-white'>Sort by</p>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className='mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'
              aria-label='Sort products'
            >
              <option value='featured'>Featured</option>
              <option value='latest'>Latest</option>
              <option value='price-low'>Price Low to High</option>
              <option value='price-high'>Price High to Low</option>
            </select>
          </div>

          <button
            type='button'
            onClick={() => {
              setSelectedColors([])
              setSelectedStyles([])
              setSelectedFabrics([])
              setSearch('')
              setCategory('All')
              setSubCategory('All')
              setSortBy('featured')
              setPriceRange({ min: availableFilters.minPrice, max: availableFilters.maxPrice })
            }}
            className='rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
          >
            Clear filters
          </button>
        </aside>

        <section className='space-y-4'>
          {activeFilters.length ? (
            <div className='flex flex-wrap gap-2'>
              {activeFilters.map((filter) => (
                <span
                  key={`${filter.type}-${filter.value}`}
                  className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200'
                >
                  {filter.type}: {filter.value}
                </span>
              ))}
            </div>
          ) : null}

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <ProductGrid
              products={filteredProducts}
              emptyTitle='No matching products'
              emptyDescription='Try using another keyword or removing some filters.'
            />
          )}
        </section>
      </div>
    </div>
  )
}

export default Collection
