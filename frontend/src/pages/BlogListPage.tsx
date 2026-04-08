import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Calendar, ChevronRight, Search } from 'lucide-react'

const blogPosts = [
  { id: 1, title: '5 Traditional African Spices Every Kitchen Needs', slug: '5-traditional-african-spices', category: 'Cooking Tips', excerpt: 'Explore the bold flavors of the motherland with these essential spices that define authentic African cuisine.', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800', date: 'Oct 12, 2024' },
  { id: 2, title: 'The Secret to the Perfect Jollof Rice: A Step-By-Step Guide', slug: 'perfect-jollof-rice-guide', category: 'Recipe', excerpt: 'Everyone has an opinion, but we’ve perfected the recipe that will have your guests asking for seconds.', image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800', date: 'Oct 09, 2024' },
  { id: 3, title: 'Supporting Small African Farmers: Why Our Sourcing Matters', slug: 'supporting-african-farmers', category: 'Company News', excerpt: 'Learn how your purchase directly impacts local communities and promotes sustainable agriculture in Africa.', image: 'https://images.unsplash.com/photo-1586528116311-ad866a01103d?w=800', date: 'Oct 05, 2024' },
  { id: 4, title: 'Shea Butter: The Liquid Gold of West African Beauty', slug: 'shea-butter-beauty-benefits', category: 'Beauty', excerpt: 'Discover the incredible skin-healing properties of unrefined Shea Butter sourced from the heart of Ghana.', image: 'https://images.unsplash.com/photo-1596462502278-27bf380a1cce?w=800', date: 'Oct 01, 2024' },
]

const BlogListPage = () => {
  return (
    <>
      <Helmet>
        <title>Culture Blog | Kowope Foods - Recipes, Stories & Origins</title>
      </Helmet>

      <section className="bg-cream py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-6 max-w-2xl mx-auto">
             <span className="text-gold font-sans text-xs font-bold uppercase tracking-[0.4em]">Culture & Kitchen</span>
             <h1 className="text-5xl md:text-7xl font-serif text-earth font-bold leading-tight italic">From Our <span className="text-gold">Home.</span></h1>
             <p className="text-grey-700 text-lg leading-relaxed italic font-sans max-w-xl mx-auto opacity-80">
                Explore authentic recipes, stories of origin, and deep dives into the craftsmanship behind our products.
             </p>
             <div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
             {/* Blog Grid */}
             <div className="flex-grow space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {blogPosts.map((post, i) => (
                      <article key={post.id} className="group bg-white rounded-card overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 border border-grey-100 flex flex-col">
                         <div className="relative aspect-video overflow-hidden">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 bg-gold text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">
                               {post.category}
                            </div>
                         </div>
                         <div className="p-8 space-y-4 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 text-grey-500 text-xs font-semibold uppercase tracking-widest">
                               <Calendar size={14} className="text-gold" /> {post.date}
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-earth leading-tight group-hover:text-gold transition-colors">{post.title}</h2>
                            <p className="text-grey-500 text-sm leading-relaxed line-clamp-3 font-sans">{post.excerpt}</p>
                            <Link to={`/blog/${post.slug}`} className="mt-auto inline-flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-[0.2em] hover:translate-x-2 transition-all">
                               Read Article <ChevronRight size={16} />
                            </Link>
                         </div>
                      </article>
                   ))}
                </div>
                
                {/* Pagination */}
                <div className="flex justify-center pt-8 border-t border-grey-200">
                   <button className="btn-secondary px-12 py-4 shadow-xl">Load More Stories</button>
                </div>
             </div>

             {/* Sidebar Widgets */}
             <aside className="w-full lg:w-80 space-y-12 shrink-0">
                <div className="bg-earth p-8 rounded-card text-white space-y-6 shadow-xl">
                   <h3 className="text-2xl font-serif font-bold italic border-b border-white/10 pb-4">Search Stories</h3>
                   <div className="relative">
                      <input className="w-full bg-white/5 border border-white/20 px-4 py-3 rounded-btn text-sm focus:outline-none focus:ring-1 focus:ring-gold" placeholder="Search..." />
                      <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold opacity-50" />
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-xl font-serif font-bold text-earth border-b border-gold/20 pb-4 uppercase tracking-[0.1em]">Popular Categories</h3>
                   <ul className="space-y-4">
                      {['Recipes', 'Sourcing Stories', 'Cooking Tips', 'Beauty & Self Care', 'Cultural Heritage'].map((c, i) => (
                         <li key={i}>
                            <Link to="/" className="flex items-center justify-between text-grey-700 hover:text-gold transition-all text-sm font-semibold uppercase tracking-widest group">
                               {c} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Link>
                         </li>
                      ))}
                   </ul>
                </div>
             </aside>
          </div>
        </div>
      </section>
    </>
  )
}

export default BlogListPage
