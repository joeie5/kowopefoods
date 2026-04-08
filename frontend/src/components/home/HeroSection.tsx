import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Truck, CheckCircle, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchCMSSection } from '../../services/api'

const HeroSection = () => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCMSSection('hero')
      .then(res => setData(res.data))
      .catch(err => console.error('Error fetching hero', err))
      .finally(() => setLoading(false))
  }, [])

  const title = data?.title || "The Taste of Home, Delivered to Your Door"
  const subtitle = data?.subtitle || "Premium African groceries, fashion & beauty for the African diaspora. Proudly serving the UK & Europe with authenticity and love."
  const image = data?.image_url || "/hero-products.png"

  return (
    <section className="relative min-h-[600px] lg:h-[calc(100vh-112px)] flex flex-col lg:flex-row overflow-hidden">
      
      {/* Left Panel - 60% */}
      <div className="w-full lg:w-[60%] bg-earth relative flex flex-col justify-center px-6 md:px-12 lg:px-20 py-16 lg:py-0">
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay overflow-hidden">
           <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
             <pattern id="kente" width="50" height="50" patternUnits="userSpaceOnUse">
               <path d="M0 0h50v50H0z" fill="none"/>
               <path d="M0 25h50M25 0v50" stroke="#C9933A" strokeWidth="0.5"/>
               <rect x="5" y="5" width="15" height="15" fill="#C9933A" opacity="0.5"/>
               <rect x="30" y="30" width="15" height="15" fill="#C9933A" opacity="0.3"/>
             </pattern>
             <rect width="100%" height="100%" fill="url(#kente)"/>
           </svg>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={!loading ? { opacity: 1, y: 0 } : {}}
           className="relative z-10 space-y-6 max-w-2xl"
        >
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] font-serif">
            {title.includes(',') ? title.split(',')[0] : title}, <br />
            <span className="text-gold">
              {title.includes(',') ? (title.split(',')[1] || "Delivered") : "Quality"}
            </span>
          </h1>

          <p className="text-grey-200 text-lg md:text-xl font-sans max-w-xl leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button className="btn-primary flex items-center justify-center gap-2 group">
              {data?.cta_text || "Shop Now"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-secondary border-cream text-cream hover:bg-cream/10">
              Explore Categories
            </button>
          </div>

          <div className="flex flex-wrap gap-6 pt-10 text-gold-light text-xs md:text-sm font-semibold uppercase tracking-widest items-center">
            <div className="flex items-center gap-2"><Truck size={18} /> Fast UK Delivery</div>
            <div className="flex items-center gap-2"><CheckCircle size={18} /> 100% Authentic</div>
            <div className="flex items-center gap-2"><Star size={18} fill="#E8B96A" /> 4.9 Rated</div>
          </div>
        </motion.div>

        {/* Floating Product Card */}
        <Link to="/product/mama-gold-rice">
          <motion.div
             animate={{ y: [0, -12, 0] }}
             transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
             className="hidden md:absolute bottom-12 right-12 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 shadow-2xl hover:bg-white/20 transition-all cursor-pointer"
          >
             <div className="w-16 h-16 bg-cream rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
               <span className="text-2xl">🍚</span>
             </div>
             <div>
               <h4 className="text-white font-serif text-lg leading-none">Mama Gold Rice</h4>
               <p className="text-gold font-bold text-sm">£18.99</p>
             </div>
          </motion.div>
        </Link>
      </div>

      {/* Right Panel - 40% */}
      <div className="w-full lg:w-[40%] relative min-h-[400px] lg:min-h-0 bg-grey-200">
        <motion.img 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          src={image}
          alt="African Food Market"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-8 left-0 -translate-x-1/2 hidden xl:flex bg-gold p-6 rounded-card shadow-hover flex-col items-center justify-center text-white">
           <span className="text-3xl font-bold font-serif leading-none">500+</span>
           <span className="text-xs uppercase tracking-widest font-semibold opacity-90 mt-1">Products</span>
        </div>
        <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full p-4 w-28 h-28 flex items-center justify-center text-center text-xs font-bold uppercase tracking-tighter leading-tight rotate-12 shadow-lg">
           New Arrivals <br /> ✦
        </div>
      </div>
    </section>
  )
}

export default HeroSection
