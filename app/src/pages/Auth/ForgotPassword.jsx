import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-bg-section flex items-center justify-center px-4">
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6, ease:[0.23,1,0.32,1] }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <Leaf size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-xl text-primary-700">GreenBasket</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-float border border-border-light p-8 text-center">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                <div className="w-16 h-16 bg-primary-50 border-2 border-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🔑</div>
                <h1 className="font-display text-2xl font-bold text-text mb-2">Forgot Password?</h1>
                <p className="text-text-secondary text-sm leading-relaxed mb-8">
                  No worries! Enter your email and we'll send you a secure reset link.
                </p>

                <form onSubmit={handleSubmit} className="text-left flex flex-col gap-4">
                  <div className="form-group">
                    <label htmlFor="fp-email" className="form-label">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input id="fp-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com" className="input-base pl-10" required />
                    </div>
                  </div>

                  <motion.button type="submit" disabled={loading || !email}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                    className="btn-lg btn-primary rounded-2xl w-full justify-center disabled:opacity-60">
                    {loading
                      ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                      : 'Send Reset Link'}
                  </motion.button>
                </form>

                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary mt-6 transition-colors">
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </motion.div>
            ) : (
              <motion.div key="success"
                initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                transition={{ type:'spring', stiffness:300, damping:20 }}>
                <motion.div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-glow"
                  initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ type:'spring', stiffness:400, damping:18, delay:0.1 }}>
                  ✅
                </motion.div>
                <h2 className="font-display text-2xl font-bold text-text mb-3">Check your inbox!</h2>
                <p className="text-text-secondary text-sm leading-relaxed mb-2">
                  We sent a password reset link to
                </p>
                <p className="font-semibold text-primary mb-6">{email}</p>
                <p className="text-xs text-text-muted mb-6">
                  Didn't receive it? Check spam folder or{' '}
                  <button onClick={() => setSent(false)} className="text-primary underline font-medium">try again</button>.
                </p>
                <Link to="/login" className="btn-md btn-primary rounded-xl w-full justify-center inline-flex">
                  Back to Sign In
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
