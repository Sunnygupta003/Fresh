import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Save, MapPin, Phone, Mail, Building, FileText, CreditCard } from 'lucide-react'

export default function FarmerProfile() {
  const [tab, setTab] = useState('farm')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: 'Ravi Kumar', phone: '+91 98765 43210', email: 'ravi@greenfarm.in',
    farmName: 'Green Valley Farm', farmSize: '5 acres', established: '2018',
    location: 'Nashik, Maharashtra', pin: '422001', crops: 'Tomatoes, Onions, Peppers',
    bankName: 'State Bank of India', accountNo: '****5432', ifsc: 'SBIN0001234',
    upi: 'ravi@upi',
  })
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const handleSave = (e) => { e.preventDefault(); setSaved(true); setTimeout(()=>setSaved(false),2500) }

  const TABS = [
    { id:'farm',  label:'Farm Details',  icon:Building },
    { id:'docs',  label:'Documents',     icon:FileText },
    { id:'bank',  label:'Bank Details',  icon:CreditCard },
  ]

  return (
    <div className="max-w-2xl">
      <h2 className="font-display font-bold text-2xl text-text mb-6">My Profile</h2>

      {/* Farmer card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80"
              alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-200"/>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white shadow-md">
              <Camera size={14}/>
            </button>
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-text">{form.name}</h3>
            <p className="text-text-muted text-sm flex items-center gap-1.5 mt-0.5"><MapPin size={13}/> {form.location}</p>
            <div className="flex gap-2 mt-2">
              <span className="badge-green text-2xs">✓ Verified Farmer</span>
              <span className="badge bg-yellow-50 text-yellow-700 border border-yellow-200 text-2xs">⭐ 4.8 Rating</span>
            </div>
          </div>
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-2xl font-bold text-primary">₹2.4L</p>
            <p className="text-xs text-text-muted">Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-border-light shadow-card mb-6 overflow-x-auto scrollbar-hide">
        {TABS.map(({id,label,icon:Icon}) => (
          <button key={id} onClick={()=>setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center
              ${tab===id?'bg-primary text-white shadow':'text-text-secondary hover:bg-primary-50 hover:text-primary'}`}>
            <Icon size={15}/>{label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="card p-6">
        {tab === 'farm' && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { id:'name',        label:'Full Name',        col:1 },
              { id:'phone',       label:'Phone',            col:1 },
              { id:'email',       label:'Email',            col:2 },
              { id:'farmName',    label:'Farm Name',        col:1 },
              { id:'farmSize',    label:'Farm Size',        col:1 },
              { id:'established', label:'Year Established', col:1 },
              { id:'location',    label:'Location / City',  col:1 },
              { id:'crops',       label:'Primary Crops',    col:2 },
            ].map(f => (
              <div key={f.id} className={`form-group ${f.col===2?'col-span-2':''}`}>
                <label htmlFor={f.id} className="form-label">{f.label}</label>
                <input id={f.id} value={form[f.id]} onChange={e=>set(f.id,e.target.value)} className="input-base"/>
              </div>
            ))}
          </div>
        )}

        {tab === 'docs' && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">Upload your farm documents for verification (PDF, JPG, PNG).</p>
            {[
              { label:'Farm Registration Certificate', status:'verified' },
              { label:'Organic Certification',         status:'pending' },
              { label:'Aadhaar / ID Proof',            status:'verified' },
              { label:'Bank Statement (3 months)',      status:'missing' },
            ].map((doc,i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-border-light rounded-xl hover:border-primary-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-xl">📄</div>
                  <div>
                    <p className="font-medium text-text text-sm">{doc.label}</p>
                    <span className={`text-2xs font-semibold ${doc.status==='verified'?'text-green-600':doc.status==='pending'?'text-yellow-600':'text-red-500'}`}>
                      {doc.status==='verified'?'✓ Verified':doc.status==='pending'?'⏳ Under Review':'× Not Uploaded'}
                    </span>
                  </div>
                </div>
                <button type="button" className="btn-sm btn-secondary rounded-xl text-xs">
                  {doc.status==='missing'?'Upload':'Re-upload'}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'bank' && (
          <div className="grid grid-cols-2 gap-4">
            <p className="col-span-2 text-sm text-text-muted pb-2 border-b border-border-light">
              Your earnings will be settled to this bank account within 24 hours of order delivery.
            </p>
            {[
              { id:'bankName',  label:'Bank Name',      col:1 },
              { id:'accountNo', label:'Account Number', col:1 },
              { id:'ifsc',      label:'IFSC Code',      col:1 },
              { id:'upi',       label:'UPI ID',         col:1 },
            ].map(f => (
              <div key={f.id} className="form-group">
                <label htmlFor={f.id} className="form-label">{f.label}</label>
                <input id={f.id} value={form[f.id]} onChange={e=>set(f.id,e.target.value)} className="input-base"/>
              </div>
            ))}
            <div className="col-span-2 bg-primary-50 border border-primary-200 rounded-xl p-3 flex items-center gap-2 text-sm text-primary-700">
              🔒 Bank details are encrypted and never shared with customers
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t border-border-light">
          <motion.button type="submit" whileHover={{scale:1.02}} whileTap={{scale:0.97}}
            className={`btn-md rounded-xl flex items-center gap-2 ${saved?'bg-green-500 text-white':'btn-primary'}`}>
            <Save size={16}/> {saved?'Saved!':'Save Changes'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}
