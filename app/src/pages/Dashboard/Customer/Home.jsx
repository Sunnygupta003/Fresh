import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Star, ArrowRight, Package } from 'lucide-react'
import ProductCard from '../../../components/shared/ProductCard'
import { customerOrders } from '../../../data/mockData'
import { useProductStore } from '../../../stores/productStore'
import { getFreshProducts } from '../../../utils/freshness'
import { getSeasonalProducts, getCurrentSeason, getSeasonMeta } from '../../../utils/seasonalData'

const STATUS_COLORS = { delivered: 'status-delivered', shipped: 'status-shipped', pending: 'status-pending', confirmed: 'status-confirmed' }
const BULK_STATUS_COLORS = { pending: 'status-pending', accepted: 'status-shipped', rejected: 'status-cancelled', completed: 'status-delivered' }

export default function CustomerHome() {
  const products = useProductStore(state => state.products)
  const bulkOrders = useProductStore(state => state.bulkOrders)
  
  const recent = customerOrders.slice(0, 2)
  const recommended = products.filter(p => p.organic).slice(0, 4)
  const freshPicks = getFreshProducts(products).slice(0, 4)
  
  const currentSeason = getCurrentSeason()
  const seasonMeta = getSeasonMeta(currentSeason)
  const seasonalProduce = getSeasonalProducts(products).slice(0, 4)

  // Filter bulk orders placed by Priya Sharma
  const myBulkOrders = bulkOrders.filter(o => o.CustomerName === 'Priya Sharma')

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-green-gradient rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 text-9xl opacity-10 pointer-events-none">🥗</div>
        <div className="relative z-10">
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">Good morning, Priya! 👋</h1>
          <p className="text-primary-100 mb-5">Ready to shop fresh today? You have 1 order on its way!</p>
          <Link to="/marketplace" className="inline-flex items-center gap-2 bg-white text-primary font-bold rounded-xl px-5 py-2.5 hover:bg-primary-50 transition-colors">
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: '🛒', label: 'Total Orders', value: 12, color: 'bg-blue-50 text-blue-600' },
          { icon: '❤️', label: 'Wishlist',      value: 8,  color: 'bg-red-50 text-red-500' },
          { icon: '⭐', label: 'Reviews',       value: 5,  color: 'bg-yellow-50 text-yellow-600' },
          { icon: '🎁', label: 'Reward Points', value: '240', color: 'bg-primary-50 text-primary-600' },
        ].map(s => (
          <div key={s.label} className="card p-4 flex flex-col gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${s.color}`}>{s.icon}</div>
            <p className="font-display font-bold text-2xl text-text">{s.value}</p>
            <p className="text-xs text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-text">Recent Orders</h2>
          <Link to="/customer/orders" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="flex flex-col gap-3">
          {recent.map(o => (
            <div key={o.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package size={20} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-text text-sm">{o.id}</p>
                  <p className="text-2xs text-text-muted truncate">{o.items.map(i => i.name).join(', ')}</p>
                </div>
              </div>
              <span className={STATUS_COLORS[o.status] || 'badge'}>{o.status}</span>
              <p className="font-bold text-primary">₹{o.total}</p>
              <Link to={`/customer/orders/${o.id}`} className="text-sm text-primary hover:underline whitespace-nowrap">Track →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Order Status */}
      {myBulkOrders.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-xl text-text mb-4">📦 Bulk Order Requests Status</h2>
          <div className="table-wrapper">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Delivery Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myBulkOrders.map(o => (
                  <tr key={o.OrderID}>
                    <td className="font-mono text-xs font-semibold text-primary">{o.OrderID}</td>
                    <td className="text-sm font-medium text-gray-800">{o.ProductName}</td>
                    <td className="text-sm text-text-secondary">{o.Quantity} units</td>
                    <td className="text-xs text-text-muted">{new Date(o.DeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <span className={`status-${BULK_STATUS_COLORS[o.Status.toLowerCase()] || 'pending'}`}>
                        {o.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Today's Fresh Picks */}
      {freshPicks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-text">Today's Fresh Picks 🟢</h2>
              <span className="bg-green-100 text-green-700 text-3xs font-bold px-2 py-0.5 rounded-full">Harvested &lt; 48 hours ago</span>
            </div>
            <Link to="/marketplace" className="text-sm text-primary font-medium hover:underline">Browse all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {freshPicks.map(p => <ProductCard key={p.id} product={p} onAddToCart={() => {}} onWishlist={() => {}} />)}
          </div>
        </div>
      )}

      {/* Seasonal Produce */}
      {seasonalProduce.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-text">In-Season Specials {seasonMeta.emoji}</h2>
              <span className="bg-amber-100 text-amber-700 text-3xs font-bold px-2 py-0.5 rounded-full">{currentSeason} season</span>
            </div>
            <Link to="/marketplace" className="text-sm text-primary font-medium hover:underline">Browse all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {seasonalProduce.map(p => <ProductCard key={p.id} product={p} onAddToCart={() => {}} onWishlist={() => {}} />)}
          </div>
        </div>
      )}

      {/* Recommended for you */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-text">Recommended for You 🌿</h2>
          <Link to="/marketplace" className="text-sm text-primary font-medium hover:underline">Browse all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recommended.map(p => <ProductCard key={p.id} product={p} onAddToCart={() => {}} onWishlist={() => {}} />)}
        </div>
      </div>
    </div>
  )
}
