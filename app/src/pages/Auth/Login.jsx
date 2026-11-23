import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Leaf, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { useAuthStore } from '../../stores/authStore'

export default function Login() {
  const [form, setForm]     = useState({ email:'', password:'', role:'customer' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState('')
  const navigate = useNavigate()
  const loginWithGoogle = useAuthStore(state => state.loginWithGoogle)

  const set = (k,v) => setForm(f => ({...f, [k]:v}))

  const navigateByRole = (role) => {
    if (role === 'farmer') navigate('/farmer')
    else if (role === 'delivery') navigate('/delivery')
    else navigate('/customer')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    navigateByRole(form.role)
  }

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true)
        setGoogleError('')

        // Get user info from Google using the access token
        const googleUserInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        )

        const { sub: googleId, name, email, picture } = googleUserInfo.data

        // Send to our backend to register/login the user
        const res = await axios.post('http://localhost:3001/api/auth/google', {
          credential: btoa(JSON.stringify({ header: 'h' })) + '.' +
                      btoa(JSON.stringify({ sub: googleId, name, email, picture })) + '.' +
                      'sig',
          role: form.role,
        })

        if (res.data.success) {
          loginWithGoogle(res.data.user)
          navigateByRole(res.data.user.role)
        } else {
          setGoogleError(res.data.error || 'Login failed. Please try again.')
        }
      } catch (err) {
        console.error('Google login error:', err)
        setGoogleError(
          err.response?.data?.error || 'Google sign-in failed. Please try again.'
        )
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error)
      setGoogleError('Google sign-in was cancelled or failed. Please try again.')
      setGoogleLoading(false)
    },
  })

  const handleGoogleClick = () => {
    setGoogleError('')
    setGoogleLoading(true)
    googleLogin()
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — Visual */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-primary-800 p-12">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1506617420156-8e4536971650?w=900&q=80"
            alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-primary-700/80" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Leaf size={22} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-xl text-white">GreenBasket</span>
          </Link>
        </div>

        <div className="relative z-10">
          <div className="text-6xl mb-6">🌿</div>
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Fresh from farms.<br/>Delivered with love.
          </h2>
          <p className="text-primary-200 text-lg leading-relaxed mb-8">
            Join 10,000+ families who switched to fresh, organic produce delivered straight from local farmers.
          </p>
          <div className="flex flex-col gap-3">
            {['✓ 100% certified organic produce','✓ Farm-to-door in under 24 hours','✓ 50+ verified local farmers'].map(t => (
              <div key={t} className="flex items-center gap-3 text-primary-100 font-medium">{t}</div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[['10K+','Happy Customers'],['500+','Fresh Products'],['99%','Satisfaction']].map(([n,l]) => (
            <div key={l} className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/10">
              <p className="font-display font-bold text-2xl text-white">{n}</p>
              <p className="text-primary-300 text-xs mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-white">
        <motion.div className="max-w-md w-full mx-auto"
          initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, ease:[0.23,1,0.32,1] }}>

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Leaf size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg text-primary-700">GreenBasket</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-text mb-2">Welcome back 👋</h1>
          <p className="text-text-secondary mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Sign up free</Link>
          </p>

          {/* Role selection */}
          <div className="mb-6">
            <p className="form-label mb-3">Login as</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value:'customer', label:'Customer', emoji:'🛒' },
                { value:'farmer',   label:'Farmer',   emoji:'🌾' },
                { value:'delivery', label:'Delivery',  emoji:'🚚' },
              ].map(r => (
                <button key={r.value} type="button" onClick={() => set('role', r.value)}
                  className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 transition-all duration-200 font-medium text-sm
                    ${form.role === r.value
                      ? 'border-primary bg-primary-50 text-primary'
                      : 'border-border text-text-secondary hover:border-primary-300 hover:bg-primary-50'}`}
                >
                  <span className="text-2xl">{r.emoji}</span>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Google OAuth */}
          <button type="button" onClick={handleGoogleClick} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border
              rounded-xl bg-white hover:bg-gray-50 transition-colors mb-2 font-medium text-text shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
            {googleLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.77h5.4c-.23 1.24-.95 2.29-2.03 3v2.5h3.27c1.92-1.77 3.02-4.38 3.02-7.27z" fill="#4285F4"/>
                  <path d="M10 20c2.7 0 4.97-.9 6.62-2.43l-3.27-2.5c-.9.6-2.06.96-3.35.96-2.57 0-4.74-1.73-5.51-4.06H1.1v2.58C2.74 17.78 6.13 20 10 20z" fill="#34A853"/>
                  <path d="M4.49 11.97A5.96 5.96 0 0 1 4.18 10c0-.69.12-1.36.31-1.97V5.45H1.1A9.97 9.97 0 0 0 0 10c0 1.61.39 3.14 1.1 4.55l3.39-2.58z" fill="#FBBC05"/>
                  <path d="M10 3.97c1.45 0 2.74.5 3.76 1.47l2.82-2.82C14.96.9 12.7 0 10 0 6.13 0 2.74 2.22 1.1 5.45l3.39 2.58C5.26 5.7 7.43 3.97 10 3.97z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Google error message */}
          {googleError && (
            <p className="text-red-500 text-sm text-center mb-3">{googleError}</p>
          )}

          <div className={`divider-text ${googleError ? 'mb-5' : 'mb-5 mt-3'}`}>or sign in with email</div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input id="email" type="email" value={form.email} onChange={e => set('email',e.target.value)}
                placeholder="you@example.com" className="input-base" required />
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="form-label">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <input id="password" type={showPw?'text':'password'} value={form.password}
                  onChange={e => set('password',e.target.value)}
                  placeholder="Enter your password" className="input-base pr-12" required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
              <span className="text-sm text-text-secondary">Remember me for 30 days</span>
            </label>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              className="btn-lg btn-primary rounded-2xl w-full justify-center mt-2 disabled:opacity-70">
              {loading
                ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                : <>Sign In <ArrowRight size={18} /></>}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

