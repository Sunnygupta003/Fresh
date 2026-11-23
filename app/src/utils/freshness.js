/**
 * Freshness utility — calculates produce freshness from harvest date.
 * Uses pure JavaScript Date math. No external libraries.
 */

/**
 * Calculate the number of days between harvest date and today.
 * @param {string} harvestDate — ISO date string (e.g., '2026-07-15')
 * @returns {number} days since harvest
 */
export function getDaysSinceHarvest(harvestDate) {
  if (!harvestDate) return Infinity
  const harvest = new Date(harvestDate)
  const today = new Date()
  // Zero out time portion for accurate day diff
  harvest.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const diffMs = today - harvest
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

/**
 * Get freshness status object based on harvest date.
 * @param {string} harvestDate — ISO date string
 * @returns {{ label: string, emoji: string, color: string, bgColor: string, textColor: string, days: number }}
 */
export function getFreshnessStatus(harvestDate) {
  const days = getDaysSinceHarvest(harvestDate)

  if (days <= 2) {
    return {
      label: 'Fresh',
      emoji: '🟢',
      color: 'border-green-300',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      dotColor: 'bg-green-500',
      days,
    }
  }
  if (days <= 5) {
    return {
      label: 'Moderate',
      emoji: '🟡',
      color: 'border-yellow-300',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      dotColor: 'bg-yellow-500',
      days,
    }
  }
  return {
    label: 'Consume Soon',
    emoji: '🔴',
    color: 'border-red-300',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    dotColor: 'bg-red-500',
    days,
  }
}

/**
 * Filter products harvested within the last 2 days. Sorted newest first.
 * @param {Array} products
 * @returns {Array} fresh products
 */
export function getFreshProducts(products) {
  return products
    .filter(p => p.harvestDate && getDaysSinceHarvest(p.harvestDate) <= 2)
    .sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate))
}

/**
 * Filter products expiring soon (6+ days since harvest).
 * @param {Array} products
 * @returns {Array}
 */
export function getExpiringSoonProducts(products) {
  return products.filter(p => p.harvestDate && getDaysSinceHarvest(p.harvestDate) >= 6)
}

/**
 * Format harvest date for display.
 * @param {string} harvestDate
 * @returns {string} e.g., "15 Jul 2026"
 */
export function formatHarvestDate(harvestDate) {
  if (!harvestDate) return 'N/A'
  return new Date(harvestDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
