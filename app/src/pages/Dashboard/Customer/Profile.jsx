import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Save } from 'lucide-react'

export default function CustomerProfile() {
  const [form, setForm] = useState({ name:'Priya Sharma', email:'priya@example.com', phone:'+91 98765 43210', address:'123, Green Park Colony, Mumbai - 400001', dob:'1992-05-14' })
  const [saved, setSaved] = useState(false)
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleSave = (e) => { e.preventDefault(); setSaved(true); setTimeout(()=>setSaved(false),2500) }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display font-bold text-2xl text-text mb-6">My Profile</h2>
      <div className="card p-6 mb-6">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-border-light">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80"
              alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-200"/>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-md">
              <Camera size={14}/>
            </button>
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-text">{form.name}</h3>
            <p className="text-text-muted text-sm">Customer Account</p>
            <span className="badge-green text-2xs mt-1 inline-block">✓ Verified</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
          {[
            { id:'name',    label:'Full Name',   col:1 },
            { id:'email',   label:'Email',       col:1 },
            { id:'phone',   label:'Phone',       col:1 },
            { id:'dob',     label:'Date of Birth',col:1,type:'date' },
            { id:'address', label:'Default Address',col:2 },
          ].map(f => (
            <div key={f.id} className={`form-group ${f.col===2?'col-span-2':''}`}>
              <label htmlFor={f.id} className="form-label">{f.label}</label>
              <input id={f.id} type={f.type||'text'} value={form[f.id]} onChange={e=>set(f.id,e.target.value)} className="input-base"/>
            </div>
          ))}
          <div className="col-span-2 flex justify-end">
            <motion.button type="submit" whileHover={{scale:1.02}} whileTap={{scale:0.97}}
              className={`btn-md rounded-xl flex items-center gap-2 ${saved?'bg-green-500 text-white':'btn-primary'}`}>
              <Save size={16}/>{saved?'Saved!':'Save Changes'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  )
}
