import { motion } from 'framer-motion'
import { TrendingUp, Users, Package, ShoppingBag, Leaf, FileSpreadsheet } from 'lucide-react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement,
  BarElement, Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { farmers } from '../../../data/mockData'
import { useProductStore } from '../../../stores/productStore'
import { getDaysSinceHarvest } from '../../../utils/freshness'
import { getSeasonalProducts } from '../../../utils/seasonalData'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement,
  BarElement, Title, Tooltip, Legend, Filler, ArcElement)

const REVENUE_DATA = {
  labels:['Aug','Sep','Oct','Nov','Dec','Jan'],
  datasets:[{
    label:'Revenue (₹)',
    data:[180000,210000,195000,280000,320000,410000],
    borderColor:'#1A6B2A', backgroundColor:'rgba(26,107,42,0.08)',
    fill:true, tension:0.4, pointBackgroundColor:'#1A6B2A', pointRadius:5, borderWidth:2.5,
  }]
}
const ORDERS_DATA = {
  labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  datasets:[{
    label:'Orders',
    data:[42,68,55,89,72,120,96],
    backgroundColor:'rgba(76,175,80,0.75)', borderRadius:6, borderWidth:0,
  }]
}
const OPTS_LINE = { responsive:true, plugins:{legend:{display:false}}, scales:{x:{grid:{display:false}},y:{grid:{color:'#f5f5f5'}}} }

export default function AdminHome() {
  const products = useProductStore(state => state.products)
  const bulkOrders = useProductStore(state => state.bulkOrders)

  // Calculate platform metrics
  const freshProductsCount = products.filter(p => getDaysSinceHarvest(p.harvestDate) <= 2).length
  const bulkOrdersCount = bulkOrders.length
  
  const seasonalProductsCount = getSeasonalProducts(products).length
  const seasonalPercentage = products.length > 0 ? `${Math.round((seasonalProductsCount / products.length) * 100)}%` : '0%'

  const kpis = [
    { label:'Total Revenue',   value:'₹14.7L', change:'+22%',              icon:<TrendingUp size={22}/>, bg:'bg-green-50',  color:'text-green-600' },
    { label:'Total Users',     value:'10,247', change:'+340',              icon:<Users size={22}/>,      bg:'bg-blue-50',   color:'text-blue-600' },
    { label:'Active Products',  value:products.length, change:'Total catalog',    icon:<Package size={22}/>,    bg:'bg-purple-50', color:'text-purple-600' },
    { label:'Orders Today',    value:'284',    change:'+48',               icon:<ShoppingBag size={22}/>,bg:'bg-orange-50', color:'text-orange-600' },
    
    // New requested KPIs
    { label:'Fresh Products',  value:freshProductsCount, change:'harvested <= 2 days', icon:<Leaf size={22}/>, bg:'bg-emerald-50', color:'text-emerald-600' },
    { label:'Bulk Orders',     value:bulkOrdersCount,    change:'wholesale reqs',    icon:<FileSpreadsheet size={22}/>, bg:'bg-sky-50', color:'text-sky-600' },
    { label:'Seasonal Ratio',  value:seasonalPercentage, change:'active products in season', icon:<TrendingUp size={22}/>, bg:'bg-amber-50', color:'text-amber-600' },
  ]

  const recentActivity = [
    { msg:'New farmer registered: Sunita Devi (Ooty)', time:'2 min ago', type:'farmer' },
    { msg:'Product flagged for review: "Mystery Herb"', time:'15 min ago', type:'alert' },
    { msg:'Order #ORD-2891 delivered successfully', time:'1 hr ago', type:'order' },
    { msg:'New review: 5★ for Organic Tomatoes', time:'2 hr ago', type:'review' },
    { msg:'Farmer payout processed: Ravi Kumar ₹8,420', time:'3 hr ago', type:'payment' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-gray-800">Platform Overview</h2>
        <p className="text-gray-500 text-sm">Last updated: {new Date().toLocaleDateString('en-IN', {weekday:'long',day:'numeric',month:'long'})}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k,i) => (
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className={`w-12 h-12 ${k.bg} ${k.color} rounded-xl flex items-center justify-center mb-3`}>{k.icon}</div>
              <p className="font-display font-bold text-2xl text-gray-800">{k.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{k.label}</p>
            </div>
            <p className="text-xs text-green-600 font-semibold mt-2">{k.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue Trend (6 Months)</h3>
          <Line data={REVENUE_DATA} options={OPTS_LINE} height={140}/>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Orders This Week</h3>
          <Bar data={ORDERS_DATA} options={{...OPTS_LINE,plugins:{legend:{display:false}}}} height={140}/>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity feed */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="flex flex-col gap-3">
            {recentActivity.map((a,i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0
                  ${a.type==='farmer'?'bg-green-100':a.type==='alert'?'bg-red-100':a.type==='payment'?'bg-yellow-100':'bg-blue-100'}`}>
                  {a.type==='farmer'?'🌾':a.type==='alert'?'⚠️':a.type==='payment'?'💰':a.type==='order'?'📦':'⭐'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{a.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top farmers */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Top Farmers This Month</h3>
          <div className="flex flex-col gap-3">
            {[...farmers, ...farmers].slice(0,4).map((f,i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0
                  ${i===0?'bg-yellow-400':i===1?'bg-gray-400':i===2?'bg-amber-600':'bg-primary-300'}`}>{i+1}</span>
                <img src={f.avatar} alt={f.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{f.name}</p>
                  <p className="text-xs text-gray-400">{f.farm}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-sm">₹{(8420-i*1200).toLocaleString()}</p>
                  <p className="text-2xs text-gray-400">{f.products} products</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
