import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Package, Users, TrendingUp, FolderTree, Star, ArrowUpRight } from 'lucide-react'
import { adminFetchStats } from '../../services/api'
import { toast } from 'react-hot-toast'

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadStats = async () => {
    try {
      const data = await adminFetchStats()
      setStatsData(data)
    } catch (err) {
      toast.error('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStats() }, [])

  const stats = [
    { label: 'Revenue', value: statsData?.revenue || '£0.00', change: '+0%', isUp: true, icon: <TrendingUp className="text-green" size={24} /> },
    { label: 'Products', value: statsData?.products || '0', change: 'Live', isUp: true, icon: <Package className="text-gold" size={24} /> },
    { label: 'Categories', value: statsData?.categories || '0', change: 'Live', isUp: true, icon: <FolderTree className="text-earth" size={24} /> },
    { label: 'Testimonials', value: statsData?.testimonials || '0', change: 'Live', isUp: true, icon: <Star className="text-clay" size={24} /> },
  ]

  const recentOrders = [
    { ref: '#ASH-29481', customer: 'Amara O.', total: '£16.99', status: 'Paid', date: 'Oct 07, 2024' },
    { ref: '#ASH-29482', customer: 'Kofi B.', total: '£45.00', status: 'Processing', date: 'Oct 07, 2024' },
    { ref: '#ASH-29483', customer: 'Zainab M.', total: '£21.98', status: 'Shipped', date: 'Oct 06, 2024' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div>
            <h1 className="text-4xl font-serif text-earth font-bold">Welcome Back, Admin</h1>
            <p className="text-grey-500 font-sans text-sm font-semibold uppercase tracking-widest mt-1">Here's what's happening today at Kowope Foods.</p>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:flex-row lg:grid-cols-4 gap-8">
         {stats.map((s, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-8 rounded-card border border-grey-200 shadow-sm space-y-4 group hover:border-gold transition-all"
            >
               <div className="flex justify-between items-center">
                  <div className="p-3 bg-grey-100 rounded-xl group-hover:bg-gold/10 transition-colors">
                    {loading ? <div className="w-6 h-6 bg-grey-200 animate-pulse rounded" /> : s.icon}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.isUp ? 'bg-green/10 text-green' : 'bg-clay/10 text-clay'}`}>
                     {s.change}
                  </span>
               </div>
               <div>
                  <p className="text-grey-500 text-xs font-bold uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-3xl font-serif font-bold text-earth mt-1">
                    {loading ? "..." : s.value}
                  </h3>
               </div>
            </motion.div>
         ))}
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Recent Orders */}
         <div className="lg:col-span-2 bg-white rounded-card border border-grey-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-grey-100 flex justify-between items-center">
               <h3 className="text-xl font-serif font-bold text-earth uppercase tracking-widest">Recent Orders</h3>
               <button className="text-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                  View All <ArrowUpRight size={14} />
               </button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-grey-100 text-grey-500 text-[10px] uppercase font-bold tracking-widest">
                        <th className="px-8 py-4">Ref</th>
                        <th className="px-8 py-4">Customer</th>
                        <th className="px-8 py-4">Total</th>
                        <th className="px-8 py-4">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-grey-100">
                     {recentOrders.map((o) => (
                        <tr key={o.ref} className="hover:bg-grey-100/50 transition-colors">
                           <td className="px-8 py-5 text-sm font-bold text-earth">{o.ref}</td>
                           <td className="px-8 py-5 text-sm text-grey-700">{o.customer}</td>
                           <td className="px-8 py-5 text-sm font-bold text-gold">{o.total}</td>
                           <td className="px-8 py-5">
                              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${o.status === 'Paid' ? 'bg-green/10 text-green' : 'bg-gold/10 text-gold'}`}>
                                 {o.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Revenue Chart Placeholder */}
         <div className="bg-white rounded-card border border-grey-200 shadow-sm p-8 flex flex-col justify-between">
            <div className="space-y-4">
               <h3 className="text-xl font-serif font-bold text-earth uppercase tracking-widest">Growth</h3>
               <p className="text-grey-500 text-xs font-sans">Sales metrics vs. inventory expansion.</p>
            </div>
            <div className="h-64 bg-grey-100/50 rounded-xl flex items-center justify-center border-2 border-dashed border-grey-200 italic text-grey-400 text-sm">
               Insights Visualization
            </div>
            <div className="pt-6 border-t border-grey-100 flex justify-between items-center">
               <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-grey-500 tracking-widest">Avg Order</span>
                  <p className="text-xl font-bold text-gold font-serif italic">£35.40</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default AdminDashboard
