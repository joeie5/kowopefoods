import React from 'react'
import { motion } from 'framer-motion'
import { Truck, ShieldCheck, Globe, MessageCircle } from 'lucide-react'

const features = [
  { 
    icon: <Truck className="text-gold" size={32} />, 
    title: 'Fast UK Delivery', 
    desc: 'Next-day & same-week delivery options across mainland UK.' 
  },
  { 
    icon: <Globe className="text-gold" size={32} />, 
    title: '100% Authentic', 
    desc: 'Sourced directly from African suppliers and farmers.' 
  },
  { 
    icon: <ShieldCheck className="text-gold" size={32} />, 
    title: 'Secure Checkout', 
    desc: 'SSL-encrypted payments via Stripe & local options.' 
  },
  { 
    icon: <MessageCircle className="text-gold" size={32} />, 
    title: 'African-Owned', 
    desc: 'Built by and for the African diaspora community.' 
  },
]

const WhyUsSection = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-cream border-y border-grey-100">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {features.map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center group"
          >
            <div className="mb-6 p-5 bg-white rounded-full shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              {f.icon}
            </div>
            <h3 className="text-xl font-serif font-bold text-earth mb-2">{f.title}</h3>
            <p className="text-grey-500 text-sm leading-relaxed max-w-[240px]">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default WhyUsSection
