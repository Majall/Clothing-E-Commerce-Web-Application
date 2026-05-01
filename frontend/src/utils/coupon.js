export const getCouponLabel = (coupon, discount) => {
  if (!coupon) return ''
  if (discount > 0) return `-৳${discount}`
  if (coupon.type === 'shipping') return 'Free shipping'
  return 'Applied'
}

export const getShippingLabel = ({ shipping, coupon, baseShipping }) => {
  if (shipping) return `৳${shipping}`
  if (coupon?.type === 'shipping' && baseShipping > 0) return `Free (${coupon.code})`
  return 'Free'
}
