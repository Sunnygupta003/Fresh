import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react'
import { useProductStore } from '../../../stores/productStore'
import { getFreshnessStatus } from '../../../utils/freshness'

export default function FarmerProducts() {
  const products = useProductStore(state => state.products)
  const myProducts = products.filter(p => p.farmerId === 1)
  
  const [search, setSearch] = useState('')
  const filtered = myProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-display font-bold text-2xl text-text">My Products</h2>
        <Link to="/farmer/products/add" className="btn-md btn-primary rounded-xl flex items-center gap-2 w-fit">
          <Plus size={18}/> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"/>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search your products..." className="input-base pl-10"/>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(p => {
          const freshStatus = getFreshnessStatus(p.harvestDate)
          return (
            <motion.div key={p.id} layout className="card overflow-hidden group">
              <div className="relative h-44 overflow-hidden bg-gray-50">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                
                {/* Badges on image overlay */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
                  {p.organic && <span className="badge-organic text-3xs px-1.5 py-0.5">🌿 Organic</span>}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${freshStatus.bgColor} ${freshStatus.textColor} ${freshStatus.color} shadow-sm`}>
                    {freshStatus.emoji} {freshStatus.label}
                  </span>
                </div>

                <div className={`absolute top-2 right-2 text-2xs font-bold px-2 py-1 rounded-lg ${p.stock < 80 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {p.stock} {p.unit}
                </div>
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Link to={`/product/${p.id}`} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-md">
                    <Eye size={16}/>
                  </Link>
                  <button className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors shadow-md">
                    <Edit size={16}/>
                  </button>
                  <button className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-danger hover:bg-danger hover:text-white transition-colors shadow-md">
                    <Trash2 size={16}/>
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-2xs text-primary-500 font-semibold mb-0.5">{p.category}</p>
                <h3 className="font-semibold text-text text-sm mb-2 line-clamp-2">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">₹{p.price}<span className="text-xs text-text-muted font-normal">/{p.unit}</span></span>
                  <span className={`text-2xs font-medium ${p.stock < 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {p.stock < 80 ? '⚠️ Low' : '✓ In Stock'}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
