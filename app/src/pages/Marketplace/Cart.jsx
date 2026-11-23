import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { products } from '../../data/mockData'

const INITIAL_CART = [
  { ...products[0], qty:2 },
  { ...products[2], qty:1 },
  { ...products[4], qty:1 },
]

export default function Cart() {
  const [items, setItems]   = useState(INITIAL_CART)
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState('')

  const update = (id, delta) => setItems(items.map(i => i.id===id ? {...i,qty:Math.max(1,i.qty+delta)} : i))
  const remove = (id) => setItems(items.filter(i => i.id!==id))

  const applyCoupon = () => {
    if (coupon.toUpperCase()==='FRESH20') { setDiscount(20); setCouponMsg('✅ 20% discount applied!') }
    else { setDiscount(0); setCouponMsg('❌ Invalid coupon code') }
  }

  const subtotal  = items.reduce((s,i) => s+i.price*i.qty, 0)
  const delivery  = subtotal >= 199 ? 0 : 29
  const discAmt   = Math.round(subtotal * discount / 100)
  const total     = subtotal + delivery - discAmt

  return (
    <div className="min-h-screen bg-bg">
      <Navbar cartCount={items.reduce((s,i)=>s+i.qty,0)} />
      <div className="pt-20">
        <div className="section-wrapper py-10">
          <h1 className="font-display text-3xl font-bold text-text mb-8">Your Cart 🛒</h1>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag size={64} className="text-primary-200 mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-text mb-2">Your cart is empty</h2>
              <p className="text-text-secondary mb-6">Add some fresh produce to get started!</p>
              <Link to="/marketplace" className="btn-lg btn-primary rounded-2xl">Browse Products</Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {items.map(item => (
                  <motion.div key={item.id} layout exit={{opacity:0,x:-30}}
                    className="bg-white rounded-2xl border border-border-light shadow-card p-4 flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-primary-500 font-semibold">{item.category}</p>
                      <h3 className="font-semibold text-text truncate">{item.name}</h3>
                      <p className="text-sm text-text-muted">{item.farmer} · {item.location}</p>
                      {item.organic && <span className="badge-organic text-2xs mt-1 inline-block">🌿 Organic</span>}
                    </div>
                    <div className="flex items-center border border-border rounded-xl">
                      <button onClick={()=>update(item.id,-1)} className="px-3 py-2 hover:bg-primary-50 text-text transition-colors"><Minus size={14}/></button>
                      <span className="px-3 font-bold text-text">{item.qty}</span>
                      <button onClick={()=>update(item.id,+1)} className="px-3 py-2 hover:bg-primary-50 text-text transition-colors"><Plus size={14}/></button>
                    </div>
                    <div className="text-right min-w-[70px]">
                      <p className="font-bold text-primary text-lg">₹{item.price*item.qty}</p>
                      <p className="text-2xs text-text-muted">₹{item.price}/{item.unit}</p>
                    </div>
                    <button onClick={()=>remove(item.id)} className="p-2 text-text-muted hover:text-danger hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={16}/>
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="flex flex-col gap-4">
                {/* Coupon */}
                <div className="bg-white rounded-2xl shadow-card border border-border-light p-5">
                  <h3 className="font-semibold text-text flex items-center gap-2 mb-4"><Tag size={18} className="text-primary"/>Coupon Code</h3>
                  <div className="flex gap-2">
                    <input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="e.g. FRESH20"
                      className="input-base text-sm flex-1" />
                    <button onClick={applyCoupon} className="btn-md btn-primary rounded-xl text-sm">Apply</button>
                  </div>
                  {couponMsg && <p className="text-xs mt-2 text-text-secondary">{couponMsg}</p>}
                  <p className="text-2xs text-text-muted mt-2">Try: <span className="font-mono bg-primary-50 text-primary px-1 rounded">FRESH20</span></p>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-card border border-border-light p-5">
                  <h3 className="font-semibold text-text mb-4">Order Summary</h3>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between"><span className="text-text-secondary">Subtotal ({items.length} items)</span><span className="font-medium">₹{subtotal}</span></div>
                    <div className="flex justify-between"><span className="text-text-secondary">Delivery charges</span><span className={delivery===0?'text-green-600 font-medium':'font-medium'}>{delivery===0?'FREE':'₹'+delivery}</span></div>
                    {discAmt > 0 && <div className="flex justify-between text-green-600"><span>Coupon ({discount}% off)</span><span>-₹{discAmt}</span></div>}
                    <div className="separator my-1" />
                    <div className="flex justify-between text-lg font-bold text-text"><span>Total</span><span className="text-primary">₹{total}</span></div>
                  </div>
                  {delivery > 0 && <p className="text-xs text-primary-600 mt-3 bg-primary-50 rounded-lg px-3 py-2">Add ₹{199-subtotal} more for FREE delivery</p>}
                  <Link to="/checkout">
                    <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                      className="btn-lg btn-primary rounded-2xl w-full justify-center mt-5">
                      Proceed to Checkout <ArrowRight size={18}/>
                    </motion.button>
                  </Link>
                  <Link to="/marketplace" className="block text-center text-sm text-primary hover:underline mt-3">← Continue Shopping</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
