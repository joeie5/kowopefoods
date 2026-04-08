import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, Search } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import { fetchProducts, fetchCategories } from '../services/api'

const ShopPage = () => {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState(200)

  const loadCategories = async () => {
    try {
      const data = await fetchCategories()
      setCategories(data)
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      const params: any = {
        limit: 200,
        sort: sortBy,
        max_price: priceRange
      }
      if (activeCategory) params.category = activeCategory

      const data = await fetchProducts(params)
      setProducts(data)
      // Backend doesn't return total count in this simple version, 
      // but let's assume we have it or use list length for now
    } catch (err) {
      console.error('Failed to load products', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [activeCategory, sortBy, priceRange])

  return (
    <>
      <Helmet>
        <title>Shop All | Kowope Foods - Premium African Products</title>
      </Helmet>

      <section className="py-12 px-4 md:px-8 bg-cream min-h-screen">
        <div className="max-w-[1600px] mx-auto text-earth">
          
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-black text-earth italic mb-4">Artisanal Shop</h1>
            <p className="text-grey-600 max-w-2xl mx-auto text-lg">Browse our curated collection of premium African flavors, from heritage staples to modern artisanal creations.</p>
          </div>

          {/* Horizontal Filters Container */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-grey-100 p-8 mb-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Categories Row */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-400">Browse by Category</h3>
                {!activeCategory && <span className="text-[10px] font-bold text-gold bg-gold/5 px-3 py-1 rounded-full uppercase tracking-widest">Showing All</span>}
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-2 
                    ${!activeCategory ? 'bg-earth border-earth text-white shadow-xl shadow-earth/20 scale-105' : 'bg-white border-grey-100 text-earth hover:border-gold hover:text-gold'}`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-2
                      ${activeCategory === cat.slug ? 'bg-earth border-earth text-white shadow-xl shadow-earth/20 scale-105' : 'bg-white border-grey-100 text-earth hover:border-gold hover:text-gold'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Sort Row */}
            <div className="flex flex-wrap items-center justify-between gap-8 pt-6 border-t border-grey-50">
              <div className="flex-grow max-w-md">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-400">Price Range</h3>
                  <span className="text-xs font-bold text-gold">Up to £{priceRange}</span>
                </div>
                <input 
                  type="range" 
                  className="w-full accent-gold h-1.5 bg-grey-100 rounded-lg cursor-pointer" 
                  min="0" 
                  max="500" 
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none flex items-center gap-2 text-sm font-bold text-earth border-2 border-grey-100 pl-6 pr-12 py-3 rounded-2xl hover:border-gold transition-all outline-none bg-white cursor-pointer min-w-[200px]"
                  >
                    <option value="newest">Sort: Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="best_rated">Best Rated</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-grey-400" />
                </div>

                <div className="bg-grey-50 px-6 py-3 rounded-2xl border border-grey-100 italic text-sm font-medium text-grey-500">
                  {loading ? 'Discovering flavors...' : `Found ${products.length} artisanal products`}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid Area */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-white rounded-3xl animate-pulse flex flex-col p-6 space-y-4 shadow-sm border border-grey-100">
                    <div className="flex-grow bg-grey-50 rounded-2xl" />
                    <div className="h-4 bg-grey-50 rounded w-2/3" />
                    <div className="h-4 bg-grey-50 rounded w-1/3" />
                    <div className="h-10 bg-grey-50 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-32 text-center bg-white rounded-3xl border-2 border-dashed border-grey-200">
                <Search size={64} className="mx-auto text-grey-200 mb-6" />
                <h3 className="text-3xl font-serif font-bold text-earth">No match found</h3>
                <p className="text-grey-500 mt-2 text-lg">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={() => { setActiveCategory(null); setPriceRange(500); }}
                  className="mt-8 bg-gold text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-gold/20 transition-all active:scale-95"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {products.map((p) => (
                  <ProductCard 
                    key={p.id} 
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    price={p.price}
                    salePrice={p.sale_price}
                    image={p.images && p.images.length > 0 ? p.images[0] : 'https://placehold.co/600x600?text=Kowope+Foods'}
                    origin={p.country_of_origin}
                    rating={p.rating_average}
                    badge={p.is_new_arrival ? 'New' : p.is_best_seller ? 'Best Seller' : p.sale_price ? 'Sale' : undefined}
                  />
                ))}
              </div>
            )}

            {/* Pagination Placeholder */}
            {products.length >= 24 && (
              <div className="mt-24 flex justify-center gap-3">
                 {[1, 2, 3].map((page, i) => (
                   <button key={i} className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-sm transition-all ${page === 1 ? 'bg-earth text-white shadow-2xl shadow-earth/30 scale-110' : 'bg-white text-earth border-2 border-grey-100 hover:border-gold hover:text-gold'}`}>
                     {page}
                   </button>
                 ))}
                 <div className="flex items-center px-4 font-black text-grey-200 tracking-widest">...</div>
                 <button className="w-14 h-14 rounded-2xl bg-white text-earth border-2 border-grey-100 hover:border-gold hover:text-gold font-bold text-sm transition-all">
                   10
                 </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default ShopPage
