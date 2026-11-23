import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, ClipboardCheck, Phone, Mail, Calendar, MessageSquare } from 'lucide-react'
import { useProductStore } from '../../../stores/productStore'

const STATUS_CLASS = {
  pending: 'status-pending',
  accepted: 'status-shipped', // Reuse standard shipped style (orange/yellow)
  rejected: 'status-cancelled',
  completed: 'status-delivered'
}

export default function FarmerBulkRequests() {
  const bulkOrders = useProductStore(state => state.bulkOrders)
  const updateBulkOrderStatus = useProductStore(state => state.updateBulkOrderStatus)
  const loading = useProductStore(state => state.loading)

  // Ravi Kumar is FarmerID: 1
  const myRequests = bulkOrders.filter(o => o.FarmerID === 1)

  const handleAction = async (id, status) => {
    try {
      await updateBulkOrderStatus(id, status)
    } catch (e) {
      console.error('Failed to update bulk order status:', e)
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h2 className="font-display font-bold text-2xl text-text">Bulk Order Requests</h2>
        <p className="text-sm text-text-muted mt-1">Review, accept, or update bulk purchase requests from buyers.</p>
      </header>

      {loading && myRequests.length === 0 ? (
        <div className="card p-10 text-center flex flex-col items-center">
          <span className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
          <p className="text-text-secondary text-sm">Loading bulk orders...</p>
        </div>
      ) : myRequests.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-text-muted mb-4 border border-border-light">
            <ClipboardCheck size={28} />
          </div>
          <h3 className="font-display font-bold text-lg text-text mb-2">No bulk requests yet</h3>
          <p className="text-text-secondary text-sm">Wholesale buyer inquiries will appear here.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table-base">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Delivery Date</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((o, i) => (
                <tr key={o.OrderID}>
                  <td className="font-mono text-xs font-semibold text-primary">{o.OrderID}</td>
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-text">{o.CustomerName}</span>
                      <span className="text-3xs text-text-muted flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> {o.Phone}
                      </span>
                    </div>
                  </td>
                  <td className="text-sm font-medium text-text">{o.ProductName}</td>
                  <td className="text-sm font-bold text-primary">{o.Quantity} units</td>
                  <td className="text-xs text-text-muted whitespace-nowrap">
                    {new Date(o.DeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    {o.Message ? (
                      <div className="max-w-[150px] truncate text-xs text-text-secondary" title={o.Message}>
                        {o.Message}
                      </div>
                    ) : (
                      <span className="text-text-light italic text-3xs">None</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-${STATUS_CLASS[o.Status.toLowerCase()] || 'pending'} capitalize`}>
                      {o.Status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {o.Status.toLowerCase() === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(o.OrderID, 'accepted')}
                            className="w-7 h-7 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors"
                            title="Accept Request"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => handleAction(o.OrderID, 'rejected')}
                            className="w-7 h-7 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors"
                            title="Reject Request"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                      {o.Status.toLowerCase() === 'accepted' && (
                        <button
                          onClick={() => handleAction(o.OrderID, 'completed')}
                          className="btn-xs bg-primary text-white rounded-lg px-2.5 py-1 text-xs hover:bg-primary-600 transition-colors"
                        >
                          Complete ✓
                        </button>
                      )}
                      {(o.Status.toLowerCase() === 'rejected' || o.Status.toLowerCase() === 'completed') && (
                        <span className="text-3xs text-text-light italic">No action</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
