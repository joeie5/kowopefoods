import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Public Pages
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import BlogListPage from './pages/BlogListPage'
import BlogPostPage from './pages/BlogPostPage'
import CategoryPage from './pages/CategoryPage'

// Admin Pages
import AdminLayout from './components/admin/AdminLayout'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCMSEditor from './pages/admin/AdminCMSEditor'
import AdminCategories from './pages/admin/AdminCategories'
import AdminBlog from './pages/admin/AdminBlog'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminNewsletter from './pages/admin/AdminNewsletter'
import AdminNavigation from './pages/admin/AdminNavigation'
import AdminSettings from './pages/admin/AdminSettings'

const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const App = () => {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login'

  return (
    <div className="font-sans text-earth selection:bg-gold/30">
      <ScrollToTop />
      <Toaster position="top-right" toastOptions={{ className: 'rounded-xl font-bold text-sm shadow-xl' }} />
      
      {!isAdmin && location.pathname !== '/admin/login' && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route path="/product/:productSlug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
           <Route path="dashboard" element={<AdminDashboard />} />
           <Route path="products" element={<AdminProducts />} />
           <Route path="categories" element={<AdminCategories />} />
           <Route path="orders" element={<AdminOrders />} />
           <Route path="cms" element={<AdminCMSEditor />} />
           <Route path="blog" element={<AdminBlog />} />
           <Route path="testimonials" element={<AdminTestimonials />} />
           <Route path="newsletter" element={<AdminNewsletter />} />
           <Route path="navigation" element={<AdminNavigation />} />
           <Route path="settings" element={<AdminSettings />} />
           {/* Fallback for admin */}
           <Route index element={<AdminDashboard />} />
        </Route>
      </Routes>

      {!isAdmin && location.pathname !== '/admin/login' && <Footer />}
    </div>
  )
}

export default App
