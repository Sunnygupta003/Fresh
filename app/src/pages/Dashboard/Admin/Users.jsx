import { useState } from 'react'
import { Search, UserCheck, UserX, Shield } from 'lucide-react'

const USERS = [
  { id:1, name:'Priya Sharma',   email:'priya@example.com',  role:'customer', joined:'Jan 10', orders:12, status:'active',   avatar:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80' },
  { id:2, name:'Rahul Mehta',    email:'rahul@example.com',  role:'customer', joined:'Jan 8',  orders:8,  status:'active',   avatar:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80' },
  { id:3, name:'Ravi Kumar',     email:'ravi@greenfarm.in',  role:'farmer',   joined:'Jan 2',  orders:0,  status:'active',   avatar:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=80' },
  { id:4, name:'Sunita Devi',    email:'sunita@hill.in',     role:'farmer',   joined:'Dec 28', orders:0,  status:'pending',  avatar:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80' },
  { id:5, name:'Anjali Patel',   email:'anjali@example.com', role:'customer', joined:'Dec 20', orders:5,  status:'active',   avatar:'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=60&q=80' },
  { id:6, name:'Vikram Singh',   email:'vikram@example.com', role:'customer', joined:'Dec 15', orders:3,  status:'suspended',avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=80' },
]

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [users, setUsers] = useState(USERS)

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole   = roleFilter === 'All' || u.role === roleFilter.toLowerCase()
    return matchSearch && matchRole
  })

  const toggleStatus = (id) => setUsers(u => u.map(x => x.id===id
    ? {...x, status: x.status==='active' ? 'suspended' : 'active'} : x))

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-display font-bold text-2xl text-gray-800">Users <span className="text-gray-400 font-normal text-lg">({users.length})</span></h2>
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
          {['All','Customer','Farmer'].map(r => (
            <button key={r} onClick={()=>setRoleFilter(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${roleFilter===r?'bg-primary text-white shadow':'text-gray-500 hover:text-primary hover:bg-primary-50'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-5">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search by name or email..." className="input-base pl-10"/>
      </div>

      <div className="table-wrapper">
        <table className="table-base">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0"/>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">{u.name}</p>
                      <p className="text-2xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${u.role==='farmer'?'badge-green':'badge-blue'}`}>
                    {u.role==='farmer'?'🌾':'🛒'} {u.role}
                  </span>
                </td>
                <td className="text-sm text-gray-500">{u.joined}</td>
                <td className="text-sm font-medium text-gray-800">{u.orders || '—'}</td>
                <td>
                  <span className={`badge ${u.status==='active'?'badge-green':u.status==='pending'?'badge-orange':'badge-red'}`}>
                    {u.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={()=>toggleStatus(u.id)}
                      className={`flex items-center gap-1 text-2xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors
                        ${u.status==='active'?'bg-red-50 text-red-600 hover:bg-red-100':'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {u.status==='active'?<><UserX size={12}/>Suspend</>:<><UserCheck size={12}/>Activate</>}
                    </button>
                    {u.role==='farmer' && u.status==='pending' && (
                      <button onClick={()=>setUsers(us=>us.map(x=>x.id===u.id?{...x,status:'active'}:x))}
                        className="flex items-center gap-1 text-2xs font-semibold px-2.5 py-1.5 rounded-lg bg-primary-50 text-primary hover:bg-primary-100 transition-colors">
                        <Shield size={12}/> Verify
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
