import { useState, useEffect } from 'react'
import { Search, Filter, ShoppingBag, Eye, CheckCircle, Package, Truck } from 'lucide-react'
import api from '../../services/api'

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/orders')
      setOrders(res.data)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${id}`, { status: newStatus })
      fetchOrders()
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div>
            <h1 className="text-3xl font-serif text-earth font-bold">Order Management</h1>
            <p className="text-grey-500 text-sm font-sans uppercase tracking-widest mt-1">Track and manage all guest checkouts and shipping statuses.</p>
         </div>
         <div className="flex gap-4">
            <button className="flex items-center gap-2 border border-grey-200 px-6 py-4 rounded-btn text-sm font-bold text-earth hover:border-gold transition-colors bg-white shadow-sm">
               Download CSV
            </button>
         </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-earth p-8 rounded-card text-white shadow-xl">
         {[
           { label: 'Total Orders', value: orders.length.toString(), icon: <ShoppingBag size={20} /> },
           { label: 'New Today', value: orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length.toString(), icon: <CheckCircle size={20} /> },
           { label: 'Pending', value: orders.filter(o => o.status === 'pending').length.toString(), icon: <Package size={20} /> },
           { label: 'Paid/Shipped', value: orders.filter(o => o.status === 'paid' || o.status === 'shipped').length.toString(), icon: <Truck size={20} /> },
         ].map((s, i) => (
            <div key={i} className="space-y-2 border-r border-white/10 last:border-0 pr-6">
               <div className="flex items-center gap-2 text-gold opacity-80 uppercase tracking-widest text-[10px] font-bold">
                  {s.icon} {s.label}
               </div>
               <p className="text-2xl font-serif font-bold italic">{s.value}</p>
            </div>
         ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-card border border-grey-200 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-grey-100 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-grow max-w-sm bg-grey-100 px-4 py-3 rounded-btn border border-grey-200">
               <Search size={18} className="text-grey-500" />
               <input 
                 placeholder="Search Order ID or Customer..." 
                 className="bg-transparent text-sm w-full focus:outline-none"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex items-center gap-4">
               <select className="bg-white border border-grey-200 px-5 py-3 rounded-btn text-sm font-bold text-earth focus:outline-none focus:border-gold">
                  <option>Status: All</option>
                  <option>Paid</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
               </select>
               <button className="flex items-center gap-2 text-sm font-bold text-earth border border-grey-200 px-5 py-3 rounded-btn hover:border-gold transition-colors bg-white">
                  <Filter size={18} /> Filters
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-grey-100 text-grey-500 text-[10px] uppercase font-bold tracking-widest">
                     <th className="px-8 py-5">Order ID</th>
                     <th className="px-8 py-5">Customer</th>
                     <th className="px-8 py-5 text-center">Items</th>
                     <th className="px-8 py-5">Total</th>
                     <th className="px-8 py-5">Status</th>
                     <th className="px-8 py-5 text-right">Date</th>
                     <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-grey-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-8 py-12 text-center text-grey-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold mx-auto mb-4"></div>
                        <p>Loading orders...</p>
                      </td>
                    </tr>
                  ) : orders.length > 0 ? (
                    orders.filter(o => o.order_reference.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer_name.toLowerCase().includes(searchTerm.toLowerCase())).map((o) => (
                       <tr key={o.id} className="hover:bg-grey-100/50 transition-all group font-medium">
                          <td className="px-8 py-5">
                             <span className="text-sm font-bold text-earth">{o.order_reference}</span>
                          </td>
                          <td className="px-8 py-5">
                             <div className="space-y-0.5">
                                <p className="text-sm font-bold text-earth">{o.customer_name}</p>
                                <p className="text-xs text-grey-500">{o.customer_email}</p>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className="text-sm">{o.items ? o.items.length : 0}</span>
                          </td>
                          <td className="px-8 py-5">
                             <span className="text-sm font-bold text-gold">£{o.total.toFixed(2)}</span>
                          </td>
                          <td className="px-8 py-5">
                             <select 
                                value={o.status || 'pending'} 
                                onChange={(e) => updateStatus(o.id, e.target.value)}
                                className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer ${
                                  (o.status || 'pending') === 'paid' ? 'bg-green/5 border-green/20 text-green' : 
                                  (o.status || 'pending') === 'pending' ? 'bg-gold/5 border-gold/20 text-gold' : 
                                  (o.status || 'pending') === 'shipped' ? 'bg-blue-600/5 border-blue-600/20 text-blue-600' : 
                                  'bg-grey-100 border-grey-200 text-grey-500'
                                }`}
                             >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="shipped">Shipped</option>
                                <option value="cancelled">Cancelled</option>
                             </select>
                          </td>
                          <td className="px-8 py-5 text-sm text-grey-500 text-right">{new Date(o.created_at).toLocaleDateString()}</td>
                          <td className="px-8 py-5 text-right">
                             <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-gold hover:bg-gold/10 rounded-lg transition-all" title="View Details">
                                   <Eye size={18} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-8 py-12 text-center text-grey-500">
                        <ShoppingBag size={32} className="mx-auto mb-4 opacity-50" />
                        <p className="font-bold text-earth">No orders found</p>
                        <p className="text-sm mt-1">Orders are currently routed directly to WhatsApp.</p>
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}

export default AdminOrders
