import { useState, useEffect } from 'react'
import {
  Save, RefreshCw, Eye, Image as ImageIcon, Type, Link as LinkIcon,
  ChevronRight, Star, Layout, Megaphone, Users, Settings
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { fetchCMSSection, adminUploadImage, fetchCategories } from '../../services/api'
import api from '../../services/api'
import { Link } from 'react-router-dom'

// ─── Field primitives ───────────────────────────────────
const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-grey-700">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-grey-400 mt-1">{hint}</p>}
  </div>
)

const TextInput = ({ value, onChange, placeholder }: any) => (
  <input value={value} onChange={onChange} placeholder={placeholder}
    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
)

const TextArea = ({ value, onChange, rows = 3, placeholder }: any) => (
  <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder}
    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none" />
)

const ImageField = ({ label, value, onChange, hint }: any) => (
  <Field label={label} hint={hint}>
    <div className="relative">
      <ImageIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-400" />
      <input value={value} onChange={onChange} placeholder="https://..."
        className="w-full border border-grey-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold" />
    </div>
    {value && (
      <div className="mt-2 w-full h-36 rounded-xl overflow-hidden border border-grey-200 bg-grey-100">
        <img src={value} alt="preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
      </div>
    )}
  </Field>
)

const ImageUploadField = ({ label, value, onChange, hint }: any) => {
  const [uploading, setUploading] = useState(false)
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await adminUploadImage(file)
      onChange({ target: { value: res.url } })
      toast.success('Image uploaded!')
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-4 items-start">
        <div className="flex-1 relative">
          <ImageIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-400" />
          <input value={value} onChange={onChange} placeholder="https://..."
            className="w-full border border-grey-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold" />
        </div>
        <label className="bg-earth text-white font-bold flex items-center justify-center h-[46px] px-6 cursor-pointer rounded-xl shrink-0 hover:bg-opacity-90 transition-opacity">
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>
      {value && (
        <div className="mt-2 w-full h-36 rounded-xl overflow-hidden border border-grey-200 bg-grey-100 p-4 flex items-center justify-center">
          <img src={value} alt="preview" className="max-w-full max-h-full object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
      )}
    </Field>
  )
}

// ─── Section components ──────────────────────────────────
const HeroForm = ({ data, setData }: any) => (
  <div className="space-y-6">
    <Field label="Main Headline">
      <TextArea value={data.title || ''} onChange={(e: any) => setData({ ...data, title: e.target.value })} rows={2} placeholder="The Essence of Africa, Delivered." />
    </Field>
    <Field label="Subtitle">
      <TextArea value={data.subtitle || ''} onChange={(e: any) => setData({ ...data, subtitle: e.target.value })} placeholder="Sourcing the finest African groceries..." />
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="CTA Button Text">
        <div className="relative">
          <Type size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-400" />
          <input value={data.cta_text || ''} onChange={(e: any) => setData({ ...data, cta_text: e.target.value })}
            className="w-full border border-grey-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="Shop the Collection" />
        </div>
      </Field>
      <Field label="CTA Button Link">
        <div className="relative">
          <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-400" />
          <input value={data.cta_link || ''} onChange={(e: any) => setData({ ...data, cta_link: e.target.value })}
            className="w-full border border-grey-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="/shop" />
        </div>
      </Field>
    </div>
    <ImageField label="Hero Background Image URL" value={data.image_url || ''} onChange={(e: any) => setData({ ...data, image_url: e.target.value })} hint="Recommended: 1920×800px or wider landscape image." />
  </div>
)

