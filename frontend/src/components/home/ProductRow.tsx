import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProductCard from '../ui/ProductCard'
import { fetchProducts } from '../../services/api'
import { ArrowRight } from 'lucide-react'

interface ProductRowProps {
  title: string
  categoryId?: number | string
  limit?: number
}

const ProductRow = ({ title, categoryId, limit = 6 }: ProductRowProps) => {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const params: any = { limit: limit }
        if (typeof categoryId === 'string') {
          params.category = categoryId
        } else if (typeof categoryId === 'number') {
          params.category_id = categoryId
        }

        let res = await fetchProducts(params)
        let data = res.items || res
        
        if (!data || data.length === 0) {
           // Fallback if category is empty
           res = await fetchProducts({ limit: limit })
           data = res.items || res
        }
        
        setProducts(data)
      } catch (err) {
        console.error(`Error fetching products for ${title}`, err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [categoryId, limit, title])

  if (!loading && products.length === 0) return null

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8 border-b border-grey-100 pb-4">
        <div>
          <h2 className="text-3xl font-serif text-earth">{title}</h2>
          <div className="w-16 h-1 rounded-full bg-gold mt-2"></div>
        </div>
        <Link to={`/shop${categoryId ? `?category=${categoryId}` : ''}`} className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold hover:text-earth transition-colors">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      <div className="relative min-h-[300px]">
        {loading ? (
             <div className="flex justify-center items-center h-64 text-grey-500 italic">Curating {title}...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {products.slice(0, limit).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductRow
