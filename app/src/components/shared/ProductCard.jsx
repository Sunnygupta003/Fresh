import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Star, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getFreshnessStatus } from '../../utils/freshness'

export default function ProductCard({ product, onAddToCart, onWishlist, wishlistIds = [] }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const freshStatus = getFreshnessStatus(product.harvestDate)

  return (
    <motion.div
      className="product-card group"
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48 bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="product-img h-full w-full object-cover"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.organic && (
            <span className="badge-organic text-2xs px-2 py-0.5">🌿 Organic</span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${freshStatus.bgColor} ${freshStatus.textColor} ${freshStatus.color}`}>
            {freshStatus.emoji} {freshStatus.label}
          </span>
          {discount > 0 && (
            <span className="badge bg-red-500 text-white text-2xs px-2 py-0.5 rounded-full font-bold">
              -{discount}%
            </span>
          )}
        </div>
        {/* Wishlist button */}
        <button
          onClick={() => onWishlist?.(product.id)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center
            shadow-md transition-all duration-200 backdrop-blur-sm
            ${wishlistIds.includes(product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-text-muted hover:text-red-500 hover:bg-white'}`}
          aria-label="Add to wishlist"
        >
          <Heart size={16} fill={wishlistIds.includes(product.id) ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <p className="text-2xs text-primary-500 font-semibold mb-1">{product.category}</p>
          <h3 className="font-semibold text-text hover:text-primary transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12}
                className={s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'}
                fill="currentColor"
              />
            ))}
          </div>
          <span className="text-2xs text-text-muted">({product.reviews})</span>
        </div>

        {/* Farmer & location */}
        <div className="flex items-center gap-1 text-2xs text-text-muted mb-3">
          <MapPin size={11} />
          <span className="truncate">{product.farmer} · {product.location}</span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">₹{product.price}</span>
            <span className="text-2xs text-text-muted ml-1">/{product.unit}</span>
            {product.originalPrice && (
              <span className="text-2xs text-text-light line-through ml-2">₹{product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={() => onAddToCart?.(product)}
            className="btn-sm btn-primary flex items-center gap-1.5 rounded-xl"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  )
}