const CategoriesForm = ({ data, setData, categories }: any) => (
  <div className="space-y-6">
    <Field label="Section Title">
      <TextInput value={data.title || ''} onChange={(e: any) => setData({ ...data, title: e.target.value })} placeholder="Browse Our Heritage" />
    </Field>
    <Field label="Section Subtitle">
      <TextArea value={data.subtitle || ''} onChange={(e: any) => setData({ ...data, subtitle: e.target.value })} placeholder="From everyday essentials to celebratory treats..." />
    </Field>
    
    <div className="pt-6 border-t border-grey-100 space-y-6">
      <div>
        <h4 className="font-bold text-sm text-earth">Category Vectors</h4>
        <p className="text-xs text-grey-500 mt-1 mb-4">Upload a custom vector/image for each category shown on the homepage.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories?.map((cat: any) => (
          <div key={cat.id} className="p-4 border border-grey-100 rounded-2xl bg-grey-50 space-y-4">
            <div>
              <h5 className="font-bold text-earth text-sm mb-1">{cat.name}</h5>
              <p className="text-[10px] text-grey-500 uppercase tracking-widest">Base Category</p>
            </div>
            
            <Field label="Custom Display Name">
              <TextInput 
                placeholder={cat.name}
                value={data.name_mapping?.[cat.id] || ''} 
                onChange={(e: any) => setData({ 
                  ...data, 
                  name_mapping: { ...(data.name_mapping || {}), [cat.id]: e.target.value } 
                })} 
              />
            </Field>

            <ImageUploadField 
              label="Custom Vector Image"
              value={data.vector_mapping?.[cat.id] || ''} 
              onChange={(e: any) => setData({ 
                ...data, 
                vector_mapping: { ...(data.vector_mapping || {}), [cat.id]: e.target.value } 
              })} 
            />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const PromoForm = ({ data, setData }: any) => (
  <div className="space-y-6">
    <Field label="Promo Badge Text" hint='Short label shown in pill badge, e.g. "Limited Time" or "New Season"'>
      <TextInput value={data.badge || ''} onChange={(e: any) => setData({ ...data, badge: e.target.value })} placeholder="Limited Time" />
    </Field>
    <Field label="Promo Headline">
      <TextArea value={data.title || ''} rows={2} onChange={(e: any) => setData({ ...data, title: e.target.value })} placeholder="🔥 Summer Sale — Up to 40% off all dried goods." />
    </Field>
    <div className="grid grid-cols-2 gap-4">
      <Field label="CTA Button Text">
        <div className="relative">
          <Type size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-400" />
          <input value={data.cta_text || ''} onChange={(e: any) => setData({ ...data, cta_text: e.target.value })}
            className="w-full border border-grey-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="Shop the Sale" />
        </div>
      </Field>
      <Field label="CTA Button Link">
        <div className="relative">
          <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-400" />
          <input value={data.cta_link || ''} onChange={(e: any) => setData({ ...data, cta_link: e.target.value })}
            className="w-full border border-grey-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="/shop" />
        </div>
      </Field>
    </div>
    <Field label="Background Color" hint='Hex code, e.g. #C9933A for gold, #2D4A3E for earthy green'>
      <div className="flex items-center gap-3">
        <input type="color" value={data.bg_color || '#C9933A'} onChange={(e: any) => setData({ ...data, bg_color: e.target.value })}
          className="w-12 h-12 rounded-xl border border-grey-200 cursor-pointer" />
        <input value={data.bg_color || '#C9933A'} onChange={(e: any) => setData({ ...data, bg_color: e.target.value })}
          className="flex-1 border border-grey-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-gold" />
      </div>
    </Field>
  </div>
)

const AboutForm = ({ data, setData }: any) => (
  <div className="space-y-6">
    <Field label="Section Tag / Label" hint='Small text shown above the heading, e.g. "Our Story"'>
      <TextInput value={data.tag || ''} onChange={(e: any) => setData({ ...data, tag: e.target.value })} placeholder="Our Story" />
    </Field>
    <Field label="Main Heading">
      <TextArea value={data.heading || ''} rows={2} onChange={(e: any) => setData({ ...data, heading: e.target.value })} placeholder="Bringing the Heart of Africa to Your Global Kitchen." />
    </Field>
    <Field label="Paragraph 1">
      <TextArea value={data.para1 || ''} rows={3} onChange={(e: any) => setData({ ...data, para1: e.target.value })} />
    </Field>
    <Field label="Paragraph 2">
      <TextArea value={data.para2 || ''} rows={3} onChange={(e: any) => setData({ ...data, para2: e.target.value })} />
    </Field>
    <div className="grid grid-cols-3 gap-4">
      <Field label="Stat 1 — Value">
        <TextInput value={data.stat1_value || ''} onChange={(e: any) => setData({ ...data, stat1_value: e.target.value })} placeholder="5+" />
      </Field>
      <Field label="Stat 1 — Label">
        <TextInput value={data.stat1_label || ''} onChange={(e: any) => setData({ ...data, stat1_label: e.target.value })} placeholder="Years Serving" />
      </Field>
      <Field label="CTA Text">
        <TextInput value={data.cta_text || ''} onChange={(e: any) => setData({ ...data, cta_text: e.target.value })} placeholder="Read Our Journey" />
      </Field>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Field label="Counter 1 — Value">
        <TextInput value={data.counter1_value || ''} onChange={(e: any) => setData({ ...data, counter1_value: e.target.value })} placeholder="2,000+" />
      </Field>
      <Field label="Counter 1 — Label">
        <TextInput value={data.counter1_label || ''} onChange={(e: any) => setData({ ...data, counter1_label: e.target.value })} placeholder="Happy Customers" />
      </Field>
      <Field label="Counter 2 — Value">
        <TextInput value={data.counter2_value || ''} onChange={(e: any) => setData({ ...data, counter2_value: e.target.value })} placeholder="500+" />
      </Field>
      <Field label="Counter 2 — Label">
        <TextInput value={data.counter2_label || ''} onChange={(e: any) => setData({ ...data, counter2_label: e.target.value })} placeholder="Authentic Products" />
      </Field>
    </div>
    <ImageField label="Section Image URL" value={data.image_url || ''} onChange={(e: any) => setData({ ...data, image_url: e.target.value })} hint="Left-hand image in the About Teaser block." />
  </div>
)

const TestimonialsForm = ({ data, setData }: any) => (
  <div className="space-y-6">
    <Field label="Section Title">
      <TextInput value={data.title || ''} onChange={(e: any) => setData({ ...data, title: e.target.value })} placeholder="What Our Customers Say" />
    </Field>
    <Field label="Section Subtitle">
      <TextArea value={data.subtitle || ''} onChange={(e: any) => setData({ ...data, subtitle: e.target.value })} placeholder="Loved by the African diaspora across the UK and Europe." />
    </Field>
    <div className="p-5 bg-gold/5 border border-gold/20 rounded-2xl space-y-2">
      <p className="text-xs font-bold text-gold uppercase tracking-widest">💡 Tip</p>
      <p className="text-sm text-grey-700">Individual testimonial cards are managed from the <strong>Testimonials</strong> page in the sidebar. Use this panel to control the section heading shown above them.</p>
    </div>
  </div>
)

const GlobalSettingsForm = ({ data, setData }: any) => (
  <div className="space-y-8">
    <div className="space-y-6">
      <h3 className="text-base font-bold text-earth border-b border-grey-100 pb-2">Brand Identity</h3>
      <ImageUploadField label="Logo URL" value={data.logo_url || ''} onChange={(e: any) => setData({ ...data, logo_url: e.target.value })} hint="Upload your brand logo for the footer." />
      <Field label="Site Name">
        <TextInput value={data.site_name || ''} onChange={(e: any) => setData({ ...data, site_name: e.target.value })} />
      </Field>
      <Field label="Footer Description">
        <TextArea value={data.footer_description || ''} onChange={(e: any) => setData({ ...data, footer_description: e.target.value })} rows={3} />
      </Field>
      <Field label="Copyright Notice">
        <TextInput value={data.copyright || ''} onChange={(e: any) => setData({ ...data, copyright: e.target.value })} />
      </Field>
    </div>

    <div className="space-y-6">
      <h3 className="text-base font-bold text-earth border-b border-grey-100 pb-2">Contact Info</h3>
      <Field label="Address">
        <TextInput value={data.contact_info?.address || ''} onChange={(e: any) => setData((prev: any) => ({ ...prev, contact_info: { ...prev.contact_info, address: e.target.value } }))} />
      </Field>
      <Field label="Email">
        <TextInput value={data.contact_info?.email || ''} onChange={(e: any) => setData((prev: any) => ({ ...prev, contact_info: { ...prev.contact_info, email: e.target.value } }))} />
      </Field>
      <Field label="Phone">
        <TextInput value={data.contact_info?.phone || ''} onChange={(e: any) => setData((prev: any) => ({ ...prev, contact_info: { ...prev.contact_info, phone: e.target.value } }))} />
      </Field>
    </div>

    <div className="space-y-6">
      <h3 className="text-base font-bold text-earth border-b border-grey-100 pb-2">Social Links</h3>
      <Field label="Instagram URL">
        <TextInput value={data.social_links?.instagram || ''} onChange={(e: any) => setData((prev: any) => ({ ...prev, social_links: { ...prev.social_links, instagram: e.target.value } }))} />
      </Field>
      <Field label="Facebook URL">
        <TextInput value={data.social_links?.facebook || ''} onChange={(e: any) => setData((prev: any) => ({ ...prev, social_links: { ...prev.social_links, facebook: e.target.value } }))} />
      </Field>
      <Field label="Twitter URL">
        <TextInput value={data.social_links?.twitter || ''} onChange={(e: any) => setData((prev: any) => ({ ...prev, social_links: { ...prev.social_links, twitter: e.target.value } }))} />
      </Field>
    </div>
  </div>
)

// ─── Main CMS Editor ────────────────────────────────────
const SECTIONS = [
  { id: 'site_settings', name: 'Global Footer', icon: Settings, dbKey: 'site_settings' },
  { id: 'hero', name: 'Hero Section', icon: Layout, dbKey: 'hero' },
  { id: 'categories_showcase', name: 'Featured Categories', icon: ImageIcon, dbKey: 'categories_showcase' },
  { id: 'promo_banner', name: 'Promo Banner', icon: Megaphone, dbKey: 'promo_banner' },
  { id: 'about_teaser', name: 'About Teaser', icon: Users, dbKey: 'about_teaser' },
  { id: 'testimonials_section', name: 'Testimonials Block', icon: Star, dbKey: 'testimonials_section' },
]

const AdminCMSEditor = () => {
  const [activeId, setActiveId] = useState('site_settings')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sectionData, setSectionData] = useState<Record<string, any>>({})
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error)
  }, [])

  const activeSection = SECTIONS.find(s => s.id === activeId)!

  const loadSection = async (id: string) => {
    if (sectionData[id]) return // already loaded
    setLoading(true)
    try {
      const result = await fetchCMSSection(id)
      setSectionData(prev => ({ ...prev, [id]: result?.data || {} }))
    } catch {
      setSectionData(prev => ({ ...prev, [id]: {} }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSection(activeId) }, [activeId])

  const currentData = sectionData[activeId] || {}
  const setCurrentData = (val: any) => setSectionData(prev => ({ ...prev, [activeId]: val }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put(`/admin/cms/${activeId}`, { section_key: activeId, data: currentData })
      toast.success(`${activeSection.name} saved!`)
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const renderForm = () => {
    if (loading) return (
      <div className="py-20 text-center space-y-4 animate-pulse">
        <div className="w-16 h-16 bg-grey-100 rounded-2xl mx-auto" />
        <div className="h-4 bg-grey-100 rounded w-1/3 mx-auto" />
        <div className="h-3 bg-grey-100 rounded w-1/2 mx-auto" />
      </div>
    )
    if (activeId === 'site_settings') return <GlobalSettingsForm data={currentData} setData={setCurrentData} />
    if (activeId === 'hero') return <HeroForm data={currentData} setData={setCurrentData} />
    if (activeId === 'categories_showcase') return <CategoriesForm data={currentData} setData={setCurrentData} categories={categories} />
    if (activeId === 'promo_banner') return <PromoForm data={currentData} setData={setCurrentData} />
    if (activeId === 'about_teaser') return <AboutForm data={currentData} setData={setCurrentData} />
    if (activeId === 'testimonials_section') return <TestimonialsForm data={currentData} setData={setCurrentData} />
    return null
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-earth">CMS Content Editor</h1>
          <p className="text-grey-500 text-sm mt-1">Live-edit homepage sections, copy, images and calls-to-action.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/" target="_blank"
            className="flex items-center gap-2 border border-grey-200 px-5 py-3 rounded-xl text-sm font-bold text-earth hover:border-gold transition-colors bg-white shadow-sm">
            <Eye size={16} /> Preview Store
          </Link>
          <button onClick={handleSave} disabled={saving}
            className="btn-primary flex items-center gap-2 px-6 py-3 shadow-xl disabled:opacity-60">
            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-grow flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-white rounded-2xl border border-grey-200 shadow-sm overflow-hidden flex flex-col shrink-0">
          <div className="px-6 py-4 border-b border-grey-100 bg-grey-100/50">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-grey-500">Homepage Sections</h3>
          </div>
          <nav className="p-3 space-y-1 flex-1">
            {SECTIONS.map(s => {
              const Icon = s.icon
              const isActive = activeId === s.id
              return (
                <button key={s.id} onClick={() => setActiveId(s.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-gold text-white shadow-md' : 'text-grey-600 hover:text-earth hover:bg-grey-100'}`}>
                  <div className="flex items-center gap-3">
                    <Icon size={16} /> {s.name}
                  </div>
                  {isActive && <ChevronRight size={14} />}
                </button>
              )
            })}
          </nav>
          <div className="px-5 py-4 border-t border-grey-100 text-[10px] text-grey-400 text-center">
            Changes apply live on next save
          </div>
        </aside>

        {/* Editor Panel */}
        <div className="flex-grow bg-white rounded-2xl border border-grey-200 shadow-sm overflow-y-auto">
          {/* Panel Header */}
          <div className="sticky top-0 bg-white z-10 border-b border-grey-100 px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => { const Icon = activeSection.icon; return <div className="p-2 bg-gold/10 rounded-xl"><Icon size={18} className="text-gold" /></div> })()}
              <div>
                <h2 className="font-bold text-earth">{activeSection.name} Configuration</h2>
                <p className="text-xs text-grey-500">Editing: <code className="bg-grey-100 px-1.5 py-0.5 rounded text-[10px] font-mono">{activeSection.dbKey}</code></p>
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${Object.keys(currentData).length > 0 ? 'bg-green/10 text-green' : 'bg-grey-100 text-grey-500'}`}>
              {Object.keys(currentData).length > 0 ? 'Loaded' : 'Empty'}
            </span>
          </div>

          {/* Form Content */}
          <div className="p-8 max-w-3xl">
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminCMSEditor
