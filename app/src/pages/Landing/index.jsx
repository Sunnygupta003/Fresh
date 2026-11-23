import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import {
  ShoppingCart, ArrowRight, Check, Star, ChevronDown, ChevronUp,
  Truck, Shield, Leaf, Clock, Award, Users, Package, TrendingUp, MapPin, Phone
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import ProductCard from '../../components/shared/ProductCard'
import { categories, testimonials, stats, faqs } from '../../data/mockData'
import freshProduceHero from '../../assets/fresh-produce-hero-v2.png'
import { useProductStore } from '../../stores/productStore'
import { getFreshProducts } from '../../utils/freshness'
import { getSeasonalProducts, getCurrentSeason, getSeasonMeta } from '../../utils/seasonalData'

/* ── Animated counter ── */
function Counter({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 25)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>
}

/* ── Orbit items for hero ── */
const ORBIT_ITEMS = [
  { name:'Tomato',   emoji:'🍅', image:'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=180&q=85' },
  { name:'Avocado',  emoji:'🥑', image:'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=180&q=85' },
  { name:'Broccoli', emoji:'🥦', image:'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=180&q=85' },
  { name:'Carrot',   emoji:'🥕', image:'https://images.unsplash.com/photo-1447175008436-170170753aa9?w=180&q=85' },
  { name:'Apple',    emoji:'🍎', image:'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=180&q=85' },
  { name:'Mango',    emoji:'🥭', image:'https://images.unsplash.com/photo-1553279768-865429fa0078?w=180&q=85' },
  { name:'Onion',    emoji:'🧅', image:'https://images.unsplash.com/photo-1508747703725-719777637510?w=180&q=85' },
]

/* ── Section wrapper helper ── */
function Sec({ children, className = '', id = '' }) {
  return (
    <section id={id} className={`section ${className}`}>
      <div className="section-wrapper">{children}</div>
    </section>
  )
}

export default function LandingPage() {
  const products = useProductStore(state => state.products)
  const [cart, setCart]           = useState([])
  const [wishlist, setWishlist]   = useState([])
  const [activeFAQ, setActiveFAQ] = useState(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -80])

  const addToCart = (p) => setCart(c => {
    const ex = c.find(x => x.id === p.id)
    return ex ? c.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x) : [...c, { ...p, qty: 1 }]
  })
  const toggleWish = (id) => setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id])

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  /* ── Section fade-in variant ── */
  const fadeUp = {
    hidden:  { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.23,1,0.32,1] } },
  }
  const stagger = {
    visible: { transition: { staggerChildren: 0.12 } },
  }

  return (
    <div className="min-h-screen bg-bg">
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar cartCount={cart.reduce((s, i) => s + i.qty, 0)} />

      <main id="main">
        {/* ══════════════ HERO ══════════════ */}
        <section className="relative min-h-screen bg-hero-gradient overflow-hidden flex items-center pt-20">
          {/* Decorative blobs */}
          <div className="absolute top-10 right-0 w-[600px] h-[600px] bg-primary-100 rounded-full -translate-y-1/4 translate-x-1/4 blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-leaf/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

          <motion.div style={{ y: heroY }} className="section-wrapper relative z-10 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left */}
              <div>
                <motion.div
                  initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.1, duration:0.6 }}
                  className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-2 mb-6"
                >
                  <Leaf size={14} className="text-primary" />
                  <span className="text-primary-700 text-sm font-semibold">Welcome To Our Grocery Store</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.2, duration:0.8, ease:[0.23,1,0.32,1] }}
                  className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-text leading-tight mb-6"
                >
                  <span className="text-primary-600 italic font-light block text-2xl mb-2">Farm Fresh</span>
                  Good food<br />
                  <span className="text-gradient">Good life</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.35, duration:0.7 }}
                  className="text-text-secondary text-lg leading-relaxed mb-8 max-w-lg"
                >
                  Organic fruits, vegetables &amp; more delivered fresh to your door.
                  Straight from local farmers — no middlemen, no chemicals.
                </motion.p>

                <motion.div
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.5, duration:0.6 }}
                  className="flex flex-wrap gap-4 mb-10"
                >
                  <Link to="/marketplace" className="btn-lg btn-primary rounded-2xl shadow-hover">
                    Shop Now <ArrowRight size={20} />
                  </Link>
                  <Link to="/marketplace" className="btn-lg btn-secondary rounded-2xl">
                    Explore Categories
                  </Link>
                </motion.div>

                {/* Trust chips */}
                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }}
                  transition={{ delay:0.7, duration:0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  {[
                    { icon:'🌿', title:'100% Organic', sub:'Certified & Natural' },
                    { icon:'🚚', title:'Fast Delivery', sub:'On-Time, Every Time' },
                    { icon:'♻️', title:'Sustainably Sourced', sub:'Good for You & Planet' },
                  ].map(t => (
                    <div key={t.title} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-card border border-border-light">
                      <span className="text-2xl">{t.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-text">{t.title}</p>
                        <p className="text-2xs text-text-muted">{t.sub}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — Produce Image + Orbiting Items */}
              <div className="relative hidden lg:flex items-center justify-center h-[500px]">
                {/* Main image */}
                <motion.div
                  initial={{ opacity:0, scale:0.8 }}
                  animate={{ opacity:1, scale:1 }}
                  transition={{ delay:0.3, duration:0.9, ease:[0.23,1,0.32,1] }}
                  className="relative z-10"
                >
                  <div className="w-[380px] h-[380px] rounded-full overflow-hidden border-8 border-white shadow-float bg-white">
                    <img
                      src={freshProduceHero}
                      alt="Fresh basket of fruits and vegetables"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Always Fresh badge */}
                  <motion.div
                    animate={{ y:[0,-8,0] }} transition={{ duration:3, repeat:Infinity }}
                    className="absolute bottom-6 right-6 bg-white rounded-2xl shadow-float p-3 border border-border-light"
                  >
                    <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-1">
                      <Leaf size={22} className="text-primary" />
                    </div>
                    <p className="text-2xs font-bold text-primary text-center">Always<br/>Fresh</p>
                  </motion.div>
                </motion.div>

                {/* Orbiting produce accents */}
                {ORBIT_ITEMS.map((item, i) => (
                  <div
                    key={i}
                    className="orbit-item"
                    style={{
                      '--start': `${i * (360 / ORBIT_ITEMS.length)}deg`,
                      '--radius': '205px',
                      '--duration': '18s',
                    }}
                  >
                    <motion.div
                    initial={{ opacity:0, scale:0 }}
                    animate={{ opacity:1, scale:1 }}
                    transition={{
                      opacity: { delay: i * 0.1 + 0.4, duration:0.4 },
                      scale:   { delay: i * 0.1 + 0.4, duration:0.4 },
                    }}
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-hover p-1.5 border border-white/80 overflow-hidden group">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none'
                          event.currentTarget.nextElementSibling.style.display = 'flex'
                        }}
                      />
                      <span className="hidden w-full h-full items-center justify-center rounded-xl bg-primary-50 text-3xl" aria-label={item.name}>
                        {item.emoji}
                      </span>
                    </div>
                    </motion.div>
                  </div>
                ))}

                {/* Subtle professional framing */}
                <div className="absolute inset-4 rounded-full border border-primary-200/70 pointer-events-none" />
                <div className="absolute inset-10 rounded-full bg-primary-100/30 -z-10 blur-2xl pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════════ MARQUEE STATS ══════════════ */}
        <div className="bg-primary py-4 overflow-hidden">
          <div className="flex gap-8 animate-marquee whitespace-nowrap" aria-hidden="true">
            {[...Array(3)].flatMap(() => [
              '🌿 100% Organic', '🚚 Same Day Delivery', '👨‍🌾 50+ Local Farmers',
              '⭐ 4.9 Rating', '🛒 10,000+ Happy Customers', '📦 500+ Products', '🔒 Secure Payments',
            ]).map((item, i) => (
              <span key={i} className="text-white font-semibold text-sm flex-shrink-0">
                {item} <span className="mx-4 text-primary-300">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════ CATEGORIES ══════════════ */}
        <Sec id="categories" className="bg-white">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-60px' }}
            className="text-center mb-12"
          >
            <p className="section-label justify-center">Shop by Category</p>
            <h2 className="text-4xl font-display font-bold text-text">Best of Nature,<br/>
              <span className="text-gradient">Handpicked for You</span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true, margin:'-40px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map(cat => (
              <motion.div key={cat.id} variants={fadeUp}>
                <Link to={`/marketplace?cat=${cat.name}`}>
                  <motion.div
                    whileHover={{ y:-6, scale:1.03 }}
                    transition={{ type:'spring', stiffness:300, damping:20 }}
                    className="group bg-white rounded-3xl overflow-hidden border border-border-light shadow-card
                      hover:shadow-hover hover:border-primary-200 transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-36 overflow-hidden">
                      <img src={cat.image} alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="p-3 text-center">
                      <p className="font-semibold text-sm text-text group-hover:text-primary transition-colors">{cat.name}</p>
                      <p className="text-2xs text-text-muted">{cat.desc}</p>
                    </div>
                    <div className="px-3 pb-3 flex items-center justify-between">
                      <span className="text-2xs text-primary-500 font-medium">{cat.count} items</span>
                      <ArrowRight size={14} className="text-primary-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </Sec>

        {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
        <Sec className="bg-bg-section">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
          >
            <div>
              <p className="section-label">Most Popular</p>
              <h2 className="text-4xl font-display font-bold text-text">
                Trending <span className="text-gradient">Products</span>
              </h2>
            </div>
            <Link to="/marketplace" className="btn-md btn-secondary rounded-xl whitespace-nowrap">
              View All Products <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.slice(0, 8).map(p => (
              <motion.div key={p.id} variants={fadeUp}>
                <ProductCard product={p} onAddToCart={addToCart} onWishlist={toggleWish} wishlistIds={wishlist} />
              </motion.div>
            ))}
          </motion.div>
        </Sec>

        {/* ══════════════ TODAY'S FRESH PICKS ══════════════ */}
        <Sec className="bg-white border-t border-border-light">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
          >
            <div>
              <p className="section-label bg-green-50 text-green-700 border-green-200">🟢 Harvested Today/Yesterday</p>
              <h2 className="text-4xl font-display font-bold text-text">
                Today's <span className="text-gradient font-bold">Fresh Picks</span>
              </h2>
              <p className="text-sm text-text-secondary mt-1">Super-fresh produce harvested less than 48 hours ago</p>
            </div>
            <Link to="/marketplace" className="btn-md btn-secondary rounded-xl whitespace-nowrap">
              View All Fresh Items <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {getFreshProducts(products).slice(0, 4).map(p => (
              <motion.div key={p.id} variants={fadeUp}>
                <ProductCard product={p} onAddToCart={addToCart} onWishlist={toggleWish} wishlistIds={wishlist} />
              </motion.div>
            ))}
          </motion.div>
        </Sec>

        {/* ══════════════ SEASONAL PRODUCE ══════════════ */}
        <Sec className="bg-bg-section border-t border-border-light">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
          >
            <div>
              <p className={`section-label ${getSeasonMeta(getCurrentSeason()).bgColor} ${getSeasonMeta(getCurrentSeason()).color} ${getSeasonMeta(getCurrentSeason()).borderColor}`}>
                {getSeasonMeta(getCurrentSeason()).emoji} {getCurrentSeason()} Specials
              </p>
              <h2 className="text-4xl font-display font-bold text-text">
                In-Season <span className="text-gradient font-bold">Produce</span>
              </h2>
              <p className="text-sm text-text-secondary mt-1">{getSeasonMeta(getCurrentSeason()).desc}</p>
            </div>
            <Link to="/marketplace" className="btn-md btn-secondary rounded-xl whitespace-nowrap">
              Explore Seasonal List <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {getSeasonalProducts(products).slice(0, 4).map(p => (
              <motion.div key={p.id} variants={fadeUp}>
                <ProductCard product={p} onAddToCart={addToCart} onWishlist={toggleWish} wishlistIds={wishlist} />
              </motion.div>
            ))}
          </motion.div>
        </Sec>

        {/* ══════════════ HOW IT WORKS ══════════════ */}
        <Sec id="how" className="bg-white">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }} className="text-center mb-12">
            <p className="section-label justify-center">Simple Process</p>
            <h2 className="text-4xl font-display font-bold">How It <span className="text-gradient">Works</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary-200 via-primary to-primary-200" />
            {[
              { step:'01', icon:'🛒', title:'Browse & Select', desc:'Explore thousands of fresh products from verified local farmers. Filter by category, price, or organic certification.' },
              { step:'02', icon:'💳', title:'Easy Checkout',   desc:'Add to cart, apply coupon codes, choose your delivery slot and pay securely via UPI, Card, or Cash on Delivery.' },
              { step:'03', icon:'🚚', title:'Fast Delivery',   desc:'Your order is packed fresh and delivered to your doorstep within 24 hours. Track in real-time on your dashboard.' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once:true }} transition={{ delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-3xl shadow-hover mb-5">
                  {s.icon}
                </div>
                <span className="text-primary-300 text-xs font-bold tracking-widest mb-2">{s.step}</span>
                <h3 className="text-xl font-display font-bold mb-3">{s.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </Sec>

        {/* ══════════════ FARM TO HOME + TRACKER ══════════════ */}
        <Sec className="bg-bg-section">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}>
              <p className="text-primary-500 italic font-medium text-lg mb-2">From Our Farm</p>
              <h2 className="text-4xl font-display font-bold mb-6">
                To Your Home,<br/><span className="text-gradient">Fresh &amp; Fast</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                We ensure that every order is packed with care and delivered fresh to your doorstep.
                Our cold-chain logistics keep your produce at peak freshness throughout the journey.
              </p>
              {[
                { icon:'📍', title:'Real-Time Order Tracking', desc:'Track your order from farm to doorstep live.' },
                { icon:'🌿', title:'Freshness Guaranteed',     desc:'100% quality checked produce, every order.' },
                { icon:'↩️', title:'Easy Returns & Refunds',  desc:'Hassle-free return policy within 24 hours.' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">{f.icon}</div>
                  <div>
                    <h4 className="font-semibold text-text mb-0.5">{f.title}</h4>
                    <p className="text-sm text-text-secondary">{f.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Right — Tracking Widget */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once:true }} transition={{ delay:0.2 }}
              className="bg-white rounded-3xl shadow-float border border-border-light p-6"
            >
              {/* Widget header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-lg">Track Your Order</h3>
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-semibold">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>

              {/* Delivery partner */}
              <div className="flex items-center justify-between p-4 bg-bg-section rounded-2xl mb-5">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80"
                    alt="Delivery partner" className="w-11 h-11 rounded-full object-cover border-2 border-primary-200" />
                  <div>
                    <p className="font-semibold text-sm">Rahul Sharma</p>
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-yellow-400" fill="currentColor" />
                      <span className="text-2xs text-text-muted">4.8 · Your delivery partner</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                    <Phone size={16} />
                  </button>
                </div>
              </div>

              {/* ETA */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-2xl font-bold text-primary">On the way</p>
                  <p className="text-sm text-text-muted">Order #ORD-2847</p>
                </div>
                <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-2 text-center">
                  <p className="text-xs text-primary-600 font-medium">Arriving in</p>
                  <p className="text-xl font-bold text-primary">15 min</p>
                </div>
              </div>

              {/* Progress */}
              <div className="relative mb-5">
                <div className="flex items-center justify-between mb-2">
                  {['Confirmed','Packed','On the way','Delivered'].map((step, i) => (
                    <div key={step} className="flex flex-col items-center gap-1 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                        ${i < 3 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {i < 3 ? <Check size={14} /> : '○'}
                      </div>
                      <span className="text-2xs text-text-muted text-center leading-tight">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 -z-10">
                  <div className="h-full bg-primary w-[70%] rounded-full" />
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-2 p-3 bg-bg-section rounded-xl">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <p className="text-sm text-text-secondary">123 Green Avenue, Your Street, City - 560081</p>
              </div>
            </motion.div>
          </div>
        </Sec>

        {/* ══════════════ WHY CHOOSE US ══════════════ */}
        <Sec className="bg-white">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }} className="text-center mb-12">
            <p className="section-label justify-center">Why GreenBasket</p>
            <h2 className="text-4xl font-display font-bold">The Freshest Choice <span className="text-gradient">for Every Home</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon:'🌿', color:'bg-green-50',  title:'100% Organic',     desc:'Every product is naturally grown without harmful pesticides or chemicals.' },
              { icon:'⚡', color:'bg-yellow-50', title:'Same-Day Delivery', desc:'Order before 6 PM for guaranteed fresh delivery to your door by 8 PM.' },
              { icon:'💰', color:'bg-blue-50',   title:'Farm-Direct Prices', desc:'No middlemen. Farmers earn more, you save more. Win-win for everyone.' },
              { icon:'❤️', color:'bg-red-50',    title:'Freshness Guarantee', desc:'Not fresh? Get a full refund or replacement, no questions asked.' },
            ].map((f, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once:true }} transition={{ delay: i*0.1 }}
                className="card p-6 text-center hover:border-primary-200"
              >
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}>{f.icon}</div>
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </Sec>

        {/* ══════════════ FARMER BENEFITS ══════════════ */}
        <Sec className="bg-green-mesh">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}>
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=85"
                alt="Happy farmer" className="rounded-3xl shadow-float w-full object-cover h-[420px]"
              />
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once:true }} transition={{ delay:0.2 }}>
              <p className="section-label">For Farmers</p>
              <h2 className="text-4xl font-display font-bold mb-6">
                Grow your farm,<br/><span className="text-gradient">Grow your income</span>
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                Join 50+ successful farmers who eliminated middlemen and increased their earnings by up to 45%.
                Your farm, your prices, your success.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon:'💸', label:'45%', desc:'Higher earnings' },
                  { icon:'📊', label:'Free', desc:'Analytics tools' },
                  { icon:'🚚', label:'0',   desc:'Delivery worries' },
                  { icon:'⭐', label:'24h', desc:'Payment settlement' },
                ].map(b => (
                  <div key={b.label} className="bg-white rounded-2xl p-4 shadow-card border border-border-light">
                    <span className="text-2xl mb-2 block">{b.icon}</span>
                    <p className="text-2xl font-bold text-primary">{b.label}</p>
                    <p className="text-sm text-text-muted">{b.desc}</p>
                  </div>
                ))}
              </div>
              <Link to="/register?role=farmer" className="btn-lg btn-primary rounded-2xl shadow-hover">
                Start Selling Today <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </Sec>

        {/* ══════════════ TESTIMONIALS ══════════════ */}
        <Sec className="bg-white" id="testimonials">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }} className="text-center mb-12">
            <p className="section-label justify-center">Happy Customers</p>
            <h2 className="text-4xl font-display font-bold">What People <span className="text-gradient">Are Saying</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.id} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once:true }} transition={{ delay: i*0.1 }}
                className={`card p-6 cursor-pointer transition-all duration-300
                  ${activeTestimonial === i ? 'border-primary-300 shadow-hover ring-1 ring-primary-200' : ''}`}
                onClick={() => setActiveTestimonial(i)}
              >
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={14} fill={s<=t.rating?'#FBBF24':'none'} className={s<=t.rating?'text-yellow-400':'text-gray-200'} />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-5 line-clamp-3 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary-100" />
                  <div>
                    <p className="font-semibold text-sm text-text">{t.name}</p>
                    <p className="text-2xs text-text-muted">{t.role} · {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Sec>

        {/* ══════════════ STATS ══════════════ */}
        <div className="bg-primary py-16">
          <div className="section-wrapper">
            <p className="text-primary-200 text-center text-sm font-semibold tracking-widest uppercase mb-2">
              Trusted by Thousands of Happy Customers
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {stats.map((s, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once:true }} transition={{ delay: i*0.12 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-2">{s.icon}</div>
                  <div className="text-4xl font-display font-bold text-white mb-1">
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-primary-200 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════ FAQ ══════════════ */}
        <Sec className="bg-bg-section" id="faq">
          <div className="max-w-3xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }} className="text-center mb-12">
              <p className="section-label justify-center">Got Questions?</p>
              <h2 className="text-4xl font-display font-bold">Frequently Asked <span className="text-gradient">Questions</span></h2>
            </motion.div>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
                  className="bg-white rounded-2xl border border-border-light shadow-card overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-primary-50 transition-colors"
                    aria-expanded={activeFAQ === i}
                  >
                    <span className="font-semibold text-text">{faq.q}</span>
                    {activeFAQ === i
                      ? <ChevronUp size={20} className="text-primary flex-shrink-0" />
                      : <ChevronDown size={20} className="text-text-muted flex-shrink-0" />
                    }
                  </button>
                  <AnimatePresence>
                    {activeFAQ === i && (
                      <motion.div
                        initial={{ height:0, opacity:0 }}
                        animate={{ height:'auto', opacity:1 }}
                        exit={{ height:0, opacity:0 }}
                        transition={{ duration:0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-text-secondary text-sm leading-relaxed border-t border-border-light pt-4">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </Sec>

        {/* ══════════════ FINAL CTA ══════════════ */}
        <Sec className="bg-white" id="about">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once:true }}
            className="relative bg-green-gradient rounded-4xl overflow-hidden text-white text-center py-20 px-8"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage:'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 40%)' }} />
            <div className="relative z-10">
              <div className="flex justify-center gap-4 mb-6 text-4xl">
                <span className="animate-bounce-light" style={{ animationDelay:'0s' }}>🥦</span>
                <span className="animate-bounce-light" style={{ animationDelay:'0.3s' }}>🍎</span>
                <span className="animate-bounce-light" style={{ animationDelay:'0.6s' }}>🥕</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Ready to eat fresher?
              </h2>
              <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                Join 10,000+ families who switched to farm-fresh. No subscription, no commitment — just fresh food.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/marketplace" className="btn-lg bg-white text-primary rounded-2xl shadow-hover font-bold hover:bg-primary-50">
                  Start Shopping <ArrowRight size={20} />
                </Link>
                <Link to="/register?role=farmer" className="btn-lg bg-white/10 border-2 border-white/40 text-white rounded-2xl hover:bg-white/20">
                  🌾 Become a Farmer
                </Link>
              </div>
            </div>
          </motion.div>
        </Sec>
      </main>

      <Footer />
    </div>
  )
}
