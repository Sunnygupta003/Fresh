import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Plus, X, Check } from 'lucide-react'
import { categories } from '../../../data/mockData'
import { useProductStore } from '../../../stores/productStore'
import { getProductSeason } from '../../../utils/seasonalData'

export default function AddProduct() {
  const navigate = useNavigate()
  const addProduct = useProductStore(state => state.addProduct)
  
  const [loading, setLoading] = useState(false)
  const [saved, setSaved]     = useState(false)
  const [organic, setOrganic] = useState(false)
  const [images, setImages]   = useState([])
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    unit: 'kg',
    stock: '',
    minOrder: '1',
    harvestDate: new Date().toISOString().split('T')[0],
    bulkAvailable: true
  })
  
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const computedSeason = getProductSeason(form.name)
      await addProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        organic,
        season: computedSeason,
        farmer: 'Ravi Kumar',
        farmerId: 1,
        location: 'Nashik, MH',
      })
      setSaved(true)
      setTimeout(() => navigate('/farmer/products'), 1500)
    } catch (err) {
      console.error('Failed to publish product:', err)
    } finally {
      setLoading(false)
    }
  }

  // Preview images (mock)
  const PREVIEW_IMGS = [
    'https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=200&q=70',
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200&q=70',
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/farmer/products" className="btn-icon"><ArrowLeft size={20}/></Link>
        <h2 className="font-display font-bold text-2xl text-text">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Info */}
        <div className="card p-6">
          <h3 className="font-semibold text-text mb-5 pb-3 border-b border-border-light">📋 Product Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group col-span-2">
              <label htmlFor="pname" className="form-label">Product Name *</label>
              <input id="pname" value={form.name} onChange={e=>set('name',e.target.value)}
                placeholder="e.g. Organic Cherry Tomatoes" className="input-base" required/>
            </div>
            
            <div className="form-group">
              <label htmlFor="pcat" className="form-label">Category *</label>
              <select id="pcat" value={form.category} onChange={e=>set('category',e.target.value)}
                className="input-base" required>
                <option value="">Select category</option>
                {categories.map(c=><option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="pharvest" className="form-label">Harvest Date *</label>
              <input id="pharvest" type="date" value={form.harvestDate} onChange={e=>set('harvestDate',e.target.value)}
                className="input-base" required/>
            </div>

            <div className="form-group">
              <label htmlFor="punit" className="form-label">Unit</label>
              <select id="punit" value={form.unit} onChange={e=>set('unit',e.target.value)} className="input-base">
                {['kg','g','litre','piece','dozen','bunch','500g','250g','100g'].map(u=><option key={u}>{u}</option>)}
              </select>
            </div>
            
            <div className="form-group col-span-2">
              <label htmlFor="pdesc" className="form-label">Description</label>
              <textarea id="pdesc" value={form.description} onChange={e=>set('description',e.target.value)}
                placeholder="Describe your product — freshness, growing method, harvest date..."
                className="input-base resize-none" rows={3}/>
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="card p-6">
          <h3 className="font-semibold text-text mb-5 pb-3 border-b border-border-light">💰 Pricing & Stock</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="form-group">
              <label htmlFor="pprice" className="form-label">Price (₹) *</label>
              <input id="pprice" type="number" value={form.price} onChange={e=>set('price',e.target.value)}
                placeholder="0" className="input-base" min={0} required/>
            </div>
            <div className="form-group">
              <label htmlFor="pstock" className="form-label">Stock Qty *</label>
              <input id="pstock" type="number" value={form.stock} onChange={e=>set('stock',e.target.value)}
                placeholder="0" className="input-base" min={0} required/>
            </div>
            <div className="form-group">
              <label htmlFor="pmin" className="form-label">Min Order</label>
              <input id="pmin" type="number" value={form.minOrder} onChange={e=>set('minOrder',e.target.value)}
                placeholder="1" className="input-base" min={1}/>
            </div>
          </div>
          
          <label className="flex items-center gap-2.5 cursor-pointer mt-4 select-none">
            <input type="checkbox" checked={form.bulkAvailable} onChange={e=>set('bulkAvailable',e.target.checked)}
              className="w-4 h-4 accent-primary rounded" />
            <span className="text-sm font-semibold text-text-secondary">Enable Bulk Order Requests for this product</span>
          </label>

          {form.price && form.stock && (
            <div className="mt-4 p-3 bg-primary-50 rounded-xl border border-primary-200 flex items-center gap-2 text-sm">
              <span className="text-primary">💡</span>
              <span className="text-primary-700">Potential revenue: <strong>₹{Number(form.price)*Number(form.stock)}</strong> if fully sold</span>
            </div>
          )}
        </div>

        {/* Organic toggle */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text">🌿 Organic Certified</h3>
              <p className="text-sm text-text-muted mt-0.5">Enable this if your product is organically grown without pesticides</p>
            </div>
            <button type="button" onClick={()=>setOrganic(!organic)}
              className={`w-14 h-7 rounded-full transition-colors flex-shrink-0 ${organic?'bg-primary':'bg-gray-200'} relative`}>
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${organic?'translate-x-7':'translate-x-0.5'}`}/>
            </button>
          </div>
          {organic && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
              className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200 flex items-center gap-2 text-sm text-green-700">
              <Check size={16}/> Organic badge will be displayed on your product listing
            </motion.div>
          )}
        </div>

        {/* Images */}
        <div className="card p-6">
          <h3 className="font-semibold text-text mb-5 pb-3 border-b border-border-light">📸 Product Images</h3>
          <div className="flex gap-4 flex-wrap mb-4">
            {PREVIEW_IMGS.map((img,i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-primary-200">
                <img src={img} alt="" className="w-full h-full object-cover"/>
                <button type="button" className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow text-danger hover:scale-110 transition-transform">
                  <X size={10}/>
                </button>
              </div>
            ))}
            <button type="button"
              className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-text-muted hover:border-primary hover:text-primary hover:bg-primary-50 transition-all">
              <Upload size={20}/>
              <span className="text-2xs">Upload</span>
            </button>
          </div>
          <p className="text-xs text-text-muted">Upload up to 5 images. First image will be the cover. PNG, JPG, WEBP accepted.</p>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Link to="/farmer/products" className="btn-lg btn-secondary rounded-xl flex-shrink-0">
            Cancel
          </Link>
          <motion.button type="submit" disabled={loading||saved} whileHover={{scale:1.02}} whileTap={{scale:0.97}}
            className={`btn-lg rounded-xl flex-1 justify-center disabled:opacity-70
              ${saved?'bg-green-500 text-white':'btn-primary'}`}>
            {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving...</>
            : saved ? <><Check size={18}/>  Product Added!</>
            : 'Publish Product 🚀'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}
