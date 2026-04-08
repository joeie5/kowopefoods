import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react'

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Kowope Foods - Premium African Diaspora E-commerce</title>
      </Helmet>

      <section className="bg-cream py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          
          {/* Left Column - Contact Form */}
          <div className="w-full lg:w-[60%] bg-white p-8 md:p-12 rounded-card shadow-card border border-grey-100">
             <div className="space-y-4 mb-10">
                <span className="text-gold font-sans text-xs font-bold uppercase tracking-[0.4em]">Get In Touch</span>
                <h1 className="text-4xl md:text-5xl font-serif text-earth font-bold leading-tight italic">We'd Love to Hear <br />From You.</h1>
                <div className="w-24 h-1 bg-gold rounded-full transition-all duration-300"></div>
             </div>

             <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-earth">Full Name</label>
                      <input className="w-full border border-grey-200 px-5 py-4 rounded-btn text-sm focus:ring-1 focus:ring-gold focus:outline-none" placeholder="John Doe" required />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-earth">Email Address</label>
                      <input type="email" className="w-full border border-grey-200 px-5 py-4 rounded-btn text-sm focus:ring-1 focus:ring-gold focus:outline-none" placeholder="hello@example.com" required />
                   </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-earth">Subject</label>
                   <select className="w-full border border-grey-200 px-5 py-4 rounded-btn text-sm focus:ring-1 focus:ring-gold focus:outline-none" required>
                      <option>General Inquiry</option>
                      <option>Order Support</option>
                      <option>Wholesale & Partnership</option>
                      <option>Product Recommendation</option>
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-earth">Your Message</label>
                   <textarea rows={6} className="w-full border border-grey-200 px-5 py-4 rounded-btn text-sm focus:ring-1 focus:ring-gold focus:outline-none" placeholder="How can we help you?" required></textarea>
                </div>

                <button type="submit" className="w-full btn-primary flex items-center justify-center gap-3 py-5 shadow-xl hover:translate-y-[-2px] transition-all">
                   Send Message <Send size={20} />
                </button>
             </form>
          </div>

          {/* Right Column - Contact Details */}
          <div className="w-full lg:w-[40%] space-y-12 shrink-0">
             <div className="space-y-8">
                <div className="flex gap-6 items-start">
                   <div className="w-14 h-14 bg-earth text-gold rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                      <MapPin size={24} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-serif font-bold text-earth">Our Headquarters</h3>
                      <p className="text-grey-500 text-sm leading-relaxed">123 African High Street, <br /> London, SE1 0AA, United Kingdom</p>
                   </div>
                </div>

                <div className="flex gap-6 items-start">
                   <div className="w-14 h-14 bg-earth text-gold rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 transition-transform hover:rotate-0">
                      <Mail size={24} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-serif font-bold text-earth">Email Us</h3>
                      <p className="text-grey-500 text-sm leading-relaxed">hello@Kowope Foods.com <br /> support@Kowope Foods.com</p>
                   </div>
                </div>

                <div className="flex gap-6 items-start">
                   <div className="w-14 h-14 bg-earth text-gold rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
                      <Phone size={24} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-xl font-serif font-bold text-earth">Call Support</h3>
                      <p className="text-grey-500 text-sm leading-relaxed">+44 20 1234 5678 <br /> Mon-Fri: 9am - 6pm GMT</p>
                   </div>
                </div>
             </div>

             <div className="bg-gold p-8 rounded-card text-white space-y-6 shadow-xl relative overflow-hidden group border border-gold/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <h3 className="text-2xl font-serif font-bold italic leading-tight relative z-10 transition-colors group-hover:text-earth">Prefer a Fast Chat? <br />WhatsApp Us.</h3>
                <p className="text-white/90 text-sm leading-relaxed relative z-10">Our team is available for real-time support on WhatsApp. Click below to start chatting.</p>
                <a href="https://wa.me/yournumber" className="inline-flex items-center gap-3 bg-earth text-white px-6 py-3 rounded-btn font-bold text-xs uppercase tracking-widest hover:bg-clay transition-all relative z-10">
                   <MessageCircle size={18} /> Chat with Us
                </a>
             </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage
