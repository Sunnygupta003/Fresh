import { Link } from 'react-router-dom'
import { CheckCircle2, MapPin, PackageCheck, Truck, Package } from 'lucide-react'
import { useOrderStore } from '../../../stores/orderStore'

export default function DeliveryHome() {
  const orders = useOrderStore(state => state.orders)
  
  const pendingOrders = orders.filter(order => order.status === 'pending')
  const assigned = orders.filter(order => order.status === 'shipped' || order.status === 'delivered')
  const active = assigned.filter(order => order.status === 'shipped').length

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="mb-8">
        <p className="text-primary font-semibold text-sm">OVERVIEW</p>
        <h1 className="font-display text-3xl font-bold text-text">Today’s deliveries</h1>
        <p className="text-text-secondary mt-1">Accept new orders or track your ongoing deliveries.</p>
      </header>

      <div className="grid sm:grid-cols-3 gap-4 mb-7">
        <div className="card p-5 flex items-center gap-4">
          <Package className="text-orange-500" size={28}/>
          <div>
            <p className="text-sm text-text-muted">Available</p>
            <p className="font-display font-bold text-2xl">{pendingOrders.length}</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <Truck className="text-primary" size={28}/>
          <div>
            <p className="text-sm text-text-muted">Active drops</p>
            <p className="font-display font-bold text-2xl">{active}</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <CheckCircle2 className="text-green-600" size={28}/>
          <div>
            <p className="text-sm text-text-muted">Completed</p>
            <p className="font-display font-bold text-2xl">{assigned.length - active}</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <section className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display text-xl font-bold">New Available Orders</h2>
            <Link to="/delivery/available" className="text-sm text-primary font-semibold hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {pendingOrders.length === 0 ? (
              <p className="text-text-muted text-sm text-center py-4">No available orders at the moment.</p>
            ) : (
              pendingOrders.slice(0, 3).map(order => (
                <div key={order.id} className="border border-border-light rounded-2xl p-4 flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <Package size={20}/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{order.id}</h3>
                    <p className="text-xs text-text-muted mt-1 truncate"><MapPin size={12} className="inline mr-1"/>{order.address}</p>
                  </div>
                  <Link to="/delivery/available" className="btn-sm btn-primary rounded-lg h-fit">Accept</Link>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="card p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-display text-xl font-bold">Active Deliveries</h2>
            <Link to="/delivery/map" className="text-sm text-primary font-semibold hover:underline">Track</Link>
          </div>
          <div className="space-y-4">
            {assigned.filter(o => o.status === 'shipped').length === 0 ? (
              <p className="text-text-muted text-sm text-center py-4">You have no active deliveries.</p>
            ) : (
              assigned.filter(o => o.status === 'shipped').slice(0, 3).map(order => (
                <div key={order.id} className="border border-border-light rounded-2xl p-4 flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center shrink-0">
                    <Truck size={20}/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{order.id}</h3>
                    <p className="text-xs text-text-muted mt-1 truncate"><MapPin size={12} className="inline mr-1"/>{order.address}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
