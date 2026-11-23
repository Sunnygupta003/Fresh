import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, MapPin, Phone, ArrowLeft } from 'lucide-react'
import { useOrderStore } from '../../../stores/orderStore'

const STEPS = ['Order Confirmed', 'Being Packed', 'Out for Delivery', 'Delivered']

export default function OrderTracking() {
  const { id } = useParams()
  const order = useOrderStore(state => state.orders.find(item => item.id === id))
  const delivered = order?.status === 'delivered'
  const currentStep = delivered ? 3 : 2

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/customer/orders" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={16}/> Back to Orders
      </Link>

      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-xl text-text">Order #{id}</h2>
            <p className="text-sm text-text-muted">Placed on January 20, 2024</p>
          </div>
          <span className={delivered ? 'status-delivered' : 'status-shipped'}>{delivered ? 'Delivered' : 'Out for Delivery'}</span>
        </div>

        {/* Progress stepper */}
        <div className="relative">
          <div className="flex items-start justify-between mb-8">
            {STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: i * 0.15, type:'spring', stiffness:300, damping:18 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 font-bold text-sm
                    ${i < currentStep ? 'bg-primary border-primary text-white shadow-glow'
                    : i === currentStep ? 'bg-primary-50 border-primary text-primary animate-pulse-green'
                    : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                >
                  {i < currentStep ? <Check size={18}/> : i === currentStep ? '🚚' : i + 1}
                </motion.div>
                <p className={`text-center text-2xs font-semibold ${i <= currentStep ? 'text-primary' : 'text-text-muted'}`}>
                  {step}
                </p>
                {i < currentStep && (
                  <p className="text-2xs text-text-muted text-center mt-0.5">
                    {['9:10 AM', '10:30 AM', '12:15 PM', ''][i]}
                  </p>
                )}
              </div>
            ))}
          </div>
          {/* Connector bar */}
          <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-0">
            <motion.div className="h-full bg-primary rounded-full"
              initial={{ width: 0 }} animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}/>
          </div>
        </div>

        {/* ETA */}
        <div className={`rounded-2xl p-4 flex items-center justify-between border ${delivered ? 'bg-green-50 border-green-200' : 'bg-primary-50 border-primary-200'}`}>
          <div>
            <p className="text-sm text-primary-600 font-medium">{delivered ? 'Delivery completed' : 'Estimated Arrival'}</p>
            <p className="font-display font-bold text-2xl text-primary">{delivered ? 'Successfully Delivered' : 'Today by 2:30 PM'}</p>
          </div>
          <div className="text-4xl">🚚</div>
        </div>
      </div>

      {/* Delivery partner */}
      <div className="card p-5 mb-6">
        <h3 className="font-semibold text-text mb-4">Delivery Partner</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80"
              alt="Partner" className="w-12 h-12 rounded-xl object-cover border-2 border-primary-100"/>
            <div>
              <p className="font-semibold text-text">Rahul Sharma</p>
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <span className="text-yellow-400">★</span> 4.8 · GreenBasket Partner
              </div>
            </div>
          </div>
          <button className="btn-icon bg-primary-50 text-primary hover:bg-primary hover:text-white transition-all p-3">
            <Phone size={18}/>
          </button>
        </div>
      </div>

      {/* Delivery address */}
      <div className="card p-5">
        <h3 className="font-semibold text-text mb-4 flex items-center gap-2"><MapPin size={18} className="text-primary"/> Delivery Address</h3>
        <p className="font-medium text-text">Priya Sharma</p>
        <p className="text-sm text-text-secondary">123, Green Park Colony, Near Station Road</p>
        <p className="text-sm text-text-secondary">Mumbai, Maharashtra - 400001</p>
        <p className="text-sm text-text-muted mt-1">📞 +91 98765 43210</p>
      </div>
    </div>
  )
}
