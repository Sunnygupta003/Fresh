import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, User, Search, Menu, X, ChevronDown, Leaf } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'Shop',       href: '/marketplace' },
  { label: 'Categories', href: '/marketplace?cat=all' },
  { label: 'About Us',   href: '/#about' },
  { label: 'How It Works', href: '/#how' },
  { label: 'Contact',    href: '/contact' },
]

export default function Navbar({ cartCount = 0 }) {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ]       = useState('')
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? 'bg-white shadow-md py-2'
            : 'bg-white/80 backdrop-blur-md py-3'}`}
      >
        <div className="section-wrapper flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md">
              <Leaf size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <span className="font-display font-800 text-lg text-primary-700 tracking-tight">Green</span>
              <span className="font-display font-800 text-lg text-leaf tracking-tight">Basket</span>
              <p className="text-2xs text-text-muted -mt-0.5">Fresh. Live Well.</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(link => {
              const active = location.pathname === link.href
              const isHash = link.href.includes('#')
              const className = `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${active
                  ? 'text-primary font-semibold bg-primary-50'
                  : 'text-text-secondary hover:text-primary hover:bg-primary-50'}`
                  
              return isHash ? (
                <a key={link.label} href={link.href} className={className}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} to={link.href} className={className}>
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <AnimatePresence>
              {searchOpen ? (
                <motion.div
                  key="search-bar"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden md:flex items-center gap-2 bg-bg rounded-xl border border-border px-3 py-2"
                >
                  <Search size={16} className="text-text-muted flex-shrink-0" />
                  <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search products…" className="bg-transparent text-sm outline-none w-full text-text" />
                  <button onClick={() => { setSearchOpen(false); setSearchQ('') }}>
                    <X size={14} className="text-text-muted hover:text-danger" />
                  </button>
                </motion.div>
              ) : (
                <button key="search-btn" onClick={() => setSearchOpen(true)}
                  className="btn-icon hidden md:flex" aria-label="Search">
                  <Search size={20} />
                </button>
              )}
            </AnimatePresence>

            {/* Wishlist */}
            <Link to="/customer/wishlist" className="btn-icon hidden md:flex" aria-label="Wishlist">
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative btn-icon" aria-label={`Cart, ${cartCount} items`}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-2xs
                  font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-2 ml-1">
              <Link to="/login"    className="btn-sm btn-secondary rounded-xl text-sm px-4 py-2">Sign In</Link>
              <Link to="/register" className="btn-sm btn-primary  rounded-xl text-sm px-4 py-2">Get Started</Link>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden btn-icon ml-1" aria-label="Toggle menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Green bottom line */}
        <div className={`h-0.5 bg-gradient-to-r from-primary via-leaf to-primary-300
          transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[64px] left-0 right-0 z-40 bg-white border-b border-border shadow-lg lg:hidden"
          >
            <nav className="section-wrapper py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => {
                const isHash = link.href.includes('#')
                const className = "px-4 py-3 rounded-xl text-text-secondary hover:bg-primary-50 hover:text-primary font-medium transition-colors"
                
                return isHash ? (
                  <a key={link.label} href={link.href} className={className} onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} to={link.href} className={className} onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                )
              })}
              <div className="flex gap-3 mt-3 pt-3 border-t border-border">
                <Link to="/login"    className="flex-1 btn-md btn-secondary text-center rounded-xl">Sign In</Link>
                <Link to="/register" className="flex-1 btn-md btn-primary  text-center rounded-xl">Get Started</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
