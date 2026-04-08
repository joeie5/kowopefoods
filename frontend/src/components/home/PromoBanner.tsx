import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const PromoBanner = () => {
  return (
    <section className="bg-gold py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
           <span className="text-earth bg-cream/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Limited Time</span>
           <h3 className="text-earth text-xl md:text-2xl font-serif font-bold italic">
             🔥 Summer Sale — Up to 40% off all dried goods and staples.
           </h3>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-earth text-white px-8 py-3 rounded-btn font-semibold flex items-center gap-2 group shadow-lg"
        >
          Shop the Sale <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </section>
  )
}

export default PromoBanner
