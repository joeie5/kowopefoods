import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Star, Truck, ShieldCheck, CheckCircle, ChevronRight, Minus, Plus, ShoppingBag, Loader2, ArrowLeft } from 'lucide-react'
import { fetchProductBySlug } from '../services/api'
import { useCartStore } from '../store/useStore'
import { toast } from 'react-hot-toast'

const ProductDetailPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('Description')
  const [mainImage, setMainImage] = useState('')
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  
  const addToCart = useCartStore((state) => state.addToCart)

  useEffect(() => {
    const loadProduct = async () => {
      if (!productSlug) return
      setLoading(true)
      setError(false)
      try {
        const data = await fetchProductBySlug(productSlug)
        setProduct(data)
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0])
        } else {
          setMainImage('https://placehold.co/600x600?text=Kowope+Foods')
        }
      } catch (err) {
        console.error('Failed to load product', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
    // Scroll to top when slug changes
    window.scrollTo(0, 0)
  }, [productSlug])

  const handleAddToCart = () => {
    const price = (product.sale_price || product.price) + (selectedVariant?.price_modifier || 0)
    
    addToCart({
      id: product.id,
      name: selectedVariant ? `${product.name} (${selectedVariant.label})` : product.name,
      price: price,
      image: mainImage,
      slug: product.slug,
      variant: selectedVariant?.label
    }, quantity)
    
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: '#1A0A00',
        color: '#FAF5EE',
        borderRadius: '12px',
        border: '1px solid #C9933A'
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
        <p className="text-earth font-serif text-xl animate-pulse">Gathering details...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-serif text-earth font-bold mb-4">Product Not Found</h1>
        <p className="text-grey-600 mb-8 max-w-md">We couldn't find the product you're looking for. It might have been moved or removed from our catalog.</p>
        <Link to="/shop" className="btn-primary px-8">Return to Shop</Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | Kowope Foods</title>
      </Helmet>

      <div className="bg-cream min-h-screen py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-grey-500 mb-8">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <ChevronRight size={14} />
            {product.category && (
              <>
                <Link to={`/category/${product.category.slug}`} className="hover:text-gold transition-colors">
                  {product.category.name}
                </Link>
                <ChevronRight size={14} />
              </>
            )}
            <span className="text-earth line-clamp-1">{product.name}</span>
          </nav>

          {/* Product Hero */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Gallery */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="aspect-square bg-white rounded-3xl overflow-hidden shadow-card border border-grey-100 group">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-zoom-in" 
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img: string, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => setMainImage(img)} 
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${mainImage === img ? 'border-gold shadow-md' : 'border-transparent hover:border-gold/50'}`}
                    >
                      <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="space-y-4">
                 <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      {product.country_of_origin} Sourced
                    </span>
                    {product.is_new_arrival && (
                      <span className="bg-green-600/10 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        New Arrival
                      </span>
                    )}
                    {product.is_best_seller && (
                      <span className="bg-clay/10 text-clay px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Best Seller
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      product.stock_quantity > 0 
                        ? (product.stock_quantity < 10 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700')
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.stock_quantity > 0 
                        ? (product.stock_quantity < 10 ? `Low Stock: ${product.stock_quantity} Left` : 'In Stock')
                        : 'Out of Stock'}
                    </span>
                 </div>
                <h1 className="text-4xl md:text-5xl font-serif text-earth font-bold leading-tight">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < Math.floor(product.rating_average) ? "#C9933A" : "transparent"} 
                        stroke="#C9933A" 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-grey-500">({product.review_count || 0} verified reviews)</span>
                </div>
              </div>

              <div className="flex items-end gap-4">
                  <span className="text-4xl font-bold text-gold">
                    £{((product.sale_price || product.price) + (selectedVariant?.price_modifier || 0)).toFixed(2)}
                  </span>
                  {product.sale_price && !selectedVariant && (
                     <>
                       <span className="text-xl text-grey-500 line-through mb-1">£{product.price.toFixed(2)}</span>
                       <span className="bg-clay text-white text-[10px] font-bold uppercase px-2 py-1 rounded translate-y-[-12px]">
                         Save £{(product.price - product.sale_price).toFixed(2)}
                       </span>
                     </>
                  )}
               </div>

              <p className="text-grey-700 text-lg leading-relaxed max-w-xl">
                  {product.short_description}
               </p>

               {/* Variants */}
               {product.variants && product.variants.length > 0 && (
                 <div className="space-y-4 pt-4">
                   <span className="text-xs font-bold uppercase tracking-widest text-earth">Select Option</span>
                   <div className="flex flex-wrap gap-3">
                     {product.variants.map((v: any, i: number) => (
                       <button
                         key={i}
                         onClick={() => setSelectedVariant(v)}
                         className={`px-4 py-2 rounded-xl border-2 transition-all font-semibold text-sm ${
                           selectedVariant?.label === v.label 
                             ? 'border-gold bg-gold/5 text-gold shadow-md' 
                             : 'border-grey-100 bg-white text-grey-600 hover:border-gold/30'
                         }`}
                       >
                         {v.label}
                         {v.price_modifier > 0 && ` (+£${v.price_modifier.toFixed(2)})`}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-6">
                   <div className="flex items-center border border-grey-200 rounded-xl bg-white shadow-sm">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="p-3 hover:bg-grey-50 transition-colors rounded-l-xl border-r border-grey-100"
                      >
                        <Minus size={18} />
                      </button>
                      <input 
                        type="number" 
                        value={quantity} 
                        readOnly 
                        className="w-12 text-center font-bold text-earth bg-transparent focus:outline-none" 
                      />
                      <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        className="p-3 hover:bg-grey-50 transition-colors rounded-r-xl border-l border-grey-100"
                      >
                        <Plus size={18} />
                      </button>
                   </div>
                   <button 
                     onClick={handleAddToCart}
                     className="flex-grow bg-earth hover:bg-gold text-white font-bold rounded-xl flex items-center justify-center gap-3 py-4 shadow-xl active:scale-95 transition-all group"
                   >
                      <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform" /> Add to Cart
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-grey-200">
                 <div className="flex items-center gap-3 text-[10px] font-bold text-grey-700 uppercase tracking-widest">
                    <Truck size={18} className="text-gold" /> Fast Delivery
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-bold text-grey-700 uppercase tracking-widest">
                    <ShieldCheck size={18} className="text-gold" /> Secure Payment
                 </div>
                 <div className="flex items-center gap-3 text-[10px] font-bold text-grey-700 uppercase tracking-widest">
                    <CheckCircle size={18} className="text-gold" /> 100% Authentic
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-24 bg-white rounded-3xl shadow-card p-8 md:p-12 border border-grey-100">
            <div className="flex flex-wrap gap-8 md:gap-12 border-b border-grey-100 mb-10 overflow-x-auto scrollbar-hide">
              {['Description', 'Specifications', 'Reviews'].map((tab) => (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab)} 
                   className={`pb-4 text-xs font-bold uppercase tracking-widest relative transition-all ${activeTab === tab ? 'text-gold' : 'text-grey-500'}`}
                 >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-gold rounded-full"></div>}
                 </button>
              ))}
            </div>

            <div className="max-w-4xl prose prose-gold flex flex-col gap-6">
               {activeTab === 'Description' && (
                 <div 
                   dangerouslySetInnerHTML={{ __html: product.full_description_html }} 
                   className="text-grey-700 leading-relaxed text-lg" 
                 />
               )}
                {activeTab === 'Specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-6 bg-cream/50 rounded-2xl border border-gold/10 flex items-start gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gold/5">
                          <Tag size={20} className="text-gold" />
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-grey-500 font-bold mb-1">SKU</span>
                          <span className="text-earth font-bold font-mono text-lg">{product.sku}</span>
                        </div>
                     </div>
                     <div className="p-6 bg-cream/50 rounded-2xl border border-gold/10 flex items-start gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gold/5">
                          <Truck size={20} className="text-gold" />
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-grey-500 font-bold mb-1">Origin</span>
                          <span className="text-earth font-bold text-lg">{product.country_of_origin}</span>
                        </div>
                     </div>
                     <div className="p-6 bg-cream/50 rounded-2xl border border-gold/10 flex items-start gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gold/5">
                          <ShoppingBag size={20} className="text-gold" />
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-grey-500 font-bold mb-1">Category</span>
                          <span className="text-earth font-bold text-lg">{product.category?.name || 'N/A'}</span>
                        </div>
                     </div>
                     <div className="p-6 bg-cream/50 rounded-2xl border border-gold/10 flex items-start gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm border border-gold/5">
                          <ShieldCheck size={20} className="text-gold" />
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-grey-500 font-bold mb-1">Weight</span>
                          <span className="text-earth font-bold text-lg">
                            {product.weight_grams >= 1000 
                              ? `${(product.weight_grams / 1000).toFixed(1)}kg` 
                              : `${product.weight_grams}g`}
                          </span>
                        </div>
                     </div>
                     
                     {product.dietary_tags && product.dietary_tags.length > 0 && (
                       <div className="md:col-span-2 p-6 bg-cream/50 rounded-2xl border border-gold/10 flex flex-col gap-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle size={20} className="text-gold" />
                            <span className="text-xs font-bold uppercase tracking-widest text-earth">Dietary Information</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.dietary_tags.map((tag: string, i: number) => (
                              <span key={i} className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-earth border border-gold/10 shadow-sm flex items-center gap-2">
                                <CheckCircle size={14} className="text-green-600" />
                                {tag}
                              </span>
                            ))}
                          </div>
                       </div>
                     )}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetailPage
