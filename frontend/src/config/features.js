const readFlag = (value) => value === 'true'

export const featureFlags = {
  wishlist: readFlag(import.meta.env.VITE_FEATURE_WISHLIST),
  paymentMethods: readFlag(import.meta.env.VITE_FEATURE_PAYMENTS),
  notifications: readFlag(import.meta.env.VITE_FEATURE_NOTIFICATIONS),
  loyaltyPoints: readFlag(import.meta.env.VITE_FEATURE_LOYALTY),
}
