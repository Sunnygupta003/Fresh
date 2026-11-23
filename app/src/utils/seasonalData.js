/**
 * Seasonal produce mapping — uses JavaScript logic to determine season
 * based on current month. No external API used.
 */

/**
 * Map month number (0-11) to Indian season name.
 */
const MONTH_TO_SEASON = {
  0:  'Winter',   // Jan
  1:  'Winter',   // Feb
  2:  'Winter',   // Mar
  3:  'Summer',   // Apr
  4:  'Summer',   // May
  5:  'Summer',   // Jun
  6:  'Rainy',    // Jul
  7:  'Rainy',    // Aug
  8:  'Rainy',    // Sep
  9:  'Autumn',   // Oct
  10: 'Autumn',   // Nov
  11: 'Winter',   // Dec
}

/**
 * Products typically available in each season.
 * These product names are matched against the product list.
 */
const SEASON_PRODUCTS = {
  Summer: [
    'Alphonso Mangoes', 'Watermelon', 'Banana Robusta', 'Papaya',
    'Pomegranate', 'Strawberries', 'Coconut Oil', 'Organic Honey',
  ],
  Rainy: [
    'Sweet Corn', 'Fresh Ginger', 'Cauliflower', 'Cabbage',
    'Organic Spinach', 'Fresh Coriander', 'Turmeric Powder',
  ],
  Autumn: [
    'Red Onions', 'Organic Garlic', 'Toor Dal', 'Moong Dal',
    'Basmati Rice', 'Whole Wheat Flour', 'Cumin Seeds (Jeera)',
  ],
  Winter: [
    'Fresh Carrots', 'Green Peas', 'Cauliflower', 'Fresh Broccoli',
    'Organic Tomatoes', 'Green Capsicum', 'Kashmir Apples', 'Himalayan Apples',
  ],
}

const SEASON_META = {
  Summer: { emoji: '☀️', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', desc: 'Beat the heat with these refreshing picks' },
  Rainy:  { emoji: '🌧️', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', desc: 'Monsoon special — comfort foods for rainy days' },
  Autumn: { emoji: '🍂', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', desc: 'Harvest season staples for wholesome meals' },
  Winter: { emoji: '❄️', color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200', desc: 'Warm, nutritious produce for the cold season' },
}

/**
 * Get the current season name based on today's month.
 * @returns {string}
 */
export function getCurrentSeason() {
  return MONTH_TO_SEASON[new Date().getMonth()]
}

/**
 * Get metadata for a season (emoji, colors, description).
 * @param {string} season
 * @returns {object}
 */
export function getSeasonMeta(season) {
  return SEASON_META[season] || SEASON_META['Summer']
}

/**
 * Get product names that are in season right now.
 * @returns {string[]}
 */
export function getSeasonalProductNames() {
  const season = getCurrentSeason()
  return SEASON_PRODUCTS[season] || []
}

/**
 * Filter products list to only those that are seasonal right now.
 * @param {Array} products — full product list
 * @returns {Array} seasonal products
 */
export function getSeasonalProducts(products) {
  const names = getSeasonalProductNames()
  return products.filter(p =>
    names.some(name => p.name.toLowerCase().includes(name.toLowerCase()))
    || p.season === getCurrentSeason()
  )
}

/**
 * Get the season assigned to a product by name.
 * @param {string} productName
 * @returns {string} season name or 'All Season'
 */
export function getProductSeason(productName) {
  for (const [season, names] of Object.entries(SEASON_PRODUCTS)) {
    if (names.some(n => productName.toLowerCase().includes(n.toLowerCase()))) {
      return season
    }
  }
  return 'All Season'
}
