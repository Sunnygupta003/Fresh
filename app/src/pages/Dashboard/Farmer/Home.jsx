import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react'
import { farmerOrders } from '../../../data/mockData'
import { useProductStore } from '../../../stores/productStore'
import { getDaysSinceHarvest } from '../../../utils/freshness'

const STATUS_CLASS = { pending:'status-pending', confirmed:'status-confirmed', packed:'status-packed', shipped:'status-shipped', delivered:'status-delivered', cancelled:'status-cancelled' }

export default function FarmerHome() {
  const products = useProductStore(state => state.products)
  const bulkOrders = useProductStore(state => state.bulkOrders)
  
  // Ravi Kumar is farmerId: 1
  const myProducts = products.filter(p => p.farmerId === 1)
  const lowStock = myProducts.filter(p => p.stock < 80)
  
  // Calculate requested metrics
  const freshProductsCount = myProducts.filter(p => getDaysSinceHarvest(p.harvestDate) <= 2).length
  const expiringSoonCount = myProducts.filter(p => getDaysSinceHarvest(p.harvestDate) >= 6).length
  const pendingBulkCount = bulkOrders.filter(o => o.FarmerID === 1 && o.Status.toLowerCase() === 'pending').length

  const kpis = [
    { label:'Total Products',   value: myProducts.length,    color:'bg-purple-50 text-purple-600', icon:'🌿' },
    { label:'Fresh Products',   value: freshProductsCount,   color:'bg-green-50 text-green-600',   icon:'🟢' },
    { label:'Bulk Requests',    value: pendingBulkCount,     color:'bg-blue-50 text-blue-600',     icon:'📦' },
    { label:'Expiring Soon',    value: expiringSoonCount,    color:'bg-red-50 text-red-600',       icon:'🔴' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}}
        className="bg-green-gradient rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute right-4 top-4 text-8xl opacity-10 pointer-events-none">🌾</div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">Welcome back, Ravi! 🌾</h1>
        <p className="text-primary-100 mb-4">Green Valley Farm · Nashik, MH</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/farmer/products/add" className="inline-flex items-center gap-2 bg-white text-primary font-bold rounded-xl px-5 py-2.5 hover:bg-primary-50 transition-colors text-sm">
            + Add Product
          </Link>
          <Link to="/farmer/orders" className="inline-flex items-center gap-2 bg-white/15 text-white font-semibold rounded-xl px-5 py-2.5 hover:bg-white/25 transition-colors text-sm border border-white/20">
            View Orders <ArrowRight size={14}/>
          </Link>
        </div>
      </motion.div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5"/>
          <div>
            <p className="font-semibold text-yellow-800 text-sm">Low Stock Alert</p>
            <p className="text-yellow-700 text-xs">{lowStock.map(p=>p.name).join(', ')} — restock soon!</p>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k,i) => (
          <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
            className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${k.color.split(' ')[0]}`}>{k.icon}</div>
            <p className="font-display font-bold text-2xl text-text">{k.value}</p>
            <p className="text-sm text-text-muted">{k.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-text">Recent Orders</h2>
            <Link to="/farmer/orders" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="flex flex-col gap-3">
            {farmerOrders.slice(0,4).map(o => (
              <div key={o.id} className="card p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-text truncate">{o.id} · {o.customer}</p>
                  <p className="text-2xs text-text-muted">{o.product} ×{o.qty} · {o.date}</p>
                </div>
                <span className={STATUS_CLASS[o.status] || 'badge'}>{o.status}</span>
                <p className="font-bold text-primary">₹{o.total}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-text">Top Products</h2>
            <Link to="/farmer/products" className="text-sm text-primary hover:underline">Manage</Link>
          </div>
          <div className="flex flex-col gap-3">
            {myProducts.slice(0,4).map(p => (
              <div key={p.id} className="card p-3 flex items-center gap-3">
                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-text truncate">{p.name}</p>
                  <p className="text-2xs text-text-muted">₹{p.price}/{p.unit} · {p.stock} in stock</p>
                </div>
                <div className={`text-2xs font-bold px-2 py-1 rounded-lg ${p.stock < 80 ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                  {p.stock < 80 ? '⚠️ Low' : '✓ OK'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
