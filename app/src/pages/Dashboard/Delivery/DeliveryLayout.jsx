import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Package, Map, LogOut, Bell, Menu, X, Truck, ChevronRight } from 'lucide-react'

const LINKS = [
  { to:'/delivery/home',      icon:Home,    label:'Dashboard' },
  { to:'/delivery/available', icon:Package, label:'Available Orders' },
  { to:'/delivery/map',       icon:Map,     label:'Active Deliveries' },
]

export default function DeliveryLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-section flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-float border-r border-border-light flex flex-col
        transform transition-transform duration-300 lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-border-light">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Truck size={16} className="text-white" strokeWidth={2.5}/>
            </div>
            <span className="font-display font-bold text-primary-700">GreenLogistics</span>
          </Link>
          <button onClick={()=>setOpen(false)} className="lg:hidden btn-icon"><X size={20}/></button>
        </div>

        {/* User profile mini */}
        <div className="p-5 border-b border-border-light">
          <div className="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80"
              alt="User" className="w-11 h-11 rounded-2xl object-cover border-2 border-primary-100"/>
            <div>
              <p className="font-semibold text-text text-sm">Rahul Kumar</p>
              <p className="text-2xs text-text-muted">Delivery Partner</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {LINKS.map(({to,icon:Icon,label}) => {
            const active = location.pathname.startsWith(to)
            return (
              <Link key={to} to={to} onClick={()=>setOpen(false)}
                className={`sidebar-link ${active?'active':''}`}>
                <Icon size={18}/>
                {label}
                {active && <ChevronRight size={14} className="ml-auto text-primary-400"/>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border-light">
          <button onClick={()=>navigate('/login')} className="sidebar-link w-full text-danger hover:bg-red-50 hover:text-danger">
            <LogOut size={18}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {open && <motion.div key="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          onClick={()=>setOpen(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden"/>}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border-light px-6 py-3 flex items-center justify-between shadow-sm">
          <button onClick={()=>setOpen(true)} className="lg:hidden btn-icon"><Menu size={22}/></button>
          <div className="hidden sm:block">
            <h1 className="font-semibold text-text capitalize">
              {location.pathname.split('/').pop()?.replace(/-/g,' ') || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative btn-icon">
              <Bell size={20}/>
              <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full"/>
            </button>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80"
              alt="User" className="w-9 h-9 rounded-xl object-cover border-2 border-primary-100"/>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div key={location.pathname} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
            <Outlet/>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
