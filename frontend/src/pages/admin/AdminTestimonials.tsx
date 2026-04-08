import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, X, AlertTriangle, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { adminFetchTestimonials, adminCreateTestimonial, adminUpdateTestimonial, adminDeleteTestimonial } from '../../services/api'
import ImportModal from '../../components/admin/ImportModal'

const EMPTY = { reviewer_name: '', location: '', avatar_url: '', rating: 5, comment: '', display_order: 0, is_active: true }

const AdminTestimonials = () => {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setItems(await adminFetchTestimonials()) }
    catch { toast.error('Failed to load testimonials') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY }); setModalOpen(true) }
  const openEdit = (t: any) => { setEditing(t); setForm({ ...t }); setModalOpen(true) }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm((f: any) => ({ ...f, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }))
  }

  const handleSave = async () => {
    if (!form.reviewer_name || !form.comment) { toast.error('Name and comment are required'); return }
    setSaving(true)
    try {
      if (editing) { await adminUpdateTestimonial(editing.id, form); toast.success('Testimonial updated!') }
      else { await adminCreateTestimonial(form); toast.success('Testimonial added!') }
      setModalOpen(false); load()
    } catch (err: any) { toast.error(err?.response?.data?.detail || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try { await adminDeleteTestimonial(deleteTarget.id); toast.success('Testimonial deleted'); setDeleteTarget(null); load() }
    catch { toast.error('Delete failed') }
    finally { setDeleting(false) }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-earth">Testimonials</h1>
          <p className="text-grey-500 text-sm mt-1">Manage customer reviews shown on the homepage.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setImportOpen(true)} className="flex items-center gap-2 px-5 py-3 border border-gold text-gold rounded-xl text-sm font-bold hover:bg-gold/10 transition-colors">
            <Star size={18} /> Import
          </button>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 px-6 py-3 shadow-xl">
            <Plus size={18} /> Add Testimonial
          </button>
        </div>
      </div>

      {importOpen && (
        <ImportModal type="testimonials" onClose={() => setImportOpen(false)} onSuccess={() => { setImportOpen(false); load() }} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-grey-200 p-6 animate-pulse space-y-3">
            <div className="flex gap-3 items-center"><div className="w-12 h-12 rounded-full bg-grey-100" /><div className="space-y-2 flex-1"><div className="h-4 bg-grey-100 rounded w-1/2" /><div className="h-3 bg-grey-100 rounded w-1/3" /></div></div>
            <div className="h-16 bg-grey-100 rounded" />
          </div>
        )) : items.length === 0 ? (
          <div className="col-span-3 py-20 text-center bg-white rounded-2xl border border-grey-200">
            <Star size={36} className="mx-auto text-grey-200 mb-3" />
            <p className="text-grey-500 text-sm">No testimonials yet. Add your first review.</p>
          </div>
        ) : items.map(t => (
          <div key={t.id} className={`group bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 ${t.is_active ? 'border-grey-200' : 'border-dashed border-grey-300 opacity-60'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/10 overflow-hidden flex items-center justify-center font-bold text-gold text-lg">
                  {t.avatar_url ? <img src={t.avatar_url} alt={t.reviewer_name} className="w-full h-full object-cover" /> : t.reviewer_name[0]}
                </div>
                <div>
                  <p className="font-bold text-earth text-sm">{t.reviewer_name}</p>
                  <p className="text-xs text-grey-500">{t.location}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(t)} className="p-1.5 text-grey-500 hover:text-gold hover:bg-gold/10 rounded-lg"><Edit3 size={14} /></button>
                <button onClick={() => setDeleteTarget(t)} className="p-1.5 text-grey-500 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= t.rating ? '#C9933A' : 'transparent'} stroke={s <= t.rating ? '#C9933A' : '#9E8E78'} />)}
            </div>
            <p className="text-sm text-grey-700 leading-relaxed flex-1">"{t.comment}"</p>
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className={t.is_active ? 'text-green' : 'text-grey-500'}>{t.is_active ? 'Active' : 'Hidden'}</span>
              <span className="text-grey-400">Order: {t.display_order}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-earth/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-earth">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-grey-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="flex-1 px-8 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Customer Name *</label>
                  <input name="reviewer_name" value={form.reviewer_name} onChange={handleChange}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="e.g. Amara O." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Location</label>
                  <input name="location" value={form.location} onChange={handleChange}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="e.g. London, UK" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Avatar URL</label>
                <input name="avatar_url" value={form.avatar_url} onChange={handleChange}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setForm((f: any) => ({ ...f, rating: s }))}
                      className={`p-2 rounded-lg transition-all ${form.rating >= s ? 'text-gold' : 'text-grey-300'}`}>
                      <Star size={24} fill={form.rating >= s ? '#C9933A' : 'transparent'} stroke="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Review Comment *</label>
                <textarea name="comment" value={form.comment} onChange={handleChange} rows={4}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none" placeholder="Their review in their own words..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Display Order</label>
                <input name="display_order" type="number" value={form.display_order} onChange={handleChange}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 accent-gold" />
                <span className="text-sm font-semibold text-earth">Active (show on homepage)</span>
              </label>
            </div>
            <div className="px-8 py-5 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => setModalOpen(false)} className="px-5 py-3 border border-grey-200 rounded-xl text-sm font-bold hover:border-gold">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-gold text-white rounded-xl text-sm font-bold shadow hover:bg-gold-light disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Testimonial'}
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
            <h3 className="text-xl font-bold text-earth">Delete Testimonial?</h3>
            <p className="text-sm text-grey-700">Remove review by <strong>"{deleteTarget.reviewer_name}"</strong>?</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-grey-200 rounded-xl text-sm font-bold hover:border-gold">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-60">{deleting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default AdminTestimonials
