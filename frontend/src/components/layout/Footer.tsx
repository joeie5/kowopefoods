import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from 'lucide-react'
import { fetchCMSSection, fetchNavLinks } from '../../services/api'

const Footer = () => {
  const [settings, setSettings] = useState<any>(null)
  const [navLinks, setNavLinks] = useState<any[]>([])

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [settingsData, linksData] = await Promise.all([
          fetchCMSSection('site_settings'),
          fetchNavLinks()
        ])
        if (settingsData && settingsData.data) {
          setSettings(settingsData.data)
        }
        if (linksData) {
          setNavLinks(linksData.sort((a: any, b: any) => a.display_order - b.display_order))
        }
      } catch (err) {
        console.error('Failed to load footer data', err)
      }
    }
    loadSettings()
  }, [])

  // Fallback values in case API fails or is loading
  const siteName = settings?.site_name || 'Kowope Foods'
  const description = settings?.footer_description || 'The premium online destination for the African diaspora. Sourcing the finest groceries, fashion, and beauty products directly from the motherland.'
  const contact = settings?.contact_info || {
    address: '123 African High Street, London, United Kingdom',
    email: 'hello@kowopefoods.com',
    phone: '+44 20 1234 5678'
  }
  const socials = settings?.social_links || {
    instagram: '#',
    facebook: '#',
    twitter: '#'
  }
  const copyright = settings?.copyright || '2025 Kowope Foods. All rights reserved.'

  return (
    <footer className="bg-earth text-grey-200 py-20 px-4 md:px-8 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3 group">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={siteName} className="h-10 w-auto group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="bg-gold p-1.5 rounded-xl shadow-lg shadow-gold/20 group-hover:rotate-12 transition-transform duration-500 shrink-0">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 10 10-10-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
            )}
            <span className="text-2xl font-serif font-black text-white tracking-tight leading-none">{siteName}</span>
          </Link>
          <p className="text-grey-500 text-sm leading-relaxed max-w-xs font-medium opacity-80 mt-2">
            {description}
          </p>
          <div className="flex gap-4">
             {[
               { Icon: Instagram, url: socials.instagram },
               { Icon: Facebook, url: socials.facebook },
               { Icon: Twitter, url: socials.twitter }
             ].map(({ Icon, url }, i) => (
               <a 
                key={i} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 border border-white/10 rounded-xl hover:bg-gold hover:text-white hover:border-gold hover:scale-110 transition-all duration-300"
               >
                 <Icon size={18} strokeWidth={2.5} />
               </a>
             ))}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-6">
          <h4 className="text-white font-serif text-lg font-black uppercase tracking-widest">Navigation</h4>
          <ul className="space-y-4 text-sm font-bold">
            {navLinks.length > 0 ? navLinks.map((link) => (
              <li key={link.id}>
                <Link to={link.path} className="text-grey-400 hover:text-gold transition-colors inline-block">{link.name}</Link>
              </li>
            )) : (
              // Fallback if no nav links are configured or loaded
              <>
                <li><Link to="/" className="text-grey-400 hover:text-gold transition-colors inline-block">Home</Link></li>
                <li><Link to="/shop" className="text-grey-400 hover:text-gold transition-colors inline-block">Shop</Link></li>
                <li><Link to="/about" className="text-grey-400 hover:text-gold transition-colors inline-block">About</Link></li>
                <li><Link to="/contact" className="text-grey-400 hover:text-gold transition-colors inline-block">Contact</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Col 3: Customer Care */}
        <div className="space-y-6">
          <h4 className="text-white font-serif text-lg font-black uppercase tracking-widest">Customer Care</h4>
          <ul className="space-y-4 text-sm font-bold">
            {['Delivery Information', 'Returns & Refunds', 'Privacy Policy', 'Terms of Service', 'Support Center'].map((link, i) => (
              <li key={i}>
                <Link to="/" className="text-grey-400 hover:text-gold transition-colors inline-block">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact Info */}
        <div className="space-y-6">
          <h4 className="text-white font-serif text-lg font-black uppercase tracking-widest">Get In Touch</h4>
          <ul className="space-y-6 text-sm">
            <li className="flex gap-4 items-start group">
               <div className="p-2 bg-gold/10 text-gold rounded-lg group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                 <MapPin size={18} strokeWidth={2.5} />
               </div>
               <span className="leading-relaxed font-medium text-grey-400">{contact.address}</span>
            </li>
            <li className="flex gap-4 items-center group">
               <div className="p-2 bg-gold/10 text-gold rounded-lg group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                 <Mail size={18} strokeWidth={2.5} />
               </div>
               <span className="font-bold text-grey-400 group-hover:text-gold transition-colors">{contact.email}</span>
            </li>
            <li className="flex gap-4 items-center group">
               <div className="p-2 bg-gold/10 text-gold rounded-lg group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                 <Phone size={18} strokeWidth={2.5} />
               </div>
               <span className="font-bold text-grey-400 group-hover:text-gold transition-colors">{contact.phone}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-grey-600">
        <p>&copy; {copyright}</p>
        <div className="flex gap-8">
           <Link to="/" className="hover:text-gold transition-colors">Privacy</Link>
           <Link to="/" className="hover:text-gold transition-colors">Terms</Link>
           <Link to="/" className="hover:text-gold transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
