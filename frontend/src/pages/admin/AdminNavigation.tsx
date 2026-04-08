import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, X, AlertTriangle, Link as LinkIcon, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { adminFetchNavLinks, adminCreateNavLink, adminUpdateNavLink, adminDeleteNavLink } from '../../services/api'

const EMPTY = { name: '', path: '', display_order: 0, is_active: true }

const AdminNavigation = () => {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [savingReorder, setSavingReorder] = useState(false)

  const load = async () => {
    setLoading(true)
    try { 
      const data = await adminFetchNavLinks()
      setLinks(data.sort((a: any, b: any) => a.display_order - b.display_order)) 
    }
    catch { toast.error('Failed to load navigation links') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleReorder = (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= links.length) return

    const current = links[currentIndex]
    const target = links[targetIndex]

    const finalCurrentOrder = target.display_order
    const finalTargetOrder = (target.display_order === current.display_order) ? (direction === 'up' ? target.display_order + 1 : target.display_order - 1) : current.display_order

    const newLinks = [...links]
    newLinks[currentIndex] = { ...current, display_order: finalCurrentOrder }
    newLinks[targetIndex] = { ...target, display_order: finalTargetOrder }
    setLinks(newLinks.sort((a: any, b: any) => a.display_order - b.display_order))
  }

  const handleSaveReorder = async () => {
    setSavingReorder(true)
    try {
      await Promise.all(
        links.map((link) => adminUpdateNavLink(link.id, link))
      )
      toast.success('Menu changes saved successfully!')
      load()
    } catch {
      toast.error('Failed to save navigation changes')
    } finally {
      setSavingReorder(false)
    }
  }

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY }); setModalOpen(true) }
  const openEdit = (l: any) => {
    setEditing(l)
    setForm({ name: l.name, path: l.path, display_order: l.display_order, is_active: l.is_active })
    setModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async () => {
    if (!form.name || !form.path) { toast.error('Name and Path are required'); return }
    setSaving(true)
    const payload = { ...form, display_order: Number(form.display_order) }
    try {
      if (editing) { await adminUpdateNavLink(editing.id, payload); toast.success('Link updated!') }
      else { await adminCreateNavLink(payload); toast.success('Link created!') }
      setModalOpen(false); load()
    } catch (err: any) { toast.error(err?.response?.data?.detail || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try { await adminDeleteNavLink(deleteTarget.id); toast.success('Link deleted'); setDeleteTarget(null); load() }
    catch { toast.error('Delete failed') }
    finally { setDeleting(false) }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-earth">Main Navigation</h1>
          <p className="text-grey-500 text-sm mt-1">Manage the top-level links in your website header.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSaveReorder} disabled={savingReorder} className="flex items-center gap-2 bg-earth text-white px-6 py-3 rounded-xl font-bold hover:bg-earth/80 transition-all shadow-xl disabled:opacity-50">
            {savingReorder ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 px-6 py-3 shadow-xl">
            <Plus size={18} /> Add Menu Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-grey-200 shadow-sm overflow-hidden text-earth">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-grey-100 text-grey-500 text-[10px] uppercase font-bold tracking-widest">
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Link Name</th>
              <th className="px-6 py-4">Path / URL</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100 font-medium">
            {loading ? Array(5).fill(0).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {Array(5).fill(0).map((__, j) => <td key={j} className="px-6 py-5"><div className="h-4 bg-grey-100 rounded w-2/3" /></td>)}
              </tr>
            )) : links.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-20 text-center">
                <LinkIcon size={36} className="mx-auto text-grey-200 mb-3" />
                <p className="text-grey-500 text-sm">No navigation links found. Seed your database or add one above.</p>
              </td></tr>
            ) : links.map((link, index) => (
              <tr key={link.id} className="hover:bg-grey-100/30 group transition-all">
                <td className="px-6 py-4">
                  <div className="flex flex-col -space-y-1">
                    <button onClick={() => handleReorder(index, 'up')} disabled={index === 0}
                      className={`p-1 rounded hover:bg-gold/10 transition-colors ${index === 0 ? 'text-grey-200 cursor-not-allowed' : 'text-grey-400 hover:text-gold'}`}
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button onClick={() => handleReorder(index, 'down')} disabled={index === links.length - 1}
                      className={`p-1 rounded hover:bg-gold/10 transition-colors ${index === links.length - 1 ? 'text-grey-200 cursor-not-allowed' : 'text-grey-400 hover:text-gold'}`}
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-earth">{link.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-grey-500 text-sm font-mono bg-grey-50 px-3 py-1 rounded-lg w-fit">
                    {link.path}
                    <a href={link.path} target="_blank" rel="noreferrer" className="text-grey-300 hover:text-gold"><ExternalLink size={12} /></a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${link.is_active ? 'bg-green/10 text-green' : 'bg-grey-200 text-grey-500'}`}>{link.is_active ? 'Active' : 'Hidden'}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(link)} className="p-2 text-grey-500 hover:text-gold hover:bg-gold/10 rounded-lg"><Edit3 size={16} /></button>
                    <button onClick={() => setDeleteTarget(link)} className="p-2 text-grey-500 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-earth/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-grey-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-earth">{editing ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-grey-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="flex-1 px-8 py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Link Name *</label>
                <input name="name" value={form.name} onChange={handleChange}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="e.g. Specials" />
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Path / URL *</label>
                <input name="path" value={form.path} onChange={handleChange}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold font-mono" placeholder="e.g. /specials" />
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Display Order</label>
                <input name="display_order" type="number" value={form.display_order} onChange={handleChange}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 accent-gold" />
                <span className="text-sm font-semibold text-earth">Active (visible in Navbar)</span>
              </label>
            </div>
            <div className="px-8 py-5 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => setModalOpen(false)} className="px-5 py-3 border border-grey-200 rounded-xl text-sm font-bold hover:border-gold">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-gold text-white rounded-xl text-sm font-bold shadow hover:bg-gold-light disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-earth/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto"><AlertTriangle size={28} className="text-red-500" /></div>
            <h3 className="text-xl font-bold text-earth">Delete Menu Item?</h3>
            <p className="text-sm text-grey-700">This will remove <strong>"{deleteTarget.name}"</strong> from your main navigation menu.</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-grey-200 rounded-xl text-sm font-bold hover:border-gold">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-60">
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminNavigation
