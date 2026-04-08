import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, Loader2, ArrowLeft, ShoppingBag, ChevronDown } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import { fetchProducts, fetchCategories } from '../services/api'

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const [products, setProducts] = useState<any[]>([])
  const [category, setCategory] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState(200)

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true)
      setError(false)
      try {
        // Fetch all categories to find the current one by slug
        const categories = await fetchCategories()
        const currentCat = categories.find((c: any) => c.slug === categorySlug)
        
        if (!currentCat) {
          setError(true)
          setLoading(false)
          return
        }
        
        setCategory(currentCat)

        // Fetch products for this category
        const productData = await fetchProducts({ 
          category: categorySlug, 
          limit: 100,
          sort: sortBy,
          max_price: priceRange
        })
        setProducts(productData)
      } catch (err) {
        console.error('Failed to load category data', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (categorySlug) {
      loadCategoryData()
    }
  }, [categorySlug, sortBy, priceRange])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-cream">
        <Loader2 size={48} className="text-gold animate-spin" />
        <p className="text-earth font-serif italic text-lg opacity-60">Preparing your artisanal selection...</p>
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 bg-cream text-center px-4">
        <h2 className="text-4xl font-serif font-black text-earth">Category Not Found</h2>
        <p className="text-grey-700 max-w-md">The category you're looking for might have been moved or renamed.</p>
        <Link to="/shop" className="btn-primary flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{category.name} | Kowope Foods</title>
        <meta name="description" content={`Explore our premium selection of ${category.name} at Kowope Foods.`} />
      </Helmet>

      <section className="bg-cream min-h-screen">
        {/* Header / Breadcrumbs */}
        <div className="bg-white border-b border-grey-100 py-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-grey-400 mb-4">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
              <ChevronRight size={12} />
              <span className="text-gold">{category.name}</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-serif font-black text-earth tracking-tighter mb-2 italic">
                  {category.name}
                </h1>
                <p className="text-grey-600 max-w-2xl text-lg font-medium leading-relaxed">
                  {category.description || `Discover the finest ${category.name} sourced directly from heritage producers.`}
                </p>
              </div>
              <div className="bg-gold/5 px-6 py-4 rounded-2xl border border-gold/10 shrink-0">
                 <span className="block text-gold text-2xl font-black">{products.length}</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-earth">Products in Category</span>
              </div>
            </div>
          </div>
        </div>


        {/* Filters & Content Area */}
        <div className="max-w-[1600px] mx-auto py-12 px-4 md:px-8">
          
          {/* Horizontal Filters */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-grey-100 p-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex flex-wrap items-center justify-between gap-8">
              <div className="flex-grow max-w-md">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-grey-400">Filter by Price</h3>
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
                  {`Found ${products.length} artisanal products`}
                </div>
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-32 text-center bg-white rounded-3xl border-2 border-dashed border-grey-200">
               <ShoppingBag size={64} className="mx-auto text-grey-200 mb-6" />
               <h3 className="text-3xl font-serif font-bold text-earth">Coming Soon</h3>
               <p className="text-grey-500 mt-2 text-lg">We're currently stocking up our {category.name} selection. Check back soon!</p>
               <div className="mt-8 flex justify-center gap-4">
                 <button 
                  onClick={() => setPriceRange(500)}
                  className="text-gold font-bold hover:underline"
                 >
                   Reset Price Filter
                 </button>
                 <Link to="/shop" className="bg-gold text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-gold/20 transition-all active:scale-95">
                   Explore other categories
                 </Link>
               </div>
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
        </div>
      </section>
    </>
  )
}

export default CategoryPage
