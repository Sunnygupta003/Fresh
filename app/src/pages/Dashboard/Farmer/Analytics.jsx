import { useEffect, useRef, useState } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler)

const OPTS = { responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'#f0f0f0' } } } }

const WEEKLY_DATA = {
  labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  datasets: [{
    label:'Revenue (₹)',
    data: [1200, 1900, 1400, 2100, 1700, 2800, 2400],
    backgroundColor: 'rgba(26,107,42,0.12)',
    borderColor: '#1A6B2A',
    borderWidth: 2.5,
    fill: true,
    tension: 0.4,
    pointBackgroundColor: '#1A6B2A',
    pointRadius: 5,
  }]
}

const MONTHLY_DATA = {
  labels: ['Sep','Oct','Nov','Dec','Jan','Feb'],
  datasets: [{
    label:'Revenue (₹)',
    data: [28000, 32000, 41000, 38000, 51000, 47000],
    backgroundColor: ['rgba(26,107,42,0.7)','rgba(76,175,80,0.7)','rgba(132,204,22,0.7)','rgba(34,197,94,0.7)','rgba(21,128,61,0.7)','rgba(20,83,45,0.7)'],
    borderRadius: 8,
    borderWidth: 0,
  }]
}

const PRODUCT_MIX = {
  labels:['Tomatoes','Broccoli','Onions','Spinach','Others'],
  datasets:[{
    data:[35,20,18,15,12],
    backgroundColor:['#1A6B2A','#4CAF50','#84CC16','#22C55E','#86EFAC'],
    borderWidth: 0,
  }]
}

export default function FarmerAnalytics() {
  const [period, setPeriod] = useState('weekly')

  const kpis = [
    { label:'This Month Revenue', value:'₹51,240', change:'+18%',  up:true  },
    { label:'Orders This Month',  value:'184',      change:'+12',   up:true  },
    { label:'Avg Order Value',    value:'₹278',     change:'+5%',   up:true  },
    { label:'Return Rate',        value:'1.2%',     change:'-0.3%', up:false },
  ]

  const bestSellers = [
    { name:'Organic Tomatoes', sold:340, revenue:9520, pct:35 },
    { name:'Broccoli',         sold:218, revenue:14170,pct:20 },
    { name:'Red Onions',       sold:412, revenue:9064, pct:18 },
    { name:'Organic Spinach',  sold:178, revenue:4272, pct:15 },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display font-bold text-2xl text-text">Analytics</h2>
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 shadow-card">
          {['weekly','monthly'].map(p => (
            <button key={p} onClick={()=>setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all
                ${period===p?'bg-primary text-white shadow':'text-text-secondary hover:bg-primary-50 hover:text-primary'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k,i) => (
          <div key={i} className="card p-5">
            <p className="text-sm text-text-muted mb-2">{k.label}</p>
            <p className="font-display font-bold text-2xl text-text">{k.value}</p>
            <p className={`text-sm font-semibold mt-1 flex items-center gap-1 ${k.up?'text-green-600':'text-red-500'}`}>
              {k.up?'↑':'↓'} {k.change} <span className="text-text-muted font-normal text-xs">vs last month</span>
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue trend */}
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold text-text mb-4">Revenue Trend ({period === 'weekly' ? 'This Week' : 'Last 6 Months'})</h3>
          {period === 'weekly'
            ? <Line data={WEEKLY_DATA} options={OPTS} height={120}/>
            : <Bar data={MONTHLY_DATA} options={OPTS} height={120}/>}
        </div>

        {/* Product mix */}
        <div className="card p-5">
          <h3 className="font-semibold text-text mb-4">Sales by Product</h3>
          <Doughnut data={PRODUCT_MIX} options={{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{ font:{ size:11 }, boxWidth:12 } } } }}/>
        </div>
      </div>

      {/* Best sellers */}
      <div className="card p-5">
        <h3 className="font-semibold text-text mb-5">🏆 Best Selling Products</h3>
        <div className="flex flex-col gap-4">
          {bestSellers.map((p,i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                    ${i===0?'bg-yellow-400':i===1?'bg-gray-400':i===2?'bg-amber-600':'bg-primary-300'}`}>
                    {i+1}
                  </span>
                  <span className="font-medium text-text text-sm">{p.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-primary text-sm">₹{p.revenue.toLocaleString()}</span>
                  <span className="text-2xs text-text-muted ml-2">{p.sold} sold</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{width:`${p.pct}%`}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
