import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../ui/ProductCard'
import { fetchFeaturedProducts, fetchProducts } from '../../services/api'

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState<'Featured' | 'New Arrivals' | 'On Sale'>('Featured')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        let res = await fetchFeaturedProducts()
        if (!res || res.length === 0) {
          // Fallback to latest products if none are explicitly featured
          res = await fetchProducts({ limit: 12, sort: 'newest' })
        }
        setProducts(res)
      } catch (err) {
        console.error('Error fetching products', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredProducts = products.filter(p => {
    if (activeTab === 'On Sale') return p.sale_price !== null;
    if (activeTab === 'New Arrivals') return p.is_new_arrival;
    return true; // Featured shows all for demo
  })

  return (
    <section className="mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-end mb-6 gap-4 border-b border-grey-100 pb-3">
        <div>
          <h2 className="text-xl font-bold text-earth border-l-4 border-gold pl-3">Featured Products</h2>
        </div>
        
        <div className="flex gap-4">
          {['Featured', 'New Arrivals', 'On Sale'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`text-xs md:text-sm font-semibold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-gold' : 'text-grey-500 hover:text-earth'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="tab-underline" className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-[300px]">
          {loading ? (
             <div className="flex items-center justify-center h-64 text-grey-500 italic">Curating your selection...</div>
          ) : (
            <motion.div 
               layout
               className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.slice(0, 6).map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard 
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={product.price}
                      salePrice={product.sale_price}
                      image={product.images?.[0] || 'https://via.placeholder.com/500'}
                      origin={product.country_of_origin}
                      rating={product.rating_average}
                      badge={product.sale_price ? 'Sale' : product.is_new_arrival ? 'New' : undefined}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
      </div>
    </section>
  )
}

export default FeaturedProducts
