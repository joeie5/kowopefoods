import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { adminLogin } from '../../services/api'

const AdminLoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await adminLogin(username, password)
      localStorage.setItem('admin_token', data.access_token)
      toast.success('Welcome back, Admin!')
      navigate('/admin/dashboard')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-earth flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-clay/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-card shadow-2xl p-10 space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
           <div className="bg-gold p-3 rounded-xl inline-flex items-center justify-center shadow-lg">
              <ShieldCheck size={32} className="text-white" />
           </div>
           <h1 className="text-3xl font-serif text-earth font-bold uppercase tracking-widest">Admin Portal</h1>
           <p className="text-grey-500 text-sm font-sans tracking-tight">Kowope Foods Premium Management Systems</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-grey-500 ml-1">Username</label>
              <div className="relative">
                 <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-500" />
                 <input 
                   type="text" 
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="w-full bg-grey-100 border border-grey-200 px-12 py-4 rounded-btn text-sm focus:ring-1 focus:ring-gold focus:outline-none transition-all" 
                   placeholder="Enter username"
                   required
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-grey-500 ml-1">Password</label>
              <div className="relative">
                 <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-500" />
                 <input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-grey-100 border border-grey-200 px-12 py-4 rounded-btn text-sm focus:ring-1 focus:ring-gold focus:outline-none transition-all" 
                   placeholder="••••••••"
                   required
                 />
              </div>
           </div>

           <button 
             type="submit" 
             disabled={loading}
             className="w-full btn-primary flex items-center justify-center gap-3 py-5 shadow-xl disabled:opacity-50 active:scale-95 transition-all"
           >
             {loading ? 'Authenticating...' : 'Access Dashboard'} 
             {!loading && <ArrowRight size={20} />}
           </button>
        </form>

        <p className="text-center text-[10px] text-grey-500 uppercase tracking-widest font-semibold opacity-60">
           Authorized Access Only. All actions are logged.
        </p>
      </motion.div>
    </div>
  )
}

export default AdminLoginPage
