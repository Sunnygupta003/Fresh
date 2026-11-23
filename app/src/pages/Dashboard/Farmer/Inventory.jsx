import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Plus, Minus } from 'lucide-react'
import { useProductStore } from '../../../stores/productStore'
import { getFreshnessStatus } from '../../../utils/freshness'

export default function FarmerInventory() {
  const products = useProductStore(state => state.products)
  // Filter for Ravi Kumar (farmerId: 1)
  const myProducts = products.filter(p => p.farmerId === 1)

  const [inv, setInv] = useState([])

  useEffect(() => {
    if (myProducts.length > 0) {
      setInv(myProducts.map(p => ({ ...p, reorderLevel: 50 })))
    }
  }, [products]) // Re-run when products update

  const adjust = (id, delta) => setInv(i => i.map(p => p.id===id ? {...p, stock: Math.max(0, p.stock+delta)} : p))

  const lowStock    = inv.filter(p => p.stock <= p.reorderLevel && p.stock > 0)
  const outOfStock  = inv.filter(p => p.stock === 0)
  const healthyStock = inv.filter(p => p.stock > p.reorderLevel)

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-bold text-2xl text-text">Inventory Management</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 border-l-4 border-green-400">
          <p className="text-2xl font-bold text-green-600">{healthyStock.length}</p>
          <p className="text-sm text-text-muted">Healthy Stock</p>
        </div>
        <div className="card p-4 border-l-4 border-yellow-400">
          <p className="text-2xl font-bold text-yellow-600">{lowStock.length}</p>
          <p className="text-sm text-text-muted">Low Stock</p>
        </div>
        <div className="card p-4 border-l-4 border-red-400">
          <p className="text-2xl font-bold text-red-600">{outOfStock.length}</p>
          <p className="text-sm text-text-muted">Out of Stock</p>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5"/>
          <div>
            <p className="font-semibold text-yellow-800">Low Stock Warning</p>
            <p className="text-sm text-yellow-700 mt-0.5">{lowStock.map(p=>p.name).join(' • ')} — consider restocking</p>
          </div>
        </div>
      )}

      {/* Inventory table */}
      <div className="table-wrapper">
        <table className="table-base">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Adjust</th>
            </tr>
          </thead>
          <tbody>
            {inv.map(p => {
              const status = p.stock === 0 ? 'out' : p.stock <= p.reorderLevel ? 'low' : 'ok'
              const freshStatus = getFreshnessStatus(p.harvestDate)
              return (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0"/>
                      <div>
                        <p className="font-medium text-text text-sm">{p.name}</p>
                        <div className="flex gap-1.5 items-center mt-0.5 flex-wrap">
                          {p.organic && <span className="text-[9px] text-primary-600 font-semibold bg-primary-50 px-1 rounded">🌿 Organic</span>}
                          <span className={`text-[9px] font-bold px-1.5 py-0.25 rounded border shadow-sm ${freshStatus.bgColor} ${freshStatus.textColor} ${freshStatus.color}`}>
                            {freshStatus.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-text-muted">{p.category}</td>
                  <td className="font-semibold text-primary text-sm">₹{p.price}/{p.unit}</td>
                  <td>
                    <span className={`font-bold text-lg ${status==='out'?'text-red-600':status==='low'?'text-yellow-600':'text-green-600'}`}>
                      {p.stock}
                    </span>
                    <span className="text-xs text-text-muted ml-1">{p.unit}</span>
                  </td>
                  <td className="text-sm text-text-muted">{p.reorderLevel} {p.unit}</td>
                  <td>
                    <span className={status==='out'?'status-cancelled':status==='low'?'status-pending':'status-delivered'}>
                      {status==='out'?'Out of Stock':status==='low'?'Low Stock':'In Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={()=>adjust(p.id,-10)}
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors">
                        <Minus size={13}/>
                      </button>
                      <button onClick={()=>adjust(p.id,+10)}
                        className="w-7 h-7 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition-colors">
                        <Plus size={13}/>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
