import { MapPin, PackageCheck, Truck } from 'lucide-react'
import { useOrderStore } from '../../../stores/orderStore'
import { motion } from 'framer-motion'

export default function AvailableOrders() {
  const orders = useOrderStore(state => state.orders)
  const acceptOrder = useOrderStore(state => state.acceptOrder)
  
  const pendingOrders = orders.filter(order => order.status === 'pending')

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text">Available Orders</h1>
        <p className="text-text-secondary mt-1">Accept these orders to begin delivery.</p>
      </header>

      <div className="space-y-4">
        {pendingOrders.length === 0 ? (
          <div className="card p-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <PackageCheck size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">No available orders</h2>
            <p className="text-text-muted">Wait for customers to place new orders.</p>
          </div>
        ) : (
          pendingOrders.map((order, i) => (
            <motion.article 
              initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: i * 0.1}}
              key={order.id} 
              className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary-300 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <PackageCheck size={24}/>
              </div>
              <div className="flex-1">
                <div className="flex gap-2 items-center">
                  <h3 className="font-bold">{order.id}</h3>
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-semibold">Ready for pickup</span>
                </div>
                <p className="text-sm text-text-muted mt-1 flex items-center">
                  <MapPin size={14} className="mr-1 shrink-0"/> {order.address}
                </p>
                <div className="mt-2 text-sm text-text-secondary">
                  <strong>Total:</strong> ₹{order.total} • <strong>Items:</strong> {order.items ? order.items.reduce((a,b)=>a+b.qty,0) : 0}
                </div>
              </div>
              
              <button 
                onClick={() => acceptOrder(order.id)} 
                className="btn-md btn-primary rounded-xl whitespace-nowrap"
              >
                <Truck size={18} className="mr-2"/> Accept & Start
              </button>
            </motion.article>
          ))
        )}
      </div>
    </div>
  )
}
