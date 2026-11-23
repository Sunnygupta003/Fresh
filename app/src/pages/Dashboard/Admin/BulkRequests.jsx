import { motion } from 'framer-motion'
import { ClipboardCheck, Phone } from 'lucide-react'
import { useProductStore } from '../../../stores/productStore'

const STATUS_CLASS = {
  pending: 'status-pending',
  accepted: 'status-shipped',
  rejected: 'status-cancelled',
  completed: 'status-delivered'
}

export default function AdminBulkRequests() {
  const bulkOrders = useProductStore(state => state.bulkOrders)
  const products = useProductStore(state => state.products)

  // Summary counts
  const pendingCount = bulkOrders.filter(o => o.Status.toLowerCase() === 'pending').length
  const acceptedCount = bulkOrders.filter(o => o.Status.toLowerCase() === 'accepted').length
  const completedCount = bulkOrders.filter(o => o.Status.toLowerCase() === 'completed').length
  const rejectedCount = bulkOrders.filter(o => o.Status.toLowerCase() === 'rejected').length

  return (
    <div>
      <header className="mb-6">
        <h2 className="font-display font-bold text-2xl text-gray-800">Bulk Order Monitoring</h2>
        <p className="text-sm text-gray-500 mt-1">Overview of all wholesale order requests across the platform.</p>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pending',   value: pendingCount,   bg: 'bg-yellow-50', color: 'text-yellow-600', icon: '⏳' },
          { label: 'Accepted',  value: acceptedCount,  bg: 'bg-blue-50',   color: 'text-blue-600',   icon: '✅' },
          { label: 'Completed', value: completedCount, bg: 'bg-green-50',  color: 'text-green-600',  icon: '🎉' },
          { label: 'Rejected',  value: rejectedCount,  bg: 'bg-red-50',    color: 'text-red-600',    icon: '❌' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${s.bg}`}>{s.icon}</div>
            <p className="font-display font-bold text-2xl text-gray-800">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      {bulkOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4 border border-gray-100">
            <ClipboardCheck size={28} />
          </div>
          <h3 className="font-display font-bold text-lg text-gray-800 mb-2">No bulk orders yet</h3>
          <p className="text-gray-500 text-sm">Bulk purchase requests from customers will appear here.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table-base">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Farmer ID</th>
                <th>Qty</th>
                <th>Delivery Date</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {bulkOrders.map(o => (
                <tr key={o.OrderID}>
                  <td className="font-mono text-xs font-semibold text-primary">{o.OrderID}</td>
                  <td className="text-sm font-medium text-gray-800">{o.CustomerName}</td>
                  <td className="text-xs text-gray-500 whitespace-nowrap">
                    <span className="flex items-center gap-1"><Phone size={10} /> {o.Phone}</span>
                  </td>
                  <td className="text-sm text-gray-700">{o.ProductName}</td>
                  <td className="text-xs text-gray-400 text-center">#{o.FarmerID}</td>
                  <td className="font-bold text-primary text-sm">{o.Quantity}</td>
                  <td className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(o.DeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    {o.Message ? (
                      <div className="max-w-[120px] truncate text-xs text-gray-500" title={o.Message}>{o.Message}</div>
                    ) : (
                      <span className="text-gray-300 italic text-3xs">—</span>
                    )}
                  </td>
                  <td>
                    <span className={STATUS_CLASS[o.Status.toLowerCase()] || 'status-pending'}>
                      {o.Status}
                    </span>
                  </td>
                  <td className="text-xs text-gray-400 whitespace-nowrap">{o.CreatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
