import { useState, useEffect } from 'react'
import { Save, Loader2, Globe, Mail, Phone, MapPin, Share2, Info } from 'lucide-react'
import { fetchCMSSection, adminUpdateCMSSection } from '../../services/api'
import { toast } from 'react-hot-toast'

const AdminSettings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    site_name: '',
    footer_description: '',
    copyright: '',
    contact_info: {
      address: '',
      email: '',
      phone: ''
    },
    social_links: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await fetchCMSSection('site_settings')
      if (data && data.data) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminUpdateCMSSection('site_settings', settings)
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const updateNestedSetting = (category: 'contact_info' | 'social_links', field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-black text-earth tracking-tight">Site Settings</h2>
          <p className="text-grey-500 mt-2">Manage global information and footer content.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gold text-white px-8 py-3 rounded-xl font-bold hover:bg-earth transition-all shadow-lg shadow-gold/20 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* General Settings */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-grey-100 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-grey-100">
            <div className="p-2 bg-gold/10 text-gold rounded-lg">
              <Globe size={20} />
            </div>
            <h3 className="text-xl font-bold text-earth">General Info</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-grey-400 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-grey-200 focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none"
                placeholder="e.g. Kowope Foods"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-grey-400 mb-2">Brand Description (Footer)</label>
              <textarea
                value={settings.footer_description}
                onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-grey-200 focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none resize-none"
                placeholder="Briefly describe your brand for the footer..."
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-grey-400 mb-2">Copyright Text</label>
              <input
                type="text"
                value={settings.copyright}
                onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-grey-200 focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none"
                placeholder="e.g. 2024 Kowope Foods. All rights reserved."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-grey-100 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-grey-100">
            <div className="p-2 bg-clay/10 text-clay rounded-lg">
              <Info size={20} />
            </div>
            <h3 className="text-xl font-bold text-earth">Contact Details</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-grey-400 mb-2 flex items-center gap-2">
                <MapPin size={12} /> Store Address
              </label>
              <input
                type="text"
                value={settings.contact_info.address}
                onChange={(e) => updateNestedSetting('contact_info', 'address', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-grey-200 focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-grey-400 mb-2 flex items-center gap-2">
                <Mail size={12} /> Contact Email
              </label>
              <input
                type="email"
                value={settings.contact_info.email}
                onChange={(e) => updateNestedSetting('contact_info', 'email', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-grey-200 focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-grey-400 mb-2 flex items-center gap-2">
                <Phone size={12} /> Phone Number
              </label>
              <input
                type="text"
                value={settings.contact_info.phone}
                onChange={(e) => updateNestedSetting('contact_info', 'phone', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-grey-200 focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-grey-100 space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3 pb-4 border-b border-grey-100">
            <div className="p-2 bg-earth/10 text-earth rounded-lg">
              <Share2 size={20} />
            </div>
            <h3 className="text-xl font-bold text-earth">Social Media Profiles</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-grey-400 mb-2">Instagram URL</label>
              <input
                type="text"
                value={settings.social_links.instagram}
                onChange={(e) => updateNestedSetting('social_links', 'instagram', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-grey-200 focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none font-mono text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-grey-400 mb-2">Facebook URL</label>
              <input
                type="text"
                value={settings.social_links.facebook}
                onChange={(e) => updateNestedSetting('social_links', 'facebook', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-grey-200 focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none font-mono text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-grey-400 mb-2">Twitter URL</label>
              <input
                type="text"
                value={settings.social_links.twitter}
                onChange={(e) => updateNestedSetting('social_links', 'twitter', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-grey-200 focus:ring-2 focus:ring-gold/20 focus:border-gold transition-all outline-none font-mono text-sm"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}

export default AdminSettings
