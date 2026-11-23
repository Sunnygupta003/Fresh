import { useState, useEffect } from 'react'
import { CheckCircle2, MapPin, Truck, Phone, Navigation } from 'lucide-react'
import { useOrderStore } from '../../../stores/orderStore'
import { motion } from 'framer-motion'

export default function MapTracking() {
  const orders = useOrderStore(state => state.orders)
  const markDelivered = useOrderStore(state => state.markDelivered)
  
  const assigned = orders.filter(order => order.status === 'shipped')
  
  // Track selected order for the map
  const [selectedOrder, setSelectedOrder] = useState(assigned[0]?.id || null)

  // Update selected if assigned changes
  useEffect(() => {
    if (assigned.length > 0 && !assigned.find(o => o.id === selectedOrder)) {
      setSelectedOrder(assigned[0].id)
    } else if (assigned.length === 0) {
      setSelectedOrder(null)
    }
  }, [assigned, selectedOrder])

  const currentOrder = assigned.find(o => o.id === selectedOrder)

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      
      {/* Sidebar: Active Deliveries */}
      <div className="lg:w-1/3 flex flex-col h-full bg-white rounded-2xl shadow-card border border-border-light overflow-hidden">
        <div className="p-5 border-b border-border-light bg-bg-section">
          <h2 className="font-display text-xl font-bold">Active Deliveries</h2>
          <p className="text-sm text-text-muted mt-1">Select an order to track</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {assigned.length === 0 ? (
            <p className="text-center text-text-muted text-sm py-10">No active deliveries.</p>
          ) : (
            assigned.map(order => (
              <button 
                key={order.id} 
                onClick={() => setSelectedOrder(order.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedOrder === order.id ? 'border-primary bg-primary-50' : 'border-border-light hover:border-primary-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm">{order.id}</h3>
                  <span className="status-shipped text-2xs">On way</span>
                </div>
                <p className="text-xs text-text-muted mt-2 truncate"><MapPin size={12} className="inline mr-1"/>{order.address}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main: Map & Actions */}
      <div className="lg:w-2/3 flex flex-col h-full gap-4">
        
        {/* Map Simulation */}
        <div className="flex-1 bg-[#e5e3df] rounded-2xl shadow-card border border-border-light overflow-hidden relative">
          {!currentOrder ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <Navigation size={48} className="mb-4 opacity-50" />
              <p>Select an order to view route</p>
            </div>
          ) : (
            <>
              {/* Simulated Map Background Texture */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
              
              {/* Map UI Overlay */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50">
                  <p className="text-xs text-text-muted font-bold uppercase">Estimated Arrival</p>
                  <p className="text-xl font-bold text-text">14 mins</p>
                </div>
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50">
                  <p className="text-xs text-text-muted font-bold uppercase">Distance</p>
                  <p className="text-lg font-bold text-text">3.2 km</p>
                </div>
              </div>

              {/* Simulated Route Path & Truck */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="300" height="300" viewBox="0 0 300 300" className="absolute">
                  <path id="route" d="M50,250 C100,250 150,150 250,50" fill="transparent" stroke="#10b981" strokeWidth="6" strokeDasharray="10,10" className="opacity-50" />
                </svg>
                
                {/* Customer Location */}
                <div className="absolute mt-[-200px] ml-[200px] flex flex-col items-center">
                  <div className="bg-white p-2 rounded-full shadow-lg border-2 border-red-500 z-10">
                    <MapPin className="text-red-500" fill="currentColor" size={24} />
                  </div>
                  <div className="bg-white/90 px-2 py-1 rounded shadow text-xs font-bold mt-1 max-w-[120px] text-center truncate">
                    {currentOrder.address.split(',')[0]}
                  </div>
                </div>

                {/* Animated Truck */}
                <motion.div 
                  className="absolute mt-[200px] ml-[-200px] bg-primary text-white p-3 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] z-20"
                  animate={{ 
                    x: [0, 50, 100, 200], 
                    y: [0, 0, -100, -200] 
                  }}
                  transition={{ 
                    duration: 15, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                >
                  <Truck size={24} />
                </motion.div>
              </div>
            </>
          )}
        </div>

        {/* Action Bar */}
        {currentOrder && (
          <div className="bg-white rounded-2xl shadow-card border border-border-light p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary">
                <PackageCheck size={24}/>
              </div>
              <div>
                <p className="font-bold">{currentOrder.id}</p>
                <p className="text-sm text-text-muted">{currentOrder.items ? currentOrder.items.length : 0} items to deliver</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="btn-md btn-secondary rounded-xl px-4">
                <Phone size={18} className="mr-2" /> Call Customer
              </button>
              <button 
                onClick={() => markDelivered(currentOrder.id)} 
                className="btn-md btn-primary rounded-xl px-6"
              >
                <CheckCircle2 size={18} className="mr-2" /> Mark Delivered
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
