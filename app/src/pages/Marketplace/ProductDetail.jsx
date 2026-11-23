import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, MapPin, ArrowLeft, Plus, Minus } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import ProductCard from '../../components/shared/ProductCard'
import { useProductStore } from '../../stores/productStore'
import { getFreshnessStatus } from '../../utils/freshness'

export default function ProductDetail() {
  const { id } = useParams()
  const products = useProductStore(state => state.products)
  const createBulkOrder = useProductStore(state => state.createBulkOrder)
  
  const product = products.find(p => p.id === Number(id)) || products[0]
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const [qty, setQty]       = useState(1)
  const [selImg, setSelImg] = useState(0)
  const [wished, setWished] = useState(false)
  const [added, setAdded]   = useState(false)
  const [tab, setTab]       = useState('desc')

  // Bulk order form state
  const [bulkForm, setBulkForm] = useState({ name: '', phone: '', qty: '', deliveryDate: '', message: '' })
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkSuccess, setBulkSuccess] = useState('')

  const handleAdd = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBulkSubmit = async (e) => {
    e.preventDefault()
    setBulkLoading(true)
    try {
      await createBulkOrder({
        customerName: bulkForm.name,
        phone: bulkForm.phone,
        productId: product.id,
        productName: product.name,
        farmerId: product.farmerId || 1,
        quantity: Number(bulkForm.qty),
        deliveryDate: bulkForm.deliveryDate,
        message: bulkForm.message
      })
      setBulkSuccess('✅ Bulk order request submitted successfully! The farmer will review it.')
      setBulkForm({ name: '', phone: '', qty: '', deliveryDate: '', message: '' })
    } catch (err) {
      console.error('Failed to submit bulk order:', err)
    } finally {
      setBulkLoading(false)
    }
  }

  const imgs = [product.image, product.image, product.image]

  const reviews = [
    { name: 'Priya S.', rating: 5, date: 'Jan 12', text: 'Super fresh! Arrived perfectly packed. Will order again.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80' },
    { name: 'Rahul M.', rating: 4, date: 'Jan 8',  text: 'Good quality, slightly smaller than expected but taste is great.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80' },
  ]

  // Compare prices: same product sold by different farmers
  const otherSellers = products
    .filter(p => p.name.toLowerCase() === product.name.toLowerCase())
    .sort((a, b) => a.price - b.price)

  const freshStatus = getFreshnessStatus(product.harvestDate)

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="pt-20">
        <div className="section-wrapper py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link to="/" className="hover:text-primary">Home</Link> /
            <Link to="/marketplace" className="hover:text-primary">Marketplace</Link> /
            <Link to={`/marketplace?cat=${product.category}`} className="hover:text-primary">{product.category}</Link> /
            <span className="text-text font-medium">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <div>
              <motion.div className="relative overflow-hidden rounded-3xl mb-4 bg-white shadow-card border border-border-light h-96"
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                <img src={imgs[selImg]} alt={product.name} className="w-full h-full object-cover" />
                {product.organic && <span className="absolute top-4 left-4 badge-organic px-3 py-1">🌿 Certified Organic</span>}
                <button onClick={() => setWished(!wished)}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md
                    ${wished ? 'bg-red-500 text-white' : 'bg-white text-text-muted hover:text-red-500'} transition-all`}>
                  <Heart size={18} fill={wished ? 'currentColor' : 'none'} />
                </button>
              </motion.div>
              <div className="flex gap-3">
                {imgs.map((img, i) => (
                  <button key={i} onClick={() => setSelImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selImg === i ? 'border-primary shadow-md' : 'border-border-light'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
              <div>
                <span className="text-primary-500 text-sm font-semibold">{product.category}</span>
                <h1 className="font-display text-3xl font-bold text-text mt-1 mb-2">{product.name}</h1>
                
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={16} fill={s <= product.rating ? '#FBBF24' : 'none'} className={s <= product.rating ? 'text-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-text">{product.rating}</span>
                  <span className="text-sm text-text-muted">({product.reviews} reviews)</span>
                  
                  {/* Freshness Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${freshStatus.bgColor} ${freshStatus.textColor} ${freshStatus.color}`}>
                    {freshStatus.emoji} {freshStatus.label}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <MapPin size={14} className="text-primary" />
                  <span>{product.farmer} · {product.location}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-4 border-y border-border-light">
                <span className="text-4xl font-display font-bold text-primary">₹{product.price}</span>
                <span className="text-text-muted">/{product.unit}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-text-light line-through">₹{product.originalPrice}</span>
                    <span className="badge-green">{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span>
                  </>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.stock > 20 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-sm font-medium text-text-secondary">
                  {product.stock > 20 ? `In Stock (${product.stock} ${product.unit} available)` : `Low Stock — Only ${product.stock} left`}
                </span>
              </div>

              {/* Quantity + Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-primary-50 transition-colors text-text"><Minus size={16} /></button>
                  <span className="px-5 py-3 font-bold text-text border-x border-border">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 hover:bg-primary-50 transition-colors text-text"><Plus size={16} /></button>
                </div>
                <motion.button onClick={handleAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className={`flex-1 btn-lg rounded-xl flex items-center justify-center gap-2 transition-all
                    ${added ? 'bg-green-500 text-white' : 'btn-primary'}`}>
                  <ShoppingCart size={20} />
                  {added ? '✓ Added to Cart!' : 'Add to Cart'}
                </motion.button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-bg-section rounded-2xl border border-border-light">
                {[
                  { icon: <Truck size={18} />,        label: 'Free Delivery', sub: 'On orders ₹199+' },
                  { icon: <Shield size={18} />,       label: 'Fresh Guarantee', sub: 'Or full refund' },
                  { icon: <RotateCcw size={18} />,    label: 'Easy Returns', sub: 'Within 24 hours' },
                ].map(g => (
                  <div key={g.label} className="flex flex-col items-center text-center gap-1">
                    <div className="text-primary">{g.icon}</div>
                    <p className="text-xs font-semibold text-text">{g.label}</p>
                    <p className="text-2xs text-text-muted">{g.sub}</p>
                  </div>
                ))}
              </div>

              {/* Compare Prices */}
              {otherSellers.length > 1 && (
                <div className="bg-white rounded-2xl shadow-card border border-border-light p-5 mt-4">
                  <h3 className="font-semibold text-text flex items-center gap-2 mb-3 text-sm">
                    ⚖️ Compare Prices
                  </h3>
                  <div className="table-wrapper max-h-48 overflow-y-auto scrollbar-hide">
                    <table className="table-base text-2xs">
                      <thead>
                        <tr>
                          <th>Farmer Name</th>
                          <th>Harvest</th>
                          <th>Freshness</th>
                          <th>Price</th>
                          <th>Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {otherSellers.map(s => {
                          const fStatus = getFreshnessStatus(s.harvestDate)
                          return (
                            <tr key={s.id} className={s.id === product.id ? 'bg-primary-50/50 font-medium' : ''}>
                              <td>
                                <div className="flex items-center gap-1">
                                  <span className="font-bold text-text truncate max-w-[80px]">{s.farmer}</span>
                                  {s.id === product.id && <span className="bg-primary text-white text-[8px] px-1 rounded font-bold">You</span>}
                                </div>
                              </td>
                              <td>{new Date(s.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                              <td>
                                <span className={`text-[9px] font-bold px-1.5 py-0.25 rounded-md border ${fStatus.bgColor} ${fStatus.textColor} ${fStatus.color}`}>
                                  {fStatus.label}
                                </span>
                              </td>
                              <td className="font-bold text-primary">₹{s.price}/{s.unit}</td>
                              <td>
                                {s.id !== product.id ? (
                                  <Link to={`/product/${s.id}`} className="text-primary hover:underline font-semibold">
                                    View →
                                  </Link>
                                ) : (
                                  <span className="text-text-muted">Viewing</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Request Bulk Order */}
              {product.bulkAvailable && (
                <div className="bg-white rounded-2xl shadow-card border border-border-light p-5 mt-4">
                  <h3 className="font-semibold text-text flex items-center gap-2 mb-2 text-sm">
                    📦 Request Bulk Order
                  </h3>
                  <p className="text-2xs text-text-secondary mb-4">Interested in bulk quantities? Submit a request to the farmer directly.</p>

                  {bulkSuccess ? (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs">
                      {bulkSuccess}
                      <button onClick={() => setBulkSuccess('')} className="block mt-2 text-2xs text-green-600 underline">Send another request</button>
                    </div>
                  ) : (
                    <form onSubmit={handleBulkSubmit} className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-semibold text-text-secondary mb-1 block">Your Name *</label>
                          <input value={bulkForm.name} onChange={e => setBulkForm(f => ({ ...f, name: e.target.value }))}
                            className="input-base text-2xs py-1.5 px-3" placeholder="Enter name" required />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-text-secondary mb-1 block">Phone Number *</label>
                          <input value={bulkForm.phone} onChange={e => setBulkForm(f => ({ ...f, phone: e.target.value }))}
                            className="input-base text-2xs py-1.5 px-3" placeholder="Enter phone" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-semibold text-text-secondary mb-1 block">Quantity ({product.unit}) *</label>
                          <input type="number" min="1" value={bulkForm.qty} onChange={e => setBulkForm(f => ({ ...f, qty: e.target.value }))}
                            className="input-base text-2xs py-1.5 px-3" placeholder={`Min 1 ${product.unit}`} required />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-text-secondary mb-1 block">Preferred Date *</label>
                          <input type="date" value={bulkForm.deliveryDate} onChange={e => setBulkForm(f => ({ ...f, deliveryDate: e.target.value }))}
                            className="input-base text-2xs py-1.5 px-3" required />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-semibold text-text-secondary mb-1 block">Message</label>
                        <textarea value={bulkForm.message} onChange={e => setBulkForm(f => ({ ...f, message: e.target.value }))}
                          className="input-base text-2xs py-1.5 px-3 resize-none" rows="2" placeholder="Any details..." />
                      </div>

                      <button type="submit" disabled={bulkLoading} className="btn-md btn-primary rounded-xl text-2xs justify-center font-bold">
                        {bulkLoading ? 'Submitting...' : 'Submit Request'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-card border border-border-light overflow-hidden mb-12">
            <div className="flex border-b border-border-light">
              {[['desc', 'Description'], ['reviews', 'Reviews'], ['shipping', 'Shipping']].map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)}
                  className={`px-6 py-4 text-sm font-semibold transition-colors
                    ${tab === k ? 'text-primary border-b-2 border-primary bg-primary-50' : 'text-text-secondary hover:text-primary'}`}>
                  {l}
                </button>
              ))}
            </div>
            <div className="p-6">
              {tab === 'desc' && <p className="text-text-secondary leading-relaxed">{product.description} Our products are harvested with care and delivered within 24 hours of picking to ensure maximum freshness and nutritional value.</p>}
              {tab === 'reviews' && (
                <div className="flex flex-col gap-5">
                  {reviews.map((r, i) => (
                    <div key={i} className="flex gap-4 pb-5 border-b border-border-light last:border-0">
                      <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-sm text-text">{r.name}</p>
                          <div className="flex">{[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= r.rating ? '#FBBF24' : 'none'} className={s <= r.rating ? 'text-yellow-400' : 'text-gray-200'} />)}</div>
                          <span className="text-2xs text-text-muted">{r.date}</span>
                        </div>
                        <p className="text-sm text-text-secondary">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'shipping' && (
                <div className="flex flex-col gap-3 text-sm text-text-secondary">
                  <p>🚚 <strong>Free delivery</strong> on orders above ₹199</p>
                  <p>⏰ <strong>Same-day delivery</strong> for orders placed before 6 PM</p>
                  <p>📦 <strong>Cold-chain packaging</strong> maintains freshness during transit</p>
                  <p>↩️ <strong>Easy returns</strong> within 24 hours if not satisfied</p>
                </div>
              )}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-text mb-6">Related Products</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {related.map(p => <ProductCard key={p.id} product={p} onAddToCart={() => {}} />)}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
