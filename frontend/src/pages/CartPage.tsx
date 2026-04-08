import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react'

import { useCartStore, useCartHydration } from '../store/useStore'
import { motion, AnimatePresence } from 'framer-motion'

const CartPage = () => {
  const isHydrated = useCartHydration()
  const { cart, updateQty, removeFromCart, subtotal: getSubtotal } = useCartStore()

  if (!isHydrated) return null

  const cartItems = cart
  const subtotal = getSubtotal()
  const delivery = subtotal >= 60 || cartItems.length === 0 ? 0 : 4.99

  return (
    <>
      <Helmet>
        <title>Your Basket | Kowope Foods</title>
      </Helmet>

      <section className="py-12 bg-cream min-h-screen px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-earth mb-12 italic">Your Shopping Basket</h1>

          {cartItems.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Items List */}
              <div className="flex-grow space-y-6">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-card border border-grey-100 shadow-sm relative group"
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow text-center sm:text-left space-y-2">
                         <h3 className="text-lg font-serif font-bold text-earth">{item.name}</h3>
                         <p className="text-gold font-bold">£{item.price}</p>
                      </div>
                      <div className="flex items-center border border-grey-200 rounded-btn bg-grey-100">
                         <button 
                           onClick={() => updateQty(item.id, item.qty - 1)}
                           className="p-2 hover:bg-grey-200 transition-colors"
                         >
                           <Minus size={14} />
                         </button>
                         <input type="number" value={item.qty} readOnly className="w-10 text-center font-bold text-sm bg-transparent" />
                         <button 
                           onClick={() => updateQty(item.id, item.qty + 1)}
                           className="p-2 hover:bg-grey-200 transition-colors"
                         >
                           <Plus size={14} />
                         </button>
                      </div>
                      <div className="text-right whitespace-nowrap min-w-[80px]">
                         <span className="text-lg font-bold text-earth">£{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-4 right-4 p-2 text-grey-500 hover:text-clay transition-colors opacity-0 group-hover:opacity-100"
                      >
                         <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <aside className="w-full lg:w-96">
                <div className="bg-white p-8 rounded-card border border-grey-100 shadow-xl space-y-6 sticky top-32">
                   <h3 className="text-2xl font-serif text-earth font-bold pb-4 border-b border-grey-100 uppercase tracking-widest">Summary</h3>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between text-grey-700">
                         <span>Subtotal</span>
                         <span className="font-bold">£{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-grey-700">
                         <span>Delivery Fee</span>
                         <span className="font-bold">{delivery === 0 ? <span className="text-green">FREE</span> : `£${delivery.toFixed(2)}`}</span>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-grey-100 flex justify-between items-center">
                      <span className="text-xl font-serif font-bold text-earth">Total</span>
                      <span className="text-3xl font-bold text-gold">£{(subtotal + delivery).toFixed(2)}</span>
                   </div>

                   <div className="pt-6 space-y-4">
                      <div className="flex gap-2">
                         <input type="text" placeholder="Promo Code" className="w-full border border-grey-200 px-4 py-3 rounded-btn text-sm focus:ring-1 focus:ring-gold focus:outline-none" />
                         <button className="px-6 py-3 bg-earth text-white rounded-btn font-bold text-xs uppercase tracking-widest hover:bg-clay transition-all">Apply</button>
                      </div>
                      
                      <Link to="/checkout" className="w-full btn-primary flex items-center justify-center gap-3 py-5 shadow-xl hover:translate-y-[-2px] transition-all">
                         Proceed to Checkout <ArrowRight size={20} />
                      </Link>
                      
                      <Link to="/shop" className="w-full border border-grey-200 text-grey-500 py-4 flex justify-center text-sm font-bold uppercase tracking-widest hover:border-gold hover:text-gold transition-colors rounded-btn">
                         Continue Shopping
                      </Link>
                   </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-card shadow-card flex flex-col items-center gap-8">
               <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center text-gold opacity-50">
                  <ShoppingBag size={48} />
               </div>
               <div className="space-y-2">
                  <h2 className="text-3xl font-serif text-earth">Your basket is currently empty.</h2>
                  <p className="text-grey-500">Looks like you haven't added anything to your cart yet.</p>
               </div>
               <Link to="/shop" className="btn-primary">Start Shopping</Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default CartPage
