import { useState } from 'react'
import { Search, Check, X, Eye } from 'lucide-react'
import { products } from '../../../data/mockData'

export default function AdminProducts() {
  const [search, setSearch] = useState('')
  const [items, setItems]   = useState(products.map(p=>({...p,status:p.organic?'approved':'pending'})))

  const filtered = items.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )
  const approve = (id) => setItems(i => i.map(p => p.id===id?{...p,status:'approved'}:p))
  const reject  = (id) => setItems(i => i.map(p => p.id===id?{...p,status:'rejected'}:p))

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-display font-bold text-2xl text-gray-800">Products <span className="text-gray-400 font-normal text-lg">({items.length})</span></h2>
        <div className="flex gap-3 text-xs font-semibold">
          <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-lg">{items.filter(p=>p.status==='pending').length} Pending</span>
          <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg">{items.filter(p=>p.status==='approved').length} Approved</span>
        </div>
      </div>

      <div className="relative mb-5">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." className="input-base pl-10"/>
      </div>

      <div className="table-wrapper">
        <table className="table-base">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Farmer</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0"/>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{p.name}</p>
                      {p.organic && <span className="text-2xs text-primary-600">🌿 Organic</span>}
                    </div>
                  </div>
                </td>
                <td className="text-sm text-gray-500">{p.category}</td>
                <td className="text-sm text-gray-600">{p.farmer}</td>
                <td className="font-semibold text-primary text-sm">₹{p.price}/{p.unit}</td>
                <td className="text-sm">{p.stock}</td>
                <td>
                  <span className={`badge ${p.status==='approved'?'badge-green':p.status==='rejected'?'badge-red':'badge-orange'}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1.5">
                    {p.status === 'pending' && (
                      <>
                        <button onClick={()=>approve(p.id)}
                          className="w-7 h-7 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-colors">
                          <Check size={13}/>
                        </button>
                        <button onClick={()=>reject(p.id)}
                          className="w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors">
                          <X size={13}/>
                        </button>
                      </>
                    )}
                    <button className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <Eye size={13}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
