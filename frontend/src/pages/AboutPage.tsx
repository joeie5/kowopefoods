import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Users, Globe, Heart, ShieldCheck } from 'lucide-react'

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>Our Story | Kowope Foods - Premium African Diaspora E-commerce</title>
      </Helmet>

      <section className="bg-cream py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Hero Story Section */}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 space-y-8">
               <span className="text-gold font-sans text-xs font-bold uppercase tracking-[0.4em]">Our Journey</span>
               <h1 className="text-5xl md:text-7xl font-serif text-earth font-bold leading-tight italic">Born from Nostalgia, Driven by <span className="text-gold">Authenticity.</span></h1>
               <div className="w-32 h-1 bg-gold rounded-full"></div>
               <p className="text-grey-700 text-lg md:text-xl font-sans leading-relaxed">
                  Kowope Foods was founded in 2020 with a single goal: to provide Africans in the diaspora with the same quality of products they remember from home. What started as a small personal sourcing project has grown into a premium destination for the community across the UK and Europe.
               </p>
            </div>
            <div className="w-full lg:w-1/2 rounded-card overflow-hidden shadow-2xl relative">
               <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1000" alt="Cooking authentic African food" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gold/10 opacity-50 mix-blend-overlay"></div>
            </div>
          </div>

          {/* Pillars Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-24 border-t border-grey-200">
             {[
               { icon: <Globe size={40} className="text-gold" />, title: 'Direct Sourcing', desc: 'We work directly with local farmers and spice masters across West, East, and South Africa.' },
               { icon: <Heart size={40} className="text-gold" />, title: 'Community First', desc: 'Built by the diaspora, for the diaspora. We understand the value of a true taste of home.' },
               { icon: <ShieldCheck size={40} className="text-gold" />, title: 'Premium Quality', desc: 'Every product is hand-checked for authenticity and freshness before it reaches your door.' },
               { icon: <Users size={40} className="text-gold" />, title: 'Family Legacy', desc: 'We are a family-owned business committed to preserving African heritage through food and fabric.' }
             ].map((p, i) => (
                <div key={i} className="text-center space-y-4">
                   <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-card mx-auto group-hover:scale-110 transition-transform">
                      {p.icon}
                   </div>
                   <h3 className="text-2xl font-serif font-bold text-earth">{p.title}</h3>
                   <p className="text-grey-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
             ))}
          </div>

          {/* Mission & Vision Callout */}
          <div className="bg-earth p-16 md:p-24 rounded-card text-center text-white space-y-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="max-w-3xl mx-auto space-y-8 relative z-10"
             >
                <h2 className="text-4xl md:text-6xl font-serif font-bold italic leading-tight">"Our mission is to bridge the thousands of miles between you and the motherland, one package at a time."</h2>
                <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
                <p className="text-grey-200 text-xl font-sans font-light">
                   We believe that food and fashion are the most powerful ways to stay connected to our roots. Every order from Kowope Foods is a celebration of African culture.
                </p>
             </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
