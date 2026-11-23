import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Package } from 'lucide-react'
import { useOrderStore } from '../../../stores/orderStore'

const TABS = ['All','Pending','Shipped','Delivered','Cancelled']
const STATUS_CLASS = { delivered:'status-delivered', shipped:'status-shipped', pending:'status-pending', confirmed:'status-confirmed', cancelled:'status-cancelled' }

export default function CustomerOrders() {
  const [activeTab, setActiveTab] = useState('All')
  const orders = useOrderStore(state => state.orders)
  const filtered = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab.toLowerCase())

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-text mb-6">My Orders</h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-border-light shadow-card mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map(t => (
          <button key={t} onClick={()=>setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
              ${activeTab===t ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:text-primary hover:bg-primary-50'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="text-primary-200 mx-auto mb-3"/>
            <p className="text-text-muted">No {activeTab.toLowerCase()} orders found</p>
          </div>
        ) : filtered.map(o => (
          <motion.div key={o.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
            className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-text">{o.id}</h3>
                  <span className={STATUS_CLASS[o.status] || 'badge'}>{o.status}</span>
                </div>
                <p className="text-sm text-text-muted mb-2">Ordered on {o.date} · {o.farmer}</p>
                <div className="flex flex-wrap gap-2">
                  {o.items.map((item,i) => (
                    <span key={i} className="text-2xs bg-bg-section border border-border-light rounded-lg px-2.5 py-1 text-text-secondary">
                      {item.name} ×{item.qty}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-xl text-primary">₹{o.total}</p>
                <Link to={`/customer/orders/${o.id}`} className="btn-md btn-secondary rounded-xl text-sm whitespace-nowrap">
                  Track Order <ArrowRight size={14}/>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
