import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, ChevronRight } from 'lucide-react'

const blogPosts = [
  { 
    id: 1, 
    title: '5 Traditional African Spices Every Kitchen Needs', 
    slug: '5-traditional-african-spices',
    category: 'Cooking Tips', 
    excerpt: 'Explore the bold flavors of the motherland with these essential spices that define authentic African cuisine.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500',
    date: 'Oct 12, 2024'
  },
  { 
    id: 2, 
    title: 'The Secret to the Perfect Jollof Rice: A Step-By-Step Guide', 
    slug: 'perfect-jollof-rice-guide',
    category: 'Recipe', 
    excerpt: 'Everyone has an opinion, but we’ve perfected the recipe that will have your guests asking for seconds.',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500',
    date: 'Oct 09, 2024'
  },
  { 
    id: 3, 
    title: 'Supporting Small African Farmers: Why Our Sourcing Matters', 
    slug: 'supporting-african-farmers',
    category: 'Company News', 
    excerpt: 'Learn how your purchase directly impacts local communities and promotes sustainable agriculture in Africa.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad866a01103d?w=500',
    date: 'Oct 05, 2024'
  },
]

const BlogPreview = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-earth mb-2 lowercase italic">From Our Kitchen & Culture</h2>
            <div className="w-32 h-1 bg-gold rounded-full"></div>
          </div>
          
          <Link to="/blog" className="text-gold font-semibold uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
             View All Articles <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <motion.div 
               key={post.id}
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               whileHover={{ y: -5 }}
               transition={{ delay: i * 0.1 }}
               viewport={{ once: true }}
               className="group flex flex-col h-full bg-white rounded-card overflow-hidden shadow-card hover:shadow-hover transition-all duration-300"
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-gold text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full">
                  {post.category}
                </span>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-grey-500 text-xs mb-4">
                  <Calendar size={14} /> {post.date}
                </div>
                
                <h3 className="text-xl md:text-2xl font-serif text-earth font-bold group-hover:text-gold transition-colors mb-4 line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                
                <p className="text-grey-500 text-sm leading-relaxed line-clamp-3 mb-6">
                  {post.excerpt}
                </p>
                
                <Link to={`/blog/${post.slug}`} className="mt-auto text-gold font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Read More <ChevronRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogPreview
