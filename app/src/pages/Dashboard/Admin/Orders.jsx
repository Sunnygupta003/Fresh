import { useState } from 'react'
import { farmerOrders, customerOrders } from '../../../data/mockData'

const ALL_ORDERS = [
  ...farmerOrders.map(o=>({...o, type:'farmer', customer:o.customer})),
  ...customerOrders.map(o=>({...o, type:'customer', total:o.total})),
].sort((a,b) => new Date(b.date)-new Date(a.date))

const STATUS_CLASS = { pending:'status-pending', confirmed:'status-confirmed', packed:'status-packed', shipped:'status-shipped', delivered:'status-delivered', cancelled:'status-cancelled' }

export default function AdminOrders() {
  const [orders] = useState(ALL_ORDERS)
  const [tab, setTab] = useState('All')

  const filtered = tab==='All' ? orders : orders.filter(o=>o.status===tab.toLowerCase())

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-display font-bold text-2xl text-gray-800">All Orders</h2>
        <p className="text-sm text-gray-500">Total: <strong className="text-primary">{orders.length}</strong> orders</p>
      </div>

      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm mb-6 overflow-x-auto scrollbar-hide">
        {['All','Pending','Confirmed','Delivered','Cancelled'].map(t => (
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
              ${tab===t?'bg-primary text-white shadow':'text-gray-500 hover:text-primary hover:bg-primary-50'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="table-base">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Type</th><th>Date</th><th>Amount</th><th>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map((o,i) => (
              <tr key={i}>
                <td className="font-mono text-xs font-semibold text-primary">{o.id}</td>
                <td className="text-sm font-medium text-gray-800">{o.customer}</td>
                <td><span className={`badge ${o.type==='farmer'?'badge-green':'badge-blue'}`}>{o.type}</span></td>
                <td className="text-xs text-gray-400">{o.date}</td>
                <td className="font-bold text-primary">₹{o.total}</td>
                <td><span className={STATUS_CLASS[o.status]||'badge'}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
