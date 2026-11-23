import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Eye, EyeOff, ArrowRight, ArrowLeft, Check } from 'lucide-react'

const STEPS = ['Choose Role', 'Your Details', 'Confirm']

export default function Register() {
  const [step, setStep] = useState(0)
  const [role, setRole] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', farmName:'', farmLocation:'', cropTypes:'' })
  const navigate = useNavigate()
  const set = (k,v) => setForm(f => ({...f,[k]:v}))

  const handleFinish = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1600))
    setLoading(false)
    navigate(role === 'farmer' ? '/farmer' : role === 'delivery' ? '/delivery' : '/customer')
  }

  return (
    <div className="min-h-screen bg-bg-section flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
          <Leaf size={20} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <span className="font-display font-bold text-xl text-primary-700">Green</span>
          <span className="font-display font-bold text-xl text-leaf">Basket</span>
        </div>
      </Link>

      {/* Progress steps */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300
              ${i <= step ? 'bg-primary text-white' : 'bg-white border border-border text-text-muted'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${i < step ? 'bg-white/20' : ''}`}>
                {i < step ? <Check size={13} /> : i+1}
              </div>
              <span className="text-xs font-semibold hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length-1 && (
              <div className={`w-8 h-0.5 mx-1 transition-colors duration-300 ${i < step ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
          transition={{ duration:0.35, ease:[0.23,1,0.32,1] }}
          className={`w-full ${step === 0 ? 'max-w-4xl' : 'max-w-lg'} bg-white rounded-3xl shadow-float border border-border-light p-8`}
        >
          {/* STEP 0 — Role */}
          {step === 0 && (
            <div>
              <h1 className="font-display text-3xl font-bold text-text mb-2">Join GreenBasket 🌿</h1>
              <p className="text-text-secondary mb-8">Choose how you want to use the platform</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { value:'customer', emoji:'🛒', title:"I'm a Customer", desc:'Shop fresh produce from local farms delivered to my door.', perks:['AI personalized picks','24h delivery','Freshness guarantee'] },
                  { value:'farmer',   emoji:'🌾', title:"I'm a Farmer",   desc:'Sell directly to customers with full control over my pricing.', perks:['No middlemen','Free analytics','Fast payments'] },
                  { value:'delivery', emoji:'🚚', title:"I'm a Delivery Partner", desc:'Deliver fresh orders and earn on a flexible schedule.', perks:['Flexible hours','Weekly payouts','Route support'] },
                ].map(r => (
                  <button key={r.value} onClick={() => setRole(r.value)}
                    className={`relative flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-200
                      ${role === r.value ? 'border-primary bg-primary-50 shadow-card' : 'border-border hover:border-primary-300 hover:bg-primary-50/50'}`}
                  >
                    {role === r.value && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check size={13} className="text-white" />
                      </div>
                    )}
                    <span className="text-4xl mb-3">{r.emoji}</span>
                    <h3 className="font-display font-bold text-base text-text mb-1.5">{r.title}</h3>
                    <p className="text-text-muted text-xs mb-3 leading-relaxed">{r.desc}</p>
                    <ul className="flex flex-col gap-1">
                      {r.perks.map(p => <li key={p} className="text-2xs text-primary-600 font-medium flex items-center gap-1"><Check size={10}/>  {p}</li>)}
                    </ul>
                  </button>
                ))}
              </div>
              <button onClick={() => role && setStep(1)} disabled={!role}
                className="btn-lg btn-primary rounded-2xl w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                Continue as {role ? ({ customer:'Customer 🛒', farmer:'Farmer 🌾', delivery:'Delivery Partner 🚚' }[role]) : '...'}
              </button>
              <p className="text-center text-sm text-text-secondary mt-5">
                Already have an account?{' '}<Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          )}

          {/* STEP 1 — Details */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-text mb-1">
                {role === 'farmer' ? '🌾 Farm Details' : role === 'delivery' ? '🚚 Delivery Partner Details' : '🛒 Create Account'}
              </h2>
              <p className="text-text-secondary text-sm mb-6">Fill in your details to get started</p>
              <form onSubmit={e => { e.preventDefault(); setStep(2) }} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input id="name" type="text" value={form.name} onChange={e => set('name',e.target.value)}
                      placeholder="Your full name" className="input-base" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input id="phone" type="tel" value={form.phone} onChange={e => set('phone',e.target.value)}
                      placeholder="+91 98765 43210" className="input-base" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="reg-email" className="form-label">Email Address</label>
                  <input id="reg-email" type="email" value={form.email} onChange={e => set('email',e.target.value)}
                    placeholder="you@example.com" className="input-base" required />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-pw" className="form-label">Password</label>
                  <div className="relative">
                    <input id="reg-pw" type={showPw?'text':'password'} value={form.password}
                      onChange={e => set('password',e.target.value)}
                      placeholder="Min 8 characters" className="input-base pr-12" minLength={8} required />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1">
                      {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                  </div>
                </div>

                {role === 'farmer' && (
                  <>
                    <div className="separator my-1" />
                    <p className="text-sm font-semibold text-text-secondary">Farm Information</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group">
                        <label htmlFor="farmName" className="form-label">Farm Name</label>
                        <input id="farmName" type="text" value={form.farmName} onChange={e => set('farmName',e.target.value)}
                          placeholder="Green Valley Farm" className="input-base" required />
                      </div>
                      <div className="form-group">
                        <label htmlFor="farmLoc" className="form-label">Location</label>
                        <input id="farmLoc" type="text" value={form.farmLocation} onChange={e => set('farmLocation',e.target.value)}
                          placeholder="Nashik, MH" className="input-base" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="crops" className="form-label">Primary Crops</label>
                      <input id="crops" type="text" value={form.cropTypes} onChange={e => set('cropTypes',e.target.value)}
                        placeholder="Tomatoes, Onions, Peppers..." className="input-base" />
                    </div>
                  </>
                )}

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(0)}
                    className="btn-md btn-secondary rounded-xl flex items-center gap-2">
                    <ArrowLeft size={16}/> Back
                  </button>
                  <button type="submit" className="btn-md btn-primary rounded-xl flex-1 justify-center">
                    Continue <ArrowRight size={16}/>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2 — Confirm */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-text mb-1">Almost there! 🎉</h2>
              <p className="text-text-secondary text-sm mb-6">Review your details before creating your account</p>

              <div className="bg-bg-section rounded-2xl border border-border-light overflow-hidden mb-6">
                {[
                  { label:'Role',     value: ({ customer:'🛒 Customer', farmer:'🌾 Farmer', delivery:'🚚 Delivery Partner' }[role]) },
                  { label:'Name',     value: form.name    || '—' },
                  { label:'Email',    value: form.email   || '—' },
                  { label:'Phone',    value: form.phone   || '—' },
                  ...(role === 'farmer' && form.farmName ? [{ label:'Farm', value: form.farmName }] : []),
                  ...(role === 'farmer' && form.farmLocation ? [{ label:'Location', value: form.farmLocation }] : []),
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center px-5 py-3 border-b border-border-light last:border-0">
                    <span className="text-sm text-text-muted font-medium">{r.label}</span>
                    <span className="text-sm font-semibold text-text">{r.value}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-text-muted mb-6 text-center">
                By creating an account, you agree to our{' '}
                <Link to="#" className="text-primary underline">Terms</Link> and{' '}
                <Link to="#" className="text-primary underline">Privacy Policy</Link>.
              </p>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-md btn-secondary rounded-xl flex items-center gap-2">
                  <ArrowLeft size={16}/> Back
                </button>
                <motion.button onClick={handleFinish} disabled={loading}
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                  className="btn-md btn-primary rounded-xl flex-1 justify-center disabled:opacity-70">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Creating...</>
                    : <>Create Account 🚀</>}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
