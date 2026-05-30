const COLORS = ['Black', 'White', 'Navy', 'Olive', 'Sand', 'Blush', 'Charcoal', 'Denim', 'Taupe', 'Burgundy']
const STYLES = ['Minimal', 'Street', 'Classic', 'Athleisure', 'Resort', 'Formal', 'Vintage', 'Luxe']
const FABRICS = ['Cotton', 'Linen', 'Denim', 'Silk', 'Wool', 'Jersey', 'Satin', 'Twill']
const REVIEW_TITLES = ['Love the fit', 'Comfortable and chic', 'Premium feel', 'Great everyday pick', 'Beautiful quality']

const hashString = (value = '') => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

const pickFromList = (seed, list, count) => {
  const items = []
  const size = list.length
  for (let i = 0; i < count; i += 1) {
    const index = (seed + i * 7) % size
    if (!items.includes(list[index])) {
      items.push(list[index])
    }
  }
  return items
}

const generateReviews = (seed, reviewCount, rating) => {
  const reviews = []
  const total = Math.min(reviewCount, 4)
  for (let i = 0; i < total; i += 1) {
    const title = REVIEW_TITLES[(seed + i) % REVIEW_TITLES.length]
    reviews.push({
      id: `review-${seed}-${i}`,
      author: `Style Member ${((seed + i) % 50) + 1}`,
      rating: Math.max(3.8, rating - (i % 2 === 0 ? 0 : 0.2)),
      title,
      body: 'The quality feels premium, and the styling works effortlessly with other pieces.',
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    })
  }
  return reviews
}

export const enhanceProduct = (product) => {
  const seed = hashString(product._id || product.id || product.name)
  const colors = product.colors?.length ? product.colors : pickFromList(seed, COLORS, 3)
  const styleTags = product.styleTags?.length ? product.styleTags : pickFromList(seed + 3, STYLES, 2)
  const fabric = product.fabric || FABRICS[seed % FABRICS.length]
  const rating = product.rating ?? Number((4 + ((seed % 9) / 10)).toFixed(1))
  const reviewCount = product.reviewCount ?? (seed % 18) + 4
  const variants = product.variants?.length
    ? product.variants
    : (product.sizes || []).flatMap((size, index) =>
        colors.slice(0, 2).map((color, colorIndex) => ({
          sku: `${product._id || product.id}-${size}-${color}`,
          size,
          color,
          stock: 6 + ((seed + index + colorIndex) % 12),
          lowStockThreshold: 4,
        })),
      )

  const video =
    product.video ||
    (seed % 7 === 0
      ? 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
      : null)

  const inStock = product.inStock ?? variants.some((v) => v.stock > 0)

  return {
    ...product,
    colors,
    styleTags,
    fabric,
    material: product.material || fabric,
    rating,
    reviewCount,
    reviews: product.reviews?.length ? product.reviews : generateReviews(seed, reviewCount, rating),
    variants,
    video,
    inStock,
  }
}
