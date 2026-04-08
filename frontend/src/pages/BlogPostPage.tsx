import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, ChevronLeft, Share2, Facebook, Twitter, Instagram } from 'lucide-react'

const BlogPostPage = () => {
  const { slug } = useParams()

  // Sample data
  const post = {
    title: '5 Traditional African Spices Every Kitchen Needs',
    category: 'Cooking Tips',
    date: 'Oct 12, 2024',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200',
    content: `
      <p>African cuisine is a vibrant tapestry of flavors, colors, and aromas. At the heart of this culinary excellence lie the spices—the secret ingredients that transform simple staples into extraordinary feasts. Whether you are a seasoned chef or a home cook looking to explore your roots, these five traditional spices are essential for your pantry.</p>
      
      <h3>1. Berbere (Ethiopia/Eritrea)</h3>
      <p>Berbere is more than just a spice; it is the soul of Ethiopian cooking. A complex blend featuring chili peppers, garlic, ginger, basil, and more, it offers a perfect balance of heat and warmth. Essential for Doro Wat and other traditional stews.</p>
      
      <h3>2. Suya Spice (Yaji) (West Africa)</h3>
      <p>Originating from the Hausa people, Suya spice is a nutty, spicy mixture made from ground peanuts (kuli-kuli), ginger, cayenne pepper, and bouillon. It’s the magic behind the iconic West African street food, Suya.</p>
      
      <h3>3. Ras el Hanout (North Africa)</h3>
      <p>Translating to "top of the shop," this Moroccan blend represents the finest spices a merchant has to offer. With over a dozen ingredients including cumin, coriander, cinnamon, and nutmeg, it adds a sophisticated depth to tagines and couscous.</p>

      <h3>4. Grains of Selim (Uda Seed)</h3>
      <p>Known for its musky, smoky flavor, Uda is a powerhouse in West African soups like Pepper Soup. It’s often used whole and removed before serving, imparting a unique medicinal and aromatic quality.</p>

      <h3>5. Harissa (Tunisia)</h3>
      <p>Harissa is a fiery chili paste (or powder) that brings the heat of North Africa to your plate. Made from roasted red peppers, Baklouti peppers, and serrano peppers, it’s balanced with garlic, caraway seeds, and coriander.</p>
    `
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Kowope Foods Culture Blog</title>
      </Helmet>

      <article className="bg-cream min-h-screen pb-24">
        {/* Post Hero */}
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
           <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-earth/90 via-earth/30 to-transparent"></div>
           
           <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 lg:p-24 max-w-5xl mx-auto space-y-6 text-white animate-in slide-in-from-bottom duration-1000">
              <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.4em] text-gold hover:text-white transition-colors">
                 <ChevronLeft size={16} /> Back to Blog
              </Link>
              <span className="inline-block bg-gold text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                 {post.category}
              </span>
              <h1 className="text-4xl md:text-7xl font-serif font-bold italic leading-tight">{post.title}</h1>
              <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-grey-200">
                 <Calendar size={16} className="text-gold" /> {post.date} • 5 min read
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 mt-16 flex flex-col md:flex-row gap-16 relative">
           {/* Sticky Share Sidebar */}
           <div className="md:sticky md:top-32 h-fit flex md:flex-col gap-6 text-grey-500">
              <button className="p-3 bg-white rounded-full shadow-card hover:text-gold transition-all"><Share2 size={18} /></button>
              <div className="hidden md:flex flex-col gap-4">
                 <button className="p-3 bg-white rounded-full shadow-card hover:text-blue-600 transition-all"><Facebook size={18} /></button>
                 <button className="p-3 bg-white rounded-full shadow-card hover:text-sky-500 transition-all"><Twitter size={18} /></button>
              </div>
           </div>

           {/* Post Body */}
           <div className="flex-grow space-y-12">
              <div className="prose prose-lg prose-gold prose-headings:font-serif prose-headings:italic text-grey-700 font-sans leading-relaxed max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
              
              <div className="pt-12 border-t border-grey-200 flex flex-col sm:flex-row justify-between items-center gap-8">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold font-serif text-2xl">A</div>
                    <div className="space-y-1">
                       <h4 className="text-earth font-bold uppercase tracking-widest text-xs">Kowope Foods Editorial</h4>
                       <p className="text-grey-500 text-sm">Curating the best of African culture and cuisine for the diaspora.</p>
                    </div>
                 </div>
                 <Link to="/shop" className="btn-primary">Shop Traditional Spices</Link>
              </div>
           </div>
        </div>
      </article>
    </>
  )
}

export default BlogPostPage
