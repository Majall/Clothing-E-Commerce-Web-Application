import { useMemo, useState } from 'react'
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
  const [priceRange, setPriceRange] = useState({ min: null, max: null })
  const [visualPreview, setVisualPreview] = useState('')
  const [visualResults, setVisualResults] = useState([])
  const [isVisualSearching, setIsVisualSearching] = useState(false)

  const effectivePriceRange = useMemo(() => {
    const min = priceRange.min ?? availableFilters.minPrice
    const max = priceRange.max ?? availableFilters.maxPrice
    return {
      min: Math.min(Math.max(min, availableFilters.minPrice), availableFilters.maxPrice),
      max: Math.max(Math.min(max, availableFilters.maxPrice), availableFilters.minPrice),
    }
  }, [availableFilters.maxPrice, availableFilters.minPrice, priceRange.max, priceRange.min])

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
      const matchesPrice = item.price >= effectivePriceRange.min && item.price <= effectivePriceRange.max
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
    effectivePriceRange,
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

      <section className='card grid gap-6 p-5 shadow-soft lg:grid-cols-[1.4fr_1fr]'>
        <div>
          <p className='text-xs font-semibold uppercase text-muted'>Visual search</p>
          <h2 className='mt-2 text-xl font-semibold text-foreground'>Upload a look</h2>
          <p className='mt-1 text-sm text-muted'>
            Drop an inspiration photo and we’ll pull similar pieces from the catalog.
          </p>
          <div className='mt-4 flex flex-wrap items-center gap-3'>
            <label className='btn btn-primary cursor-pointer px-4 py-2 text-xs'>
              Upload image
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(event) => handleVisualSearch(event.target.files?.[0])}
              />
            </label>
            <span className='text-xs text-muted'>
              Supported: JPG, PNG • Up to 10 MB
            </span>
          </div>
        </div>
        <div className='rounded-xl border border-dashed border-border bg-accent p-4 text-center'>
          {visualPreview ? (
            <img src={visualPreview} alt='Visual search preview' className='mx-auto max-h-48 rounded-lg object-cover' />
          ) : (
            <p className='text-sm text-muted'>No image selected.</p>
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
        <aside className='space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm'>
          <div>
            <p className='text-sm font-semibold text-foreground'>Search</p>
            <input
              type='search'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Search by product name'
              className='input mt-2'
              aria-label='Search products'
            />
          </div>

          <div>
            <p className='text-sm font-semibold text-foreground'>Category</p>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className='input mt-2'
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
            <p className='text-sm font-semibold text-foreground'>Sub category</p>
            <select
              value={subCategory}
              onChange={(event) => setSubCategory(event.target.value)}
              className='input mt-2'
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
            <p className='text-sm font-semibold text-foreground'>Colors</p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {availableFilters.colors.map((color) => (
                <button
                  key={color}
                  type='button'
                  onClick={() => toggleFilter(selectedColors, color, setSelectedColors)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selectedColors.includes(color)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted hover:border-primary/50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className='text-sm font-semibold text-foreground'>Style</p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {availableFilters.styleTags.map((style) => (
                <button
                  key={style}
                  type='button'
                  onClick={() => toggleFilter(selectedStyles, style, setSelectedStyles)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selectedStyles.includes(style)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted hover:border-primary/50'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className='text-sm font-semibold text-foreground'>Fabric</p>
            <div className='mt-3 flex flex-wrap gap-2'>
              {availableFilters.fabrics.map((fabric) => (
                <button
                  key={fabric}
                  type='button'
                  onClick={() => toggleFilter(selectedFabrics, fabric, setSelectedFabrics)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selectedFabrics.includes(fabric)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted hover:border-primary/50'
                  }`}
                >
                  {fabric}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <p className='text-sm font-semibold text-foreground'>Price range</p>
              <span className='text-xs text-muted'>
                ৳{effectivePriceRange.min} - ৳{effectivePriceRange.max}
              </span>
            </div>
            <div className='mt-3 grid gap-2'>
              <input
                type='range'
                min={availableFilters.minPrice}
                max={availableFilters.maxPrice}
                value={effectivePriceRange.min}
                onChange={(event) =>
                  setPriceRange((prev) => {
                    const nextMin = Number(event.target.value)
                    return { ...prev, min: Math.min(nextMin, effectivePriceRange.max) }
                  })
                }
              />
              <input
                type='range'
                min={availableFilters.minPrice}
                max={availableFilters.maxPrice}
                value={effectivePriceRange.max}
                onChange={(event) =>
                  setPriceRange((prev) => {
                    const nextMax = Number(event.target.value)
                    return { ...prev, max: Math.max(nextMax, effectivePriceRange.min) }
                  })
                }
              />
            </div>
          </div>

          <div>
            <p className='text-sm font-semibold text-foreground'>Sort by</p>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className='input mt-2'
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
              setPriceRange({ min: null, max: null })
            }}
            className='btn btn-outline px-4 py-2 text-xs text-muted'
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
                  className='badge'
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
