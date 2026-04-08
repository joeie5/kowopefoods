import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories } from '../../services/api'
import { ChevronRight, Menu } from 'lucide-react'

const CategorySidebar = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
      .then(res => setCategories(res))
      .catch(err => console.error('Error fetching categories', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="w-full">
      {/* Mobile Header Toggle */}
      <div className="lg:hidden mb-4">
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full bg-earth text-white p-3 rounded-lg flex items-center justify-between font-bold"
        >
          <span className="flex items-center gap-2"><Menu size={20} /> Browse Categories</span>
          <ChevronRight size={20} className={`transform transition-transform ${mobileOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Sidebar Content */}
      <div className={`bg-white border border-grey-100 rounded-lg shadow-sm overflow-hidden ${mobileOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-earth text-white p-4 hidden lg:block">
          <h3 className="font-bold flex items-center gap-2 uppercase tracking-wide text-sm">
            <Menu size={18} /> Shop by Category
          </h3>
        </div>
        
        <div className="divide-y divide-grey-100">
          {loading ? (
            <div className="p-4 text-grey-500 text-sm italic">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-4 text-grey-500 text-sm italic">No categories found.</div>
          ) : (
            categories.map(cat => (
              <Link 
                to={`/category/${cat.slug}`} 
                key={cat.id}
                className="flex items-center justify-between p-3.5 hover:bg-cream hover:text-gold transition-colors text-earth group"
              >
                <span className="text-sm font-semibold">{cat.name}</span>
                <ChevronRight size={16} className="text-grey-300 group-hover:text-gold transition-colors" />
              </Link>
            ))
          )}
          {/* Static additions for a fuller grocery look if db is sparse */}
          <Link to="/shop" className="flex items-center justify-between p-3.5 hover:bg-cream hover:text-gold transition-colors text-earth group">
            <span className="text-sm font-semibold">Fresh Produce</span>
            <ChevronRight size={16} className="text-grey-300 group-hover:text-gold transition-colors" />
          </Link>
          <Link to="/shop" className="flex items-center justify-between p-3.5 hover:bg-cream hover:text-gold transition-colors text-earth group">
            <span className="text-sm font-semibold">Meat & Poultry</span>
            <ChevronRight size={16} className="text-grey-300 group-hover:text-gold transition-colors" />
          </Link>
          <Link to="/shop" className="flex items-center justify-between p-3.5 hover:bg-cream hover:text-gold transition-colors text-earth group">
            <span className="text-sm font-semibold">Fish & Seafood</span>
            <ChevronRight size={16} className="text-grey-300 group-hover:text-gold transition-colors" />
          </Link>
          <Link to="/shop" className="flex items-center justify-between p-3.5 bg-cream/50 hover:bg-cream hover:text-gold transition-colors text-gold group font-bold">
            <span className="text-sm">View All Special Offers</span>
            <ChevronRight size={16} className="text-gold" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CategorySidebar
