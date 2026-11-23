import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { products } from '../../../data/mockData'

const INIT = products.filter(p => p.organic).slice(0, 5)

export default function Wishlist() {
  const [items, setItems] = useState(INIT)
  const remove = (id) => setItems(w => w.filter(p => p.id !== id))

  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-text mb-6 flex items-center gap-2">
        <Heart size={24} className="text-red-500" fill="currentColor"/> My Wishlist
        <span className="ml-2 text-lg text-text-muted font-normal">({items.length} items)</span>
      </h2>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">💔</div>
          <p className="text-text-muted font-medium">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(p => (
            <motion.div key={p.id} layout exit={{ opacity:0, scale:0.9 }} className="card overflow-hidden">
              <div className="relative h-44 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/>
                {p.organic && <span className="absolute top-3 left-3 badge-organic text-2xs">🌿 Organic</span>}
                <button onClick={()=>remove(p.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-xl flex items-center justify-center text-danger hover:bg-red-50 shadow-md transition-colors">
                  <Trash2 size={14}/>
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-text mb-1">{p.name}</h3>
                <p className="text-sm text-text-muted mb-3">{p.farmer} · {p.location}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xl text-primary">₹{p.price}<span className="text-sm text-text-muted font-normal">/{p.unit}</span></span>
                  <button className="btn-sm btn-primary rounded-xl flex items-center gap-1.5">
                    <ShoppingCart size={14}/> Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
