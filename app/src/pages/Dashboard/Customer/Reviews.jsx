import { Star } from 'lucide-react'
import { products } from '../../../data/mockData'

const MY_REVIEWS = [
  { product: products[0], rating: 5, text: 'Absolutely fresh! Better than anything from the supermarket.', date: 'Jan 12, 2024' },
  { product: products[2], rating: 4, text: 'Alphonso mangoes are top quality. Slightly expensive but worth it.', date: 'Jan 8, 2024' },
]

export default function CustomerReviews() {
  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-text mb-6">My Reviews</h2>
      <div className="flex flex-col gap-5">
        {MY_REVIEWS.map((r, i) => (
          <div key={i} className="card p-5 flex gap-5">
            <img src={r.product.image} alt={r.product.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-text mb-1">{r.product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{[1,2,3,4,5].map(s=><Star key={s} size={14} fill={s<=r.rating?'#FBBF24':'none'} className={s<=r.rating?'text-yellow-400':'text-gray-200'}/>)}</div>
                <span className="text-xs text-text-muted">{r.date}</span>
              </div>
              <p className="text-sm text-text-secondary italic">"{r.text}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
