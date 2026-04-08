import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { useCartStore } from '../../store/useStore'
import { toast } from 'react-hot-toast'

interface ProductCardProps {
  id: number
  name: string
  slug: string
  price: number
  salePrice?: number
  image: string
  origin: string
  rating: number
  badge?: 'New' | 'Sale' | 'Best Seller'
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, name, slug, price, salePrice, image, origin, rating, badge 
}) => {
  const addToCart = useCartStore((state) => state.addToCart)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ id, name, price: salePrice || price, image, slug }, 1)
    toast.success(`${name} added to cart!`, {
      style: {
        background: '#1A0A00',
        color: '#FAF5EE',
        borderRadius: '12px',
        border: '1px solid #C9933A'
      },
      iconTheme: {
        primary: '#C9933A',
        secondary: '#FAF5EE'
      }
    })
  }

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="card group h-full flex flex-col"
    >
      {/* Image Gallery Area */}
      <div className="relative aspect-square overflow-hidden bg-grey-100">
        <Link to={`/product/${slug}`}>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {/* Floating Actions (Badges & Wishlist) */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
          {badge && (badge !== 'Sale' || (salePrice && salePrice < price)) && (
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm 
              ${badge === 'New' ? 'bg-green' : badge === 'Sale' ? 'bg-clay' : 'bg-gold'}`}>
              {badge}
            </div>
          )}

          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-earth hover:text-clay transition-colors shadow-sm">
            <Heart size={18} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-grey-500 text-xs mb-2">
          <span>{origin}</span>
        </div>
        
        <Link to={`/product/${slug}`} className="flex-grow">
          <h3 className="text-earth font-serif text-lg leading-tight group-hover:text-gold transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 my-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill={i < Math.floor(rating) ? "#C9933A" : "transparent"} stroke={i < Math.floor(rating) ? "#C9933A" : "#9E8E78"} />
          ))}
          <span className="text-xs text-grey-500 font-medium ml-1">({rating})</span>
        </div>

        {/* Add to Cart Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-grey-100">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gold">
              £{salePrice && salePrice < price ? salePrice : price}
            </span>
            {salePrice && salePrice < price && (
              <span className="text-sm text-grey-500 line-through">£{price}</span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            className="px-4 py-2 bg-earth hover:bg-gold text-white font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 focus:outline-none"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard

