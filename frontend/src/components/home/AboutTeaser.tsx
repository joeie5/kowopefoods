import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const AboutTeaser = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Column - Image Container */}
        <div className="w-full lg:w-1/2 relative group">
          <div className="relative z-10 rounded-card overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1000" 
              alt="Authentic African Cooking" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/20 rounded-card -z-10 animate-pulse"></div>
          <div className="absolute top-12 -left-12 hidden lg:flex bg-earth p-8 rounded-card shadow-2xl flex-col items-center justify-center text-gold border border-gold/20">
             <span className="text-4xl font-bold font-serif leading-none">5+</span>
             <span className="text-[10px] uppercase tracking-widest font-semibold mt-2 text-center leading-tight">Years Serving<br />The Diaspora</span>
          </div>
        </div>

        {/* Right Column - Text Content */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="space-y-4">
             <span className="text-gold font-sans text-xs font-bold uppercase tracking-[0.3em]">Our Story</span>
             <h2 className="text-4xl md:text-5xl font-serif text-earth leading-[1.2]">
               Bringing the Heart of Africa <br />
               to Your Global Kitchen.
             </h2>
             <div className="w-20 h-1 bg-gold rounded-full"></div>
          </div>
          
          <div className="space-y-6 text-grey-500 text-lg font-sans leading-relaxed">
            <p>
              Growing up, we remember the vibrant markets, the aroma of spices wafting through the air, and the sheer joy of a meal that felt like home. 
              Kowope Foods was born out of that very nostalgia—a mission to bridge the gap for Africans in the diaspora.
            </p>
            <p>
              We don't just sell groceries; we deliver heritage. From the finest parboiled rice to hand-picked spices and authentic Ankara fabrics, 
              we source everything directly from local African farmers and artisans to ensure your kitchen remains a piece of the motherland.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-10 pt-4">
            <div className="text-center sm:text-left">
               <span className="block text-3xl font-bold font-serif text-earth leading-none">2,000+</span>
               <span className="text-xs uppercase tracking-widest font-semibold text-grey-500 mt-2 block">Happy Customers</span>
            </div>
            <div className="w-px h-12 bg-grey-200 hidden sm:block"></div>
            <div className="text-center sm:text-left">
               <span className="block text-3xl font-bold font-serif text-earth leading-none">500+</span>
               <span className="text-xs uppercase tracking-widest font-semibold text-grey-500 mt-2 block">Authentic Products</span>
            </div>
          </div>

          <Link to="/about" className="inline-block btn-secondary mt-4 group">
            Read Our Full Journey <motion.span className="inline-block" whileHover={{ x: 5 }}>→</motion.span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AboutTeaser
