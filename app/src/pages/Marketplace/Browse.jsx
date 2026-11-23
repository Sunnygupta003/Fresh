import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import ProductCard from '../../components/shared/ProductCard'
import { categories } from '../../data/mockData'
import { useProductStore } from '../../stores/productStore'

const SORT_OPTIONS = ['Featured','Price: Low to High','Price: High to Low','Highest Rated','Newest']

export default function Marketplace() {
  const products = useProductStore(state => state.products)
  const [search, setSearch]     = useState('')
  const [selCat, setSelCat]     = useState('All')
  const [organic, setOrganic]   = useState(false)
  const [maxPrice, setMaxPrice] = useState(500)
  const [sort, setSort]         = useState('Featured')
  const [view, setView]         = useState('grid')
  const [cart, setCart]         = useState([])
  const [wishlist, setWishlist] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)

  const addToCart = (p) => setCart(c => { const ex=c.find(x=>x.id===p.id); return ex?c.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x):[...c,{...p,qty:1}] })
  const toggleWish = (id) => setWishlist(w => w.includes(id)?w.filter(x=>x!==id):[...w,id])

  const filtered = useMemo(() => {
    let res = products
    if (search) res = res.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    if (selCat !== 'All') res = res.filter(p => p.category === selCat)
    if (organic) res = res.filter(p => p.organic)
    res = res.filter(p => p.price <= maxPrice)
    if (sort === 'Price: Low to High') res = [...res].sort((a,b) => a.price-b.price)
    else if (sort === 'Price: High to Low') res = [...res].sort((a,b) => b.price-a.price)
    else if (sort === 'Highest Rated') res = [...res].sort((a,b) => b.rating-a.rating)
    return res
  }, [search, selCat, organic, maxPrice, sort])

  return (
    <div className="min-h-screen bg-bg">
      <Navbar cartCount={cart.reduce((s,i)=>s+i.qty,0)} />
      <div className="pt-20">
        {/* Hero banner */}
        <div className="bg-primary py-12">
          <div className="section-wrapper">
            <h1 className="font-display text-4xl font-bold text-white mb-2">Fresh Marketplace</h1>
            <p className="text-primary-200 mb-6">Discover {products.length}+ fresh products from local farmers</p>
            <div className="relative max-w-xl">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search for fruits, vegetables, dairy..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-text placeholder:text-text-muted
                  focus:outline-none focus:ring-2 focus:ring-white/40 shadow-float text-base" />
              {search && <button onClick={()=>setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-danger"><X size={18}/></button>}
            </div>
          </div>
        </div>

        <div className="section-wrapper py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar Filter */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-card border border-border-light p-5 sticky top-24">
                <h2 className="font-semibold text-text mb-5 flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-primary" /> Filters
                </h2>

                {/* Category */}
                <div className="mb-5">
                  <p className="text-sm font-semibold text-text-secondary mb-3">Category</p>
                  <div className="flex flex-col gap-1">
                    {['All', ...categories.map(c=>c.name)].map(cat => (
                      <button key={cat} onClick={()=>setSelCat(cat)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors
                          ${selCat===cat ? 'bg-primary-50 text-primary font-semibold' : 'text-text-secondary hover:bg-primary-50 hover:text-primary'}`}>
                        {selCat===cat && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div className="mb-5">
                  <p className="text-sm font-semibold text-text-secondary mb-3">Max Price: <span className="text-primary">₹{maxPrice}</span></p>
                  <input type="range" min={20} max={500} value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary" />
                  <div className="flex justify-between text-2xs text-text-muted mt-1"><span>₹20</span><span>₹500</span></div>
                </div>

                {/* Organic toggle */}
                <div className="flex items-center justify-between py-3 border-t border-border-light">
                  <span className="text-sm font-semibold text-text-secondary">🌿 Organic Only</span>
                  <button onClick={()=>setOrganic(!organic)}
                    className={`w-11 h-6 rounded-full transition-colors ${organic?'bg-primary':'bg-gray-200'} relative`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${organic?'translate-x-5':'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Reset */}
                <button onClick={()=>{setSelCat('All');setOrganic(false);setMaxPrice(500);setSearch('')}}
                  className="w-full mt-4 text-sm text-text-muted hover:text-danger transition-colors flex items-center justify-center gap-1">
                  <X size={14}/> Clear All Filters
                </button>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <p className="text-sm text-text-muted">
                  Showing <span className="font-semibold text-text">{filtered.length}</span> products
                  {selCat !== 'All' && <> in <span className="text-primary font-medium">{selCat}</span></>}
                </p>
                <div className="flex items-center gap-3">
                  <select value={sort} onChange={e=>setSort(e.target.value)}
                    className="text-sm border border-border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 text-text">
                    {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <div className="flex border border-border rounded-xl overflow-hidden">
                    <button onClick={()=>setView('grid')} className={`px-3 py-2 ${view==='grid'?'bg-primary text-white':'bg-white text-text-muted hover:bg-primary-50'}`}><Grid3X3 size={16}/></button>
                    <button onClick={()=>setView('list')} className={`px-3 py-2 ${view==='list'?'bg-primary text-white':'bg-white text-text-muted hover:bg-primary-50'}`}><List size={16}/></button>
                  </div>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="font-display font-bold text-xl text-text mb-2">No products found</h3>
                  <p className="text-text-secondary">Try adjusting your filters or search term</p>
                </div>
              ) : (
                <div className={view==='grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'}>
                  {filtered.map((p,i) => (
                    <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>
                      <ProductCard product={p} onAddToCart={addToCart} onWishlist={toggleWish} wishlistIds={wishlist} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
