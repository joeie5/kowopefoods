import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Edit, FileText, Star, Mail, Settings, LogOut, Search, Bell, Menu } from 'lucide-react'

const AdminLayout = () => {
  const location = useLocation()
  
  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Navigation', path: '/admin/navigation', icon: <Menu size={20} /> },
    { label: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { label: 'Categories', path: '/admin/categories', icon: <FolderTree size={20} /> },
    { label: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { label: 'CMS Editor', path: '/admin/cms', icon: <Edit size={20} /> },
    { label: 'Blog', path: '/admin/blog', icon: <FileText size={20} /> },
    { label: 'Testimonials', path: '/admin/testimonials', icon: <Star size={20} /> },
    { label: 'Newsletter', path: '/admin/newsletter', icon: <Mail size={20} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ]

  return (
    <div className="flex h-screen bg-grey-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-earth text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
           <div className="bg-gold p-1.5 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L2 7l10 10 10-10-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
           </div>
           <span className="text-xl font-serif font-bold tracking-tight">Kowope Foods Admin</span>
        </div>

        <nav className="flex-grow p-6 space-y-2 overflow-y-auto scrollbar-hide">
           {menuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-4 px-4 py-3 rounded-btn text-sm font-semibold transition-all ${location.pathname === item.path ? 'bg-gold text-white shadow-lg' : 'text-grey-500 hover:text-white hover:bg-white/5'}`}
              >
                {item.icon} {item.label}
              </Link>
           ))}
        </nav>

        <div className="p-6 border-t border-white/5">
           <Link to="/admin/login" className="flex items-center gap-4 px-4 py-3 text-sm font-semibold text-clay hover:text-white hover:bg-clay/10 rounded-btn transition-all">
              <LogOut size={20} /> Logout
           </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-grey-200 px-8 flex items-center justify-between shadow-sm relative z-10">
           <div className="flex items-center gap-4 bg-grey-100 px-4 py-2 rounded-btn w-96 border border-grey-200">
              <Search size={18} className="text-grey-500" />
              <input type="text" placeholder="Search orders, products..." className="bg-transparent text-sm w-full focus:outline-none" />
           </div>

           <div className="flex items-center gap-6">
              <button className="relative p-2 text-grey-500 hover:text-earth transition-colors">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-clay rounded-full border-2 border-white"></span>
              </button>
              <div className="w-px h-6 bg-grey-200"></div>
              <div className="flex items-center gap-3 cursor-pointer group">
                 <div className="w-9 h-9 bg-gold rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-md">A</div>
                 <span className="text-sm font-bold text-earth group-hover:text-gold transition-colors">Admin User</span>
              </div>
           </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-grow overflow-y-auto p-8 bg-cream/30">
           <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
