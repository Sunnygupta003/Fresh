import { useState } from 'react'
import { farmerOrders } from '../../../data/mockData'

const TABS    = ['All','Pending','Confirmed','Packed','Delivered','Cancelled']
const STATUS  = { pending:'status-pending', confirmed:'status-confirmed', packed:'status-packed', shipped:'status-shipped', delivered:'status-delivered', cancelled:'status-cancelled' }

export default function FarmerOrders() {
  const [tab, setTab] = useState('All')
  const [orders, setOrders] = useState(farmerOrders)

  const filtered = tab === 'All' ? orders : orders.filter(o => o.status === tab.toLowerCase())

  const updateStatus = (id, status) => setOrders(o => o.map(x => x.id===id ? {...x,status} : x))

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-text mb-6">Orders</h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-border-light shadow-card mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map(t => (
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
              ${tab===t ? 'bg-primary text-white shadow' : 'text-text-secondary hover:text-primary hover:bg-primary-50'}`}>
            {t}
            {t==='Pending' && <span className="ml-1.5 bg-yellow-400 text-yellow-900 text-2xs font-bold rounded-full px-1.5 py-0.5">{orders.filter(o=>o.status==='pending').length}</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table-base">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-text-muted">No {tab.toLowerCase()} orders</td></tr>
            ) : filtered.map(o => (
              <tr key={o.id}>
                <td className="font-mono text-xs font-semibold text-primary">{o.id}</td>
                <td>
                  <div>
                    <p className="font-medium text-text text-sm">{o.customer}</p>
                    <p className="text-2xs text-text-muted">{o.address}</p>
                  </div>
                </td>
                <td className="text-sm">{o.product}</td>
                <td className="text-sm font-medium">{o.qty}</td>
                <td className="font-bold text-primary">₹{o.total}</td>
                <td className="text-xs text-text-muted">{o.date}</td>
                <td><span className={STATUS[o.status]||'badge'}>{o.status}</span></td>
                <td>
                  {o.status === 'pending' && (
                    <div className="flex gap-1.5">
                      <button onClick={()=>updateStatus(o.id,'confirmed')}
                        className="text-2xs bg-green-100 text-green-700 hover:bg-green-200 font-semibold px-2.5 py-1 rounded-lg transition-colors">
                        Accept
                      </button>
                      <button onClick={()=>updateStatus(o.id,'cancelled')}
                        className="text-2xs bg-red-100 text-red-700 hover:bg-red-200 font-semibold px-2.5 py-1 rounded-lg transition-colors">
                        Decline
                      </button>
                    </div>
                  )}
                  {o.status === 'confirmed' && (
                    <button onClick={()=>updateStatus(o.id,'packed')}
                      className="text-2xs bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold px-2.5 py-1 rounded-lg transition-colors">
                      Mark Packed
                    </button>
                  )}
                  {o.status === 'packed' && (
                    <button onClick={()=>updateStatus(o.id,'delivered')}
                      className="text-2xs bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold px-2.5 py-1 rounded-lg transition-colors">
                      Mark Delivered
                    </button>
                  )}
                  {(o.status==='delivered'||o.status==='cancelled') && (
                    <span className="text-2xs text-text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
