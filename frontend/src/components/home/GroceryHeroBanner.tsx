import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const GroceryHeroBanner = () => {
  return (
    <div className="w-full flex justify-between gap-4 mb-8">
      {/* Main Promo Banner */}
      <div className="relative bg-earth rounded-xl overflow-hidden shadow-sm flex-grow aspect-[21/9] md:aspect-[3/1] lg:aspect-[2.5/1]">
        <img 
          src="https://images.unsplash.com/photo-1543083115-638c32cd3d58?q=80&w=1200" 
          alt="African Groceries"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold font-bold uppercase tracking-widest text-xs md:text-sm mb-2"
          >
            Welcome to Kowope Foods
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-2xl md:text-4xl lg:text-5xl font-serif font-bold max-w-lg leading-tight mb-4"
          >
            Your Authentic African Grocery Store
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-grey-200 text-sm md:text-base max-w-md hidden sm:block mb-6"
          >
            Shop premium foodstuffs, raw ingredients, and everyday essentials delivered across the UK.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/shop" className="bg-gold hover:bg-gold/90 text-white font-bold py-2.5 px-6 rounded-lg inline-flex items-center gap-2 text-sm transition-colors w-max">
              Shop Now <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Side Promos (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col gap-4 w-1/3 shrink-0">
        <Link to="/shop?sale=true" className="relative bg-clay rounded-xl overflow-hidden h-full shadow-sm group">
           <img 
              src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=400" 
              alt="Sale"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
           <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
              <span className="text-white font-bold text-xl leading-tight">Weekend <br/> Deals</span>
              <span className="text-white/80 text-xs mt-1 flex items-center gap-1 group-hover:text-white transition-colors">Up to 30% Off <ArrowRight size={12} /></span>
           </div>
        </Link>
        <Link to="/shop?category=fresh" className="relative bg-[#2C4A3B] rounded-xl overflow-hidden h-full shadow-sm group">
            <img 
              src="https://images.unsplash.com/photo-1595855761331-50e4130f1464?q=80&w=400" 
              alt="Fresh Yams"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
            />
           <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
              <span className="text-white font-bold text-xl leading-tight">Fresh <br/> Produce</span>
              <span className="text-white/80 text-xs mt-1 flex items-center gap-1 group-hover:text-white transition-colors">Newly Arrived <ArrowRight size={12} /></span>
           </div>
        </Link>
      </div>
    </div>
  )
}

export default GroceryHeroBanner
