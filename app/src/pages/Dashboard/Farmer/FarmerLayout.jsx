import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Package, ShoppingBag, BarChart2, Warehouse, User, LogOut, Bell, Menu, X, Leaf, Plus, ChevronRight, ClipboardCheck } from 'lucide-react'

const LINKS = [
  { to:'/farmer/home',      icon:Home,       label:'Dashboard' },
  { to:'/farmer/products',  icon:Package,    label:'My Products' },
  { to:'/farmer/orders',    icon:ShoppingBag,label:'Orders' },
  { to:'/farmer/bulk-requests', icon:ClipboardCheck, label:'Bulk Requests' },
  { to:'/farmer/inventory', icon:Warehouse,  label:'Inventory' },
  { to:'/farmer/analytics', icon:BarChart2,  label:'Analytics' },
  { to:'/farmer/profile',   icon:User,       label:'Profile' },
]

export default function FarmerLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-section flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary-900 text-white flex flex-col
        transform transition-transform duration-300 lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-leaf rounded-lg flex items-center justify-center"><Leaf size={16} className="text-white" strokeWidth={2.5}/></div>
            <span className="font-display font-bold text-white">GreenBasket</span>
          </Link>
          <button onClick={()=>setOpen(false)} className="lg:hidden text-white/60 hover:text-white"><X size={20}/></button>
        </div>

        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80"
              alt="Farmer" className="w-11 h-11 rounded-2xl object-cover border-2 border-white/20"/>
            <div>
              <p className="font-semibold text-white text-sm">Ravi Kumar</p>
              <p className="text-2xs text-primary-300">Green Valley Farm 🌾</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {LINKS.map(({to,icon:Icon,label}) => {
            const active = location.pathname.startsWith(to)
            return (
              <Link key={to} to={to} onClick={()=>setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active ? 'bg-white/15 text-white' : 'text-primary-300 hover:bg-white/10 hover:text-white'}`}>
                <Icon size={18}/>{label}
                {active && <ChevronRight size={14} className="ml-auto opacity-60"/>}
              </Link>
            )
          })}
          <Link to="/farmer/products/add" onClick={()=>setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-leaf/20 text-leaf hover:bg-leaf/30 transition-all mt-2 border border-leaf/30">
            <Plus size={18}/> Add New Product
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={()=>navigate('/login')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary-300 hover:bg-red-500/20 hover:text-red-300 transition-all w-full">
            <LogOut size={18}/> Sign Out
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {open && <motion.div key="ov" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          onClick={()=>setOpen(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden"/>}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white border-b border-border-light px-6 py-3 flex items-center justify-between shadow-sm">
          <button onClick={()=>setOpen(true)} className="lg:hidden btn-icon"><Menu size={22}/></button>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-2xs text-primary-500 font-medium bg-primary-50 px-2 py-0.5 rounded-full">🌾 Farmer</span>
            <h1 className="font-semibold text-text capitalize">{location.pathname.split('/').pop()?.replace(/-/g,' ') || 'Dashboard'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative btn-icon"><Bell size={20}/><span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full"/></button>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80" alt="" className="w-9 h-9 rounded-xl object-cover"/>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div key={location.pathname} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.35}}>
            <Outlet/>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
