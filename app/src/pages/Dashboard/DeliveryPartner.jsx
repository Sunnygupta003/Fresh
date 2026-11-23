import { Link } from 'react-router-dom'
import { CheckCircle2, MapPin, PackageCheck, Truck } from 'lucide-react'
import { useOrderStore } from '../../stores/orderStore'

export default function DeliveryPartner() {
  const orders = useOrderStore(state => state.orders)
  const markDelivered = useOrderStore(state => state.markDelivered)
  const assigned = orders.filter(order => order.status === 'shipped' || order.status === 'delivered')
  const active = assigned.filter(order => order.status === 'shipped').length

  return (
    <main className="min-h-screen bg-bg-section p-5 sm:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div><p className="text-primary font-semibold text-sm">DELIVERY PARTNER PORTAL</p><h1 className="font-display text-3xl font-bold text-text">Today’s deliveries</h1><p className="text-text-secondary mt-1">Mark an order delivered after handing it to the customer.</p></div>
          <Link to="/customer/orders/ORD002" className="btn-md btn-secondary rounded-xl">Open customer tracking</Link>
        </header>
        <div className="grid sm:grid-cols-2 gap-4 mb-7">
          <div className="card p-5 flex items-center gap-4"><Truck className="text-primary" size={28}/><div><p className="text-sm text-text-muted">Active drops</p><p className="font-display font-bold text-2xl">{active}</p></div></div>
          <div className="card p-5 flex items-center gap-4"><CheckCircle2 className="text-green-600" size={28}/><div><p className="text-sm text-text-muted">Completed</p><p className="font-display font-bold text-2xl">{assigned.length - active}</p></div></div>
        </div>
        <section className="card p-6"><h2 className="font-display text-xl font-bold mb-5">Assigned orders</h2><div className="space-y-4">
          {assigned.map(order => <article key={order.id} className="border border-border-light rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"><div className="w-12 h-12 rounded-xl bg-primary-50 text-primary flex items-center justify-center"><PackageCheck size={24}/></div><div className="flex-1"><div className="flex gap-2 items-center"><h3 className="font-bold">{order.id}</h3><span className={order.status === 'delivered' ? 'status-delivered' : 'status-shipped'}>{order.status === 'delivered' ? 'Delivered' : 'Out for delivery'}</span></div><p className="text-sm text-text-muted mt-1"><MapPin size={14} className="inline mr-1"/>{order.address}</p></div>{order.status === 'delivered' ? <span className="text-green-600 font-semibold flex gap-2"><CheckCircle2 size={19}/> Delivered</span> : <button onClick={() => markDelivered(order.id)} className="btn-md btn-primary rounded-xl"><CheckCircle2 size={18}/> Mark delivered</button>}</article>)}
        </div></section>
      </div>
    </main>
  )
}
