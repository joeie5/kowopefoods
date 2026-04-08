import React from 'react'
import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'

const testimonials = [
  { 
    name: 'Amara O.', 
    location: 'London, UK', 
    text: "Finally, a place where I can get my authentic Ogbono and Egusi without any hassle. The delivery was super fast, and the quality is exactly like what I'd buy back home in Lagos. Highly recommended!",
    rating: 5
  },
  { 
    name: 'Kofi B.', 
    location: 'Manchester, UK', 
    text: "I was looking for real Kente fabric for my sister's wedding and found it here. The prints are stunning and the fabric quality is top-notch. Kowope Foods is now my one-stop shop for everything African.",
    rating: 5
  },
  { 
    name: 'Zainab M.', 
    location: 'Birmingham, UK', 
    text: "Being away from home is hard, but the tastes and smells from the groceries I ordered made it easier. The packaging was neat, and everything was fresh. Thank you Kowope Foods!",
    rating: 5
  },
]

const Testimonials = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-earth mb-4">What Our Customers Say</h2>
          <p className="text-grey-500 font-sans text-sm uppercase tracking-widest font-semibold">
            Rated 4.9 <Star size={14} className="inline-block text-gold fill-gold mb-1" /> by over 2,000 customers
          </p>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-card shadow-card relative border border-grey-100 flex flex-col justify-between"
            >
              <div className="absolute top-6 right-8 text-gold-light opacity-30">
                <Quote size={48} />
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} fill={j < t.rating ? "#C9933A" : "transparent"} stroke="#C9933A" />
                  ))}
                </div>
                <p className="text-grey-700 italic font-sans leading-relaxed text-lg">
                   "{t.text}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-grey-100 flex items-center gap-4">
                 <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center font-serif text-gold font-bold text-xl">
                    {t.name[0]}
                 </div>
                 <div>
                    <h4 className="text-earth font-bold font-sans">{t.name}</h4>
                    <p className="text-grey-500 text-xs uppercase tracking-widest">{t.location}</p>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
