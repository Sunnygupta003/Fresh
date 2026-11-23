import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, CreditCard, CheckCircle, ArrowRight } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { useOrderStore } from '../../stores/orderStore'

const PAYMENT_METHODS = [
  { id:'upi',  label:'UPI / Google Pay / PhonePe', icon:'📱' },
  { id:'card', label:'Credit / Debit Card',          icon:'💳' },
  { id:'net',  label:'Net Banking',                  icon:'🏦' },
  { id:'cod',  label:'Cash on Delivery',             icon:'💵' },
]

export default function Checkout() {
  const [step, setStep]     = useState(0)
  const [payment, setPayment] = useState('upi')
  const [placed, setPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [addr, setAddr] = useState({ name:'', phone:'', line1:'', city:'', state:'', pin:'' })
  const setA = (k,v) => setAddr(a=>({...a,[k]:v}))

  const placeOrder = useOrderStore(state => state.placeOrder)

  const handleOrder = async () => {
    setLoading(true)
    await new Promise(r=>setTimeout(r,1800))
    setLoading(false)
    const newOrderId = placeOrder({
      total: 618,
      items: [{ name: 'Assorted Fresh Produce', qty: 3, price: 618 }],
      address: `${addr.line1 || '123 Green Ave'}, ${addr.city || 'Mumbai'}`,
    })
    setPlaced(newOrderId)
  }

  if (placed) return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
        transition={{type:'spring',stiffness:300,damping:22}}
        className="bg-white rounded-3xl shadow-float border border-border-light p-12 text-center max-w-md w-full"
      >
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2,type:'spring',stiffness:400,damping:18}}
          className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 text-5xl shadow-glow">
          🎉
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-text mb-3">Order Placed!</h2>
        <p className="text-text-secondary mb-2">Your order <span className="font-bold text-primary">#{placed}</span> has been confirmed.</p>
        <p className="text-text-muted text-sm mb-8">Expected delivery: <strong>Tomorrow by 9 AM</strong></p>
        <div className="flex flex-col gap-3">
          <Link to="/customer/orders" className="btn-lg btn-primary rounded-2xl w-full justify-center">Track My Order</Link>
          <Link to="/marketplace" className="btn-lg btn-secondary rounded-2xl w-full justify-center">Continue Shopping</Link>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="pt-20">
        <div className="section-wrapper py-10">
          <h1 className="font-display text-3xl font-bold text-text mb-8">Checkout</h1>

          {/* Step tabs */}
          <div className="flex gap-0 mb-8">
            {['Delivery Address','Payment','Review'].map((s,i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all
                  ${i<=step?'bg-primary text-white':'bg-white border border-border text-text-muted'}`}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs bg-white/20 font-bold">{i+1}</span>
                  <span className="hidden sm:block">{s}</span>
                </div>
                {i<2 && <div className={`w-8 h-0.5 mx-1 ${i<step?'bg-primary':'bg-border'}`}/>}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step===0 && (
                  <motion.div key="addr" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                    className="bg-white rounded-2xl shadow-card border border-border-light p-6">
                    <h2 className="font-semibold text-text text-lg mb-5 flex items-center gap-2"><MapPin size={20} className="text-primary"/>Delivery Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id:'name', label:'Full Name', placeholder:'Priya Sharma', col:1 },
                        { id:'phone', label:'Phone', placeholder:'+91 98765 43210', col:1 },
                        { id:'line1', label:'Address Line', placeholder:'123, Flat/House/Street', col:2 },
                        { id:'city',  label:'City', placeholder:'Mumbai', col:1 },
                        { id:'state', label:'State', placeholder:'Maharashtra', col:1 },
                        { id:'pin',   label:'PIN Code', placeholder:'400001', col:1 },
                      ].map(f => (
                        <div key={f.id} className={`form-group ${f.col===2?'col-span-2':''}`}>
                          <label htmlFor={f.id} className="form-label">{f.label}</label>
                          <input id={f.id} value={addr[f.id]} onChange={e=>setA(f.id,e.target.value)}
                            placeholder={f.placeholder} className="input-base" />
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>setStep(1)}
                      className="btn-lg btn-primary rounded-xl mt-6 w-full justify-center">
                      Continue to Payment <ArrowRight size={18}/>
                    </button>
                  </motion.div>
                )}

                {step===1 && (
                  <motion.div key="pay" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                    className="bg-white rounded-2xl shadow-card border border-border-light p-6">
                    <h2 className="font-semibold text-text text-lg mb-5 flex items-center gap-2"><CreditCard size={20} className="text-primary"/>Payment Method</h2>
                    <div className="flex flex-col gap-3 mb-6">
                      {PAYMENT_METHODS.map(m => (
                        <label key={m.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                            ${payment===m.id?'border-primary bg-primary-50':'border-border hover:border-primary-300'}`}>
                          <input type="radio" name="payment" value={m.id} checked={payment===m.id} onChange={()=>setPayment(m.id)} className="accent-primary" />
                          <span className="text-2xl">{m.icon}</span>
                          <span className="font-medium text-text">{m.label}</span>
                          {payment===m.id && <CheckCircle size={18} className="text-primary ml-auto"/>}
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={()=>setStep(0)} className="btn-md btn-secondary rounded-xl">← Back</button>
                      <button onClick={()=>setStep(2)} className="btn-lg btn-primary rounded-xl flex-1 justify-center">Review Order <ArrowRight size={16}/></button>
                    </div>
                  </motion.div>
                )}

                {step===2 && (
                  <motion.div key="review" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                    className="bg-white rounded-2xl shadow-card border border-border-light p-6">
                    <h2 className="font-semibold text-text text-lg mb-5">📋 Order Review</h2>
                    <div className="bg-bg-section rounded-xl p-4 mb-4">
                      <p className="text-sm font-semibold text-text-secondary mb-2">Delivery Address</p>
                      <p className="text-sm text-text">{addr.name||'Priya Sharma'} · {addr.phone||'+91 98765 43210'}</p>
                      <p className="text-sm text-text-muted">{addr.line1||'123 Green Ave'}, {addr.city||'Mumbai'} - {addr.pin||'400001'}</p>
                    </div>
                    <div className="bg-bg-section rounded-xl p-4 mb-6">
                      <p className="text-sm font-semibold text-text-secondary mb-2">Payment</p>
                      <p className="text-sm text-text">{PAYMENT_METHODS.find(m=>m.id===payment)?.label}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={()=>setStep(1)} className="btn-md btn-secondary rounded-xl">← Back</button>
                      <motion.button onClick={handleOrder} disabled={loading} whileHover={{scale:1.02}} whileTap={{scale:0.97}}
                        className="btn-lg btn-primary rounded-xl flex-1 justify-center disabled:opacity-70">
                        {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Placing...</> : '🚀 Place Order'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Summary panel */}
            <div className="bg-white rounded-2xl shadow-card border border-border-light p-5 h-fit sticky top-24">
              <h3 className="font-semibold text-text mb-4">Order Summary</h3>
              <div className="flex flex-col gap-3 text-sm mb-4">
                <div className="flex justify-between"><span className="text-text-secondary">Subtotal (3 items)</span><span>₹618</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Delivery</span><span className="text-green-600 font-medium">FREE</span></div>
                <div className="separator" />
                <div className="flex justify-between font-bold text-lg text-text"><span>Total</span><span className="text-primary">₹618</span></div>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted bg-primary-50 rounded-xl p-3">
                <span>🌿</span><span>All items are fresh and farm-certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
