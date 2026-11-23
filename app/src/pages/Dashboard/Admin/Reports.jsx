import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler)

const CATEGORY_SALES = {
  labels:['Vegetables','Fruits','Dairy','Grains','Pantry','Spices'],
  datasets:[{
    label:'Sales (₹)',
    data:[142000,98000,67000,54000,48000,32000],
    backgroundColor:['#1A6B2A','#4CAF50','#84CC16','#22C55E','#86EFAC','#BBF7D0'],
    borderRadius:8, borderWidth:0,
  }]
}

const GROWTH_DATA = {
  labels:['Jul','Aug','Sep','Oct','Nov','Dec','Jan'],
  datasets:[
    { label:'Revenue', data:[120,160,140,210,185,280,340], borderColor:'#1A6B2A', backgroundColor:'rgba(26,107,42,0.1)', fill:true, tension:0.4, pointRadius:4, borderWidth:2.5, pointBackgroundColor:'#1A6B2A' },
    { label:'Orders',  data:[80,120,100,160,140,220,260], borderColor:'#4CAF50', backgroundColor:'rgba(76,175,80,0.1)', fill:true, tension:0.4, pointRadius:4, borderWidth:2, pointBackgroundColor:'#4CAF50' },
  ]
}

const REGION_DATA = {
  labels:['Maharashtra','Tamil Nadu','J&K','Gujarat','Punjab','Kerala'],
  datasets:[{
    data:[38,18,14,12,10,8],
    backgroundColor:['#1A6B2A','#2E7D32','#4CAF50','#66BB6A','#81C784','#A5D6A7'],
    borderWidth:0,
  }]
}

const OPTS = { responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'#f5f5f5' } } } }

export default function AdminReports() {
  const summaryStats = [
    { label:'Total GMV',        value:'₹41.2L', period:'Jan 2024' },
    { label:'Avg Daily Orders', value:'284',     period:'Last 30 days' },
    { label:'Farmer Payouts',   value:'₹28.4L', period:'Jan 2024' },
    { label:'Platform Revenue', value:'₹4.1L',  period:'10% commission' },
    { label:'Active Farmers',   value:'47',      period:'Verified' },
    { label:'Customer LTV',     value:'₹3,240', period:'Avg per customer' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl text-gray-800">Reports & Analytics</h2>
        <button className="btn-md btn-secondary rounded-xl text-sm flex items-center gap-2">
          📊 Export CSV
        </button>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryStats.map((s,i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs mb-2">{s.period}</p>
            <p className="font-display font-bold text-2xl text-gray-800">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-1">Revenue & Orders Growth</h3>
          <p className="text-xs text-gray-400 mb-4">All figures in thousands (₹K) · 7-month view</p>
          <Line data={GROWTH_DATA} options={{...OPTS, plugins:{ legend:{ display:true, position:'top', labels:{ font:{size:11}, boxWidth:12 } } }}} height={130}/>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Sales by Region</h3>
          <Doughnut data={REGION_DATA} options={{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{ font:{size:11}, boxWidth:12 } } } }}/>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Revenue by Product Category</h3>
        <Bar data={CATEGORY_SALES} options={OPTS} height={100}/>
      </div>

      {/* Downloadable reports */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Downloadable Reports</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name:'Monthly Revenue Report', period:'January 2024', size:'2.4 MB' },
            { name:'Farmer Payout Summary',  period:'January 2024', size:'1.1 MB' },
            { name:'Customer Orders Report', period:'Q4 2023',      size:'3.8 MB' },
            { name:'Product Performance',    period:'January 2024', size:'1.7 MB' },
            { name:'Tax & GST Summary',      period:'FY 2023-24',   size:'0.9 MB' },
            { name:'Annual Summary',         period:'2023',          size:'5.2 MB' },
          ].map((r,i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-all cursor-pointer group">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📄</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{r.name}</p>
                <p className="text-2xs text-gray-400">{r.period} · {r.size}</p>
              </div>
              <span className="text-2xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity">↓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
