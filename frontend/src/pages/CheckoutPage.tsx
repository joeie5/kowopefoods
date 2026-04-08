import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, Home, CheckCircle, Package, Truck, ChevronLeft } from 'lucide-react'
import { useCartStore, useCartHydration } from '../store/useStore'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { cart, subtotal, clearCart } = useCartStore()
  const hydrated = useCartHydration()
  const [step, setStep] = useState(1)
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      postcode: '',
      address1: '',
      address2: '',
      city: '',
      country: 'United Kingdom'
    }
  })

  // Calculate totals
  const currentSubtotal = subtotal()
  const shipping = currentSubtotal > 50 ? 0 : 4.99
  const total = currentSubtotal + shipping

  const formData = watch()

  const onSubmit = async (data: any) => {
    if (step < 2) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    } else {
      try {
        await api.post('/orders', {
          customer_name: data.fullName,
          customer_email: data.email,
          customer_phone: data.phone,
          delivery_address: {
            address1: data.address1,
            address2: data.address2,
            city: data.city,
            postcode: data.postcode,
            country: data.country
          },
          delivery_method: shipping === 0 ? "Free Shipping" : "Standard",
          items: cart.map(item => ({
            product_id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            image_url: item.image
          }))
        })

        const message = `*NEW ORDER FROM KOWOPEFOODS WEBSITE*

*Customer Details:*
*Name:* ${data.fullName}
*Phone:* ${data.phone}
*Email:* ${data.email}
*Address:* ${data.address1}, ${data.address2 ? data.address2 + ', ' : ''}${data.city}, ${data.postcode}, ${data.country}

*Order Items:*
${cart.map(item => `- ${item.qty}x *${item.name}* (£${(item.price * item.qty).toFixed(2)})`).join('\n')}

*Subtotal:* £${currentSubtotal.toFixed(2)}
*Shipping:* ${shipping === 0 ? 'FREE' : '£' + shipping.toFixed(2)}
*TOTAL:* £${total.toFixed(2)}`

        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/447721513175?text=${encodedMessage}`, '_blank')
        
        clearCart()
        navigate('/order-confirmation')
      } catch (error) {
        console.error("Failed to create order:", error)
        alert("There was an issue processing your order. Please try again.")
      }
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mb-4"></div>
        <p className="text-grey-500 font-serif italic text-lg">Curating your experience...</p>
      </div>
    )
  }

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream px-4">
        <Package size={64} className="text-gold mb-6 opacity-20" />
        <h2 className="text-3xl font-serif text-earth mb-4">Your cart is empty</h2>
        <p className="text-grey-500 mb-8 max-w-md text-center">Looks like you haven't added any authentic African flavors to your cart yet.</p>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Secure Checkout | KowopeFoods</title>
      </Helmet>

      <section className="py-12 bg-cream min-h-screen px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header & Back Link */}
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-earth font-bold italic">Checkout</h1>
            <Link to="/cart" className="flex items-center gap-2 text-gold font-bold uppercase tracking-tight text-sm hover:underline">
               <ChevronLeft size={18} /> Back to Cart
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-16 relative max-w-2xl mx-auto">
             <div className="absolute top-[24px] left-0 right-0 h-[2px] bg-grey-200 -z-10"></div>
             {[
               { id: 1, label: 'Delivery', icon: <Home size={18} /> },
               { id: 2, label: 'Review & Send via WhatsApp', icon: <CheckCircle size={18} /> }
             ].map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-3 relative z-10 bg-cream px-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-xl ${step >= s.id ? 'bg-gold border-gold text-white' : 'bg-white border-grey-200 text-grey-500'}`}>
                      {s.icon}
                   </div>
                   <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= s.id ? 'text-gold' : 'text-grey-500'}`}>{s.label}</span>
                </div>
             ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Main Content Area */}
            <div className="flex-grow w-full">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white p-8 md:p-12 rounded-card shadow-card border border-grey-100 space-y-8"
                    >
                       <div className="flex items-center gap-4 border-b border-grey-100 pb-6">
                          <div className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                             <Truck size={20} />
                          </div>
                          <h2 className="text-3xl font-serif text-earth font-bold">Shipping Information</h2>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-grey-700 ml-1">Full Name</label>
                            <input {...register('fullName', { required: true })} placeholder="John Doe" className="input-field" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-grey-700 ml-1">Email Address</label>
                            <input {...register('email', { required: true, pattern: /^\S+@\S+$/i })} type="email" placeholder="john@example.com" className="input-field" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-grey-700 ml-1">Phone Number</label>
                            <input {...register('phone', { required: true })} type="tel" placeholder="+44 700 000 000" className="input-field" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-grey-700 ml-1">Postcode</label>
                            <input {...register('postcode', { required: true })} placeholder="SW1A 1AA" className="input-field" />
                          </div>
                       </div>

                       <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-grey-700 ml-1">Address Line 1</label>
                          <input {...register('address1', { required: true })} placeholder="123 High Street" className="w-full input-field" />
                       </div>

                       <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-grey-700 ml-1">Address Line 2 (Optional)</label>
                          <input {...register('address2')} placeholder="Apartment, suite, etc." className="w-full input-field" />
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-grey-700 ml-1">City</label>
                            <input {...register('city', { required: true })} placeholder="London" className="input-field" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-grey-700 ml-1">Country</label>
                            <select {...register('country')} className="input-field">
                               <option>United Kingdom</option>
                               <option>Ireland</option>
                               <option>France</option>
                               <option>Germany</option>
                            </select>
                          </div>
                       </div>

                       <div className="pt-6">
                          <button type="submit" className="w-full btn-primary flex items-center justify-center gap-3 py-5 shadow-xl hover:translate-y-[-2px] transition-all text-lg">
                             Review Your Order <ArrowRight size={20} />
                          </button>
                       </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white p-8 md:p-12 rounded-card shadow-card border border-grey-100 space-y-8"
                    >
                       <div className="flex items-center gap-4 border-b border-grey-100 pb-6">
                          <div className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                             <CheckCircle size={20} />
                          </div>
                          <h2 className="text-3xl font-serif text-earth font-bold">Review & Send via WhatsApp</h2>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-6 bg-grey-100 rounded-xl space-y-4">
                             <h4 className="font-bold text-earth uppercase tracking-widest text-xs">Shipping To</h4>
                             <div className="text-sm text-grey-700 space-y-1">
                                <p className="font-bold text-earth">{formData.fullName}</p>
                                <p>{formData.address1}</p>
                                {formData.address2 && <p>{formData.address2}</p>}
                                <p>{formData.city}, {formData.postcode}</p>
                                <p>{formData.country}</p>
                             </div>
                             <button type="button" onClick={() => setStep(1)} className="text-gold text-xs font-bold uppercase hover:underline">Edit Address</button>
                          </div>

                          <div className="p-6 bg-grey-100 rounded-xl flex flex-col justify-center items-center text-center space-y-4">
                             <div className="w-12 h-12 bg-green/10 text-green rounded-full flex items-center justify-center border border-green/20">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                             </div>
                             <div>
                                <h4 className="font-bold text-earth uppercase tracking-widest text-xs mb-1">Payment Method</h4>
                                <p className="text-sm text-grey-700">Order via WhatsApp</p>
                             </div>
                          </div>
                       </div>

                       <div className="pt-6">
                          <button type="submit" className="w-full bg-[#25D366] text-white py-5 rounded-btn font-bold text-lg shadow-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3">
                             Send Order via WhatsApp <ArrowRight size={20} />
                          </button>
                          <p className="text-[11px] text-grey-500 text-center mt-4 px-8">
                             By clicking this button, you will be redirected to WhatsApp to confirm and coordinate payment with our team.
                          </p>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Sidebar Summary - Sticky */}
            <aside className="w-full lg:w-[400px] shrink-0 lg:sticky lg:top-28">
               <div className="bg-white p-8 rounded-card border border-grey-100 shadow-card space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-grey-100">
                    <h4 className="text-xl font-serif font-bold text-earth uppercase tracking-[0.1em]">Order Summary</h4>
                    <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-bold">{cart.length} Items</span>
                  </div>

                  <div className="max-h-[350px] overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-gold/20">
                     {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 group">
                           <div className="w-16 h-16 bg-grey-100 rounded-xl overflow-hidden shrink-0 shadow-inner">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           </div>
                           <div className="flex-grow py-1">
                              <p className="text-sm font-bold text-earth line-clamp-1 italic">{item.name}</p>
                              <div className="flex justify-between items-center mt-1">
                                 <p className="text-xs text-grey-500 font-medium tracking-tight">Quantity: {item.qty}</p>
                                 <p className="text-sm font-bold text-gold">£{(item.price * item.qty).toFixed(2)}</p>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="pt-6 border-t border-grey-100 space-y-4">
                     <div className="flex justify-between text-grey-500 text-sm font-medium">
                        <span>Items Subtotal</span>
                        <span className="font-bold text-earth">£{currentSubtotal.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-grey-500 text-sm font-medium">
                        <span className="flex items-center gap-2 italic">Shipping {shipping === 0 && <span className="text-green font-bold not-italic">(Free Over £50)</span>}</span>
                        <span className="font-bold text-earth">{shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}</span>
                     </div>
                     
                     <div className="bg-grey-100 p-4 rounded-xl flex justify-between items-center mt-4">
                        <span className="text-xl font-serif font-bold text-earth uppercase tracking-widest">Total</span>
                        <div className="text-right">
                           <span className="text-3xl font-bold text-earth leading-none">£{total.toFixed(2)}</span>
                           <p className="text-[10px] text-grey-500 font-bold uppercase mt-1">VAT Included</p>
                        </div>
                     </div>
                  </div>

                  {shipping > 0 && (
                    <div className="bg-gold/5 border border-gold/20 p-3 rounded-lg text-[11px] text-grey-700 text-center font-medium italic">
                      Add <span className="text-gold font-bold">£{(50 - currentSubtotal).toFixed(2)}</span> more to qualify for <span className="font-bold">Free Shipping</span>!
                    </div>
                  )}
               </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Global Input Styles for this page */}
      <style>{`
        .input-field {
          width: 100%;
          border: 1px solid #E8E0D5;
          padding: 1rem 1.25rem;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.3s;
          background: #fff;
        }
        .input-field:focus {
          outline: none;
          border-color: #C9933A;
          box-shadow: 0 0 0 1px #C9933A;
        }
      `}</style>
    </>
  )
}

export default CheckoutPage

