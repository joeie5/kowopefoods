import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, ShoppingBag, ArrowRight, Printer } from 'lucide-react'
import { motion } from 'framer-motion'

const OrderConfirmationPage = () => {
  return (
    <>
      <Helmet>
        <title>Order Confirmed | Kowope Foods</title>
      </Helmet>

      <section className="py-24 px-4 md:px-8 bg-cream min-h-screen flex flex-col items-center justify-center text-center">
        <div className="max-w-2xl w-full bg-white p-12 rounded-card shadow-card border border-grey-100 flex flex-col items-center gap-8">
           
           {/* Success Icon Animation */}
           <motion.div 
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ type: "spring", damping: 10, stiffness: 100 }}
             className="w-24 h-24 bg-gold rounded-full flex items-center justify-center text-white shadow-lg"
           >
              <CheckCircle size={48} strokeWidth={3} />
           </motion.div>

           <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-serif text-earth font-bold italic leading-tight">Order Confirmed!</h1>
              <p className="text-grey-500 font-sans text-lg max-w-md mx-auto">
                 Thank you for shopping with Kowope Foods. Your order has been placed and is being prepared for the journey.
              </p>
           </div>

           {/* Order Receipt Card */}
           <div className="w-full bg-grey-100 p-8 rounded-xl border border-grey-200 text-left space-y-6">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-grey-500 border-b border-grey-200 pb-4">
                 <span>Order Ref: <span className="text-earth">#ASH-29481-901</span></span>
                 <span>Date: Oct 07, 2024</span>
              </div>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-earth">Mama Gold Rice 5kg x 1</span>
                    <span className="text-gold font-bold">£16.99</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-earth">Standard Delivery</span>
                    <span className="text-gold font-bold">£4.99</span>
                 </div>
                 <div className="pt-4 border-t border-grey-200 flex justify-between items-center text-lg font-bold">
                    <span className="font-serif text-earth">Total Charged</span>
                    <span className="text-gold">£21.98</span>
                 </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gold/10 text-xs font-bold text-earth uppercase tracking-widest">
                 <ShoppingBag size={18} className="text-gold" />
                 Expected Delivery: Oct 10 - Oct 14
              </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Link to="/shop" className="flex-grow btn-primary flex items-center justify-center gap-2 py-4">
                 Continue Shopping <ShoppingBag size={18} />
              </Link>
              <button onClick={() => window.print()} className="flex-grow border border-grey-200 text-grey-500 py-4 rounded-btn font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-grey-100 transition-colors">
                 Print Receipt <Printer size={18} />
              </button>
           </div>

           <p className="text-grey-500 text-sm italic">
              A confirmation email has been sent to your inbox.
           </p>
        </div>
      </section>
    </>
  )
}

export default OrderConfirmationPage
