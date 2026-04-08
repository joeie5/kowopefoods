import React from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

const Newsletter = () => {
  return (
    <section className="bg-earth py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-clay/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="space-y-4">
             <span className="text-gold font-sans text-xs font-bold uppercase tracking-[0.4em]">Get Recipes & Rewards</span>
             <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-tight">
               Stay Connected to the <br />
               <span className="text-gold italic font-medium">Motherland.</span>
             </h2>
             <p className="text-grey-200 text-lg md:text-xl font-sans max-w-2xl mx-auto leading-relaxed">
               Get authentic recipes, new product alerts & exclusive offers for the African diaspora community. 
               Join 5,000+ members today.
             </p>
          </div>

          <form className="flex flex-col sm:flex-row items-center gap-4 mt-12 max-w-2xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full bg-white/5 border border-white/20 text-white placeholder:text-grey-500 px-6 py-4 rounded-btn focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              required
            />
            <button className="w-full sm:w-auto btn-primary whitespace-nowrap flex items-center justify-center gap-2 group">
              Join the Family <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>

          <p className="text-grey-500 text-xs mt-6 tracking-wide">
             No spam. We respect your privacy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter
