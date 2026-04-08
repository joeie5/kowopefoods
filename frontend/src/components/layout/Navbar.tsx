import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, Menu, X, ChevronDown, Phone } from 'lucide-react'
import { useCartStore } from '../../store/useStore'
import { fetchCategories, fetchNavLinks, fetchCMSSection } from '../../services/api'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [navLinks, setNavLinks] = useState<any[]>([])
  const [siteSettings, setSiteSettings] = useState<any>(null)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const location = useLocation()
  
  const cart = useCartStore((state) => state.cart)
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, links, settings] = await Promise.all([
          fetchCategories(),
          fetchNavLinks(),
          fetchCMSSection('site_settings')
        ])
        setCategories(cats)
        setNavLinks([...links].sort((a: any, b: any) => a.display_order - b.display_order))
        if(settings?.data) {
          setSiteSettings(settings.data)
        }
      } catch (err) {
        console.error('Failed to load data in navbar', err)
      }
    }
    loadData()
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'shadow-lg bg-white/90 backdrop-blur-lg' : 'shadow-sm bg-white'}`}>
      {/* Top Bar */}
      <div className={`bg-earth text-gold px-4 flex justify-between items-center text-[10px] md:text-xs font-sans uppercase tracking-[0.15em] transition-all duration-500 overflow-hidden ${isScrolled ? 'h-0 py-0 opacity-0' : 'h-9 py-2 opacity-100'}`}>
        <div className="flex items-center gap-2">
          <span>Free delivery on orders over £60</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4">
             <select className="bg-transparent border-none focus:ring-0 cursor-pointer">
               <option className="bg-earth">£ GBP</option>
               <option className="bg-earth">$ USD</option>
               <option className="bg-earth">₦ NGN</option>
             </select>
          </div>
          <a href="https://wa.me/yournumber" className="flex items-center gap-1 hover:text-white transition-colors">
            <Phone size={14} /> WhatsApp
          </a>
        </div>
      </div>      {/* Main Navbar */}
      <nav className={`border-b border-grey-100/50 px-4 md:px-8 flex justify-between items-center transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 transition-all duration-300 hover:scale-[1.03] active:scale-95 group">
          {siteSettings?.logo_url ? (
            <img src={siteSettings.logo_url} alt="Kowope Foods Logo" className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="bg-gold p-2 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-gold/20 transition-all shrink-0">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform duration-500">
                 <path d="M12 2L2 7l10 10 10-10-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
               </svg>
            </div>
          )}
          <span className="text-2xl md:text-3xl font-serif font-black text-earth tracking-tighter transition-all">
            {siteSettings?.site_name ? siteSettings.site_name.replace(' Foods', '') : 'Kowope'}<span className="text-gold">{siteSettings?.site_name && siteSettings.site_name.includes(' Foods') ? 'Foods' : ''}</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-4">
          {navLinks.map((link) => {
            if (link.name.toLowerCase() === 'categories') {
              return (
                <div 
                  key="categories-dropdown"
                  className="relative group cursor-pointer flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.2em] text-earth px-4 py-2 hover:text-gold transition-colors"
                  onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                  onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                >
                   {link.name} <ChevronDown size={12} className={`transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                   
                   {/* Mega Dropdown / Detailed Dropdown */}
                   {isCategoryDropdownOpen && (
                     <div className="absolute top-full left-0 w-64 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-grey-100 py-4 animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                       <div className="px-6 pb-2 mb-2 border-b border-grey-100">
                         <span className="text-[10px] font-black uppercase tracking-widest text-grey-400">Discover Heritage</span>
                       </div>
                       {categories.map((cat) => (
                         <Link 
                          key={cat.id}
                          to={`/category/${cat.slug}`}
                          className="flex items-center justify-between px-6 py-3 hover:bg-gold/5 text-earth hover:text-gold transition-all group/item"
                          onClick={() => setIsCategoryDropdownOpen(false)}
                         >
                           <span className="font-bold tracking-tight">{cat.name}</span>
                           <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover/item:opacity-100 transition-all translate-x-[-4px] group-hover/item:translate-x-0" />
                         </Link>
                       ))}
                       <div className="mt-2 pt-2 border-t border-grey-100">
                         <Link to="/shop" className="px-6 py-2 text-[10px] font-black text-gold hover:underline">View All Products</Link>
                       </div>
                     </div>
                   )}
                </div>
              )
            }
            return (
              <Link 
                key={link.path}
                to={link.path} 
                className={`relative px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 group
                  ${location.pathname === link.path ? 'text-gold' : 'text-earth hover:text-gold'}`}
              >
                <span className="relative z-10">{link.name}</span>
                <span className={`absolute bottom-0 left-1/2 h-[3px] bg-gold rounded-full transition-all duration-500 -translate-x-1/2
                  ${location.pathname === link.path ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-100'}`}></span>
              </Link>
            )
          })}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1 md:gap-3">
          <button className="p-2.5 hover:bg-gold/5 text-earth hover:text-gold rounded-2xl transition-all duration-300 flex items-center gap-2 group">
            <Search size={22} strokeWidth={2.5} />
            <span className="hidden xl:inline text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Search</span>
          </button>
          
          <Link to="/cart" className="p-2.5 hover:bg-gold/5 text-earth hover:text-gold rounded-2xl transition-all duration-300 flex items-center gap-2 group relative">
            <div className="relative">
              <ShoppingCart size={22} strokeWidth={2.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-clay text-white text-[10px] font-black min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full border-2 border-white shadow-md animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="hidden xl:inline text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Cart</span>
          </Link>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden p-2.5 hover:bg-gold/5 text-earth hover:text-gold rounded-2xl transition-all ml-1"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 bg-white/95 backdrop-blur-xl z-[60] overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-end p-6">
            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full bg-grey-100">
              <X size={32} />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            {navLinks.map((link) => {
              if (link.name.toLowerCase() === 'categories') {
                return (
                  <div key="categories-mobile" className="flex flex-col items-center w-full">
                    <div className="w-full h-px bg-grey-100 my-2" />
                    <span className="text-xs font-black uppercase tracking-widest text-grey-400 mt-4 mb-4">{link.name}</span>
                    <div className="grid grid-cols-1 gap-4 text-center">
                      {categories.map((cat) => (
                        <Link 
                          key={cat.id}
                          to={`/category/${cat.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-2xl font-serif font-bold text-earth hover:text-gold transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                    <div className="w-full h-px bg-grey-100 my-4" />
                  </div>
                )
              }
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-4xl font-serif font-black tracking-tighter hover:text-gold transition-colors
                    ${location.pathname === link.path ? 'text-gold' : 'text-earth'}`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
