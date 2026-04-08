import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fetchCategories, fetchCMSSection } from '../../services/api'
import { ArrowRight } from 'lucide-react'

const CategoryShowcase = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [cmsData, setCmsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, cmsRes] = await Promise.all([
          fetchCategories(),
          fetchCMSSection('categories_showcase')
        ])
        setCategories(catRes)
        setCmsData(cmsRes.data)
      } catch (err) {
        console.error('Error fetching categories showcase data', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const title = cmsData?.title || "Browse Our Heritage"
  const subtitle = cmsData?.subtitle || "From everyday essentials to celebratory treats, find everything you miss from home."

  return (
    <section className="py-24 px-4 md:px-8 bg-cream relative overflow-hidden">
      {/* Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      
      <div className="w-full px-4 md:px-8 mx-auto relative z-10 w-full">
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-earth font-bold italic"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-grey-700 max-w-2xl mx-auto text-lg"
          >
            {subtitle}
          </motion.p>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-24 h-1.5 bg-gold mx-auto rounded-full origin-center"
          ></motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {(loading ? Array(6).fill({}) : categories).slice(0, 6).map((cat, index) => {
            const uploadedVector = cmsData?.vector_mapping?.[cat.id]
            const vectorUrl = uploadedVector || cat.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'
            const displayName = cmsData?.name_mapping?.[cat.id] || cat.name || 'Loading...'
            const isVector = !!uploadedVector
            
            return (
              <motion.div
                key={cat.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative cursor-pointer"
              >
                <Link to={`/category/${cat.slug}`} className="block text-center flex flex-col items-center">
                  <div className={`w-32 h-32 md:w-40 md:h-40 xl:w-44 xl:h-44 rounded-full shadow-sm border border-grey-200 group-hover:border-gold/40 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 flex items-center justify-center mb-5 overflow-hidden relative mx-auto ${isVector ? 'bg-[#FDF9F1] p-6 md:p-8' : 'bg-grey-100 p-0'}`}>
                    <img 
                      src={vectorUrl} 
                      alt={displayName} 
                      className={`w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out ${isVector ? 'object-contain drop-shadow-sm' : 'object-cover'}`}
                    />
                  </div>
                  <h3 className="text-earth font-serif text-lg md:text-xl font-bold group-hover:text-gold transition-colors leading-tight px-1">{displayName}</h3>
                  <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 text-gold text-[10px] font-bold uppercase tracking-widest mt-2 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                     Explore <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
