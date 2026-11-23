import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, Package, ShoppingBag, BarChart2, Settings, LogOut, Bell, Menu, X, Leaf, ChevronRight, Shield, ClipboardCheck } from 'lucide-react'

const LINKS = [
  { to:'/admin/home',          icon:LayoutDashboard, label:'Overview' },
  { to:'/admin/users',         icon:Users,           label:'Users' },
  { to:'/admin/products',      icon:Package,         label:'Products' },
  { to:'/admin/orders',        icon:ShoppingBag,     label:'Orders' },
  { to:'/admin/bulk-requests', icon:ClipboardCheck,  label:'Bulk Requests' },
  { to:'/admin/reports',       icon:BarChart2,       label:'Reports' },
]

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-300 lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><Shield size={16} className="text-white"/></div>
            <div>
              <span className="font-display font-bold text-sm text-white">GreenBasket</span>
              <p className="text-2xs text-gray-400">Admin Panel</p>
            </div>
          </div>
          <button onClick={()=>setOpen(false)} className="lg:hidden text-gray-400 hover:text-white"><X size={20}/></button>
        </div>

        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">A</div>
            <div>
              <p className="font-semibold text-white text-sm">Admin User</p>
              <p className="text-2xs text-gray-400">Super Administrator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {LINKS.map(({to,icon:Icon,label}) => {
            const active = location.pathname.startsWith(to)
            return (
              <Link key={to} to={to} onClick={()=>setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <Icon size={18}/>{label}
                {active && <ChevronRight size={14} className="ml-auto opacity-40"/>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={()=>navigate('/login')} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-red-500/20 hover:text-red-300 transition-all w-full">
            <LogOut size={18}/> Sign Out
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {open && <motion.div key="ov" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          onClick={()=>setOpen(false)} className="fixed inset-0 z-30 bg-black/40 lg:hidden"/>}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <button onClick={()=>setOpen(true)} className="lg:hidden btn-icon"><Menu size={22}/></button>
          <div className="hidden sm:flex items-center gap-2">
            <Shield size={16} className="text-primary"/>
            <h1 className="font-semibold text-gray-800 capitalize">{location.pathname.split('/').pop()?.replace(/-/g,' ') || 'Overview'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative btn-icon"><Bell size={20}/><span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full"/></button>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold">A</div>
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
