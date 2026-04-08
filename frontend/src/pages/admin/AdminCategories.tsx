import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, X, AlertTriangle, FolderTree, ChevronUp, ChevronDown } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { adminFetchCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../services/api'
import ImportModal from '../../components/admin/ImportModal'

const EMPTY = { name: '', slug: '', description: '', image_url: '', display_order: 0, is_active: true }

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    try { 
      const data = await adminFetchCategories()
      // Ensure they are sorted by display_order
      setCategories(data.sort((a: any, b: any) => a.display_order - b.display_order)) 
    }
    catch { toast.error('Failed to load categories') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleReorder = async (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= categories.length) return

    const current = categories[currentIndex]
    const target = categories[targetIndex]

    // Swap their display orders
    const oldOrder = current.display_order
    const newOrder = target.display_order

    // If orders are identical, we need to re-index everything or just offset them
    // For simplicity, we assume we want current to be newOrder and target to be oldOrder
    // If they are the same (e.g. both 0), we force a difference
    const finalCurrentOrder = newOrder
    const finalTargetOrder = (newOrder === oldOrder) ? (direction === 'up' ? newOrder + 1 : newOrder - 1) : oldOrder

    try {
      // Optimistic update
      const newCategories = [...categories]
      newCategories[currentIndex] = { ...current, display_order: finalCurrentOrder }
      newCategories[targetIndex] = { ...target, display_order: finalTargetOrder }
      setCategories(newCategories.sort((a: any, b: any) => a.display_order - b.display_order))

      await Promise.all([
        adminUpdateCategory(current.id, { display_order: finalCurrentOrder }),
        adminUpdateCategory(target.id, { display_order: finalTargetOrder })
      ])
      toast.success('Order updated')
    } catch {
      toast.error('Failed to update order')
      load() // Rollback
    }
  }

  const autoSlug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY }); setModalOpen(true) }
  const openEdit = (c: any) => {
    setEditing(c)
    setForm({ name: c.name, slug: c.slug, description: c.description || '', image_url: c.image_url || '', display_order: c.display_order, is_active: c.is_active })
    setModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async () => {
    if (!form.name) { toast.error('Name is required'); return }
    setSaving(true)
    const payload = { ...form, slug: form.slug || autoSlug(form.name), display_order: Number(form.display_order) }
    try {
      if (editing) { await adminUpdateCategory(editing.id, payload); toast.success('Category updated!') }
      else { await adminCreateCategory(payload); toast.success('Category created!') }
      setModalOpen(false); load()
    } catch (err: any) { toast.error(err?.response?.data?.detail || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try { await adminDeleteCategory(deleteTarget.id); toast.success('Category deleted'); setDeleteTarget(null); load() }
    catch { toast.error('Delete failed — category may have products') }
    finally { setDeleting(false) }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-earth">Categories</h1>
          <p className="text-grey-500 text-sm mt-1">Organise your product catalog into browsable sections.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setImportOpen(true)} className="flex items-center gap-2 px-5 py-3 border border-gold text-gold rounded-xl text-sm font-bold hover:bg-gold/10 transition-colors">
            <FolderTree size={18} /> Import
          </button>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 px-6 py-3 shadow-xl">
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      {importOpen && (
        <ImportModal type="categories" onClose={() => setImportOpen(false)} onSuccess={() => { setImportOpen(false); load() }} />
      )}

      <div className="bg-white rounded-2xl border border-grey-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-grey-100 text-grey-500 text-[10px] uppercase font-bold tracking-widest">
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100">
            {loading ? Array(4).fill(0).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {Array(6).fill(0).map((__, j) => <td key={j} className="px-6 py-5"><div className="h-4 bg-grey-100 rounded w-2/3" /></td>)}
              </tr>
            )) : categories.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-20 text-center">
                <FolderTree size={36} className="mx-auto text-grey-200 mb-3" />
                <p className="text-grey-500 text-sm">No categories yet. Add one above.</p>
              </td></tr>
            ) : categories.map((cat, index) => (
              <tr key={cat.id} className="hover:bg-grey-100/30 group transition-all">
                <td className="px-6 py-4">
                  <div className="flex flex-col -space-y-1">
                    <button 
                      onClick={() => handleReorder(index, 'up')} 
                      disabled={index === 0}
                      className={`p-1 rounded hover:bg-gold/10 transition-colors ${index === 0 ? 'text-grey-200 cursor-not-allowed' : 'text-grey-400 hover:text-gold'}`}
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button 
                      onClick={() => handleReorder(index, 'down')} 
                      disabled={index === categories.length - 1}
                      className={`p-1 rounded hover:bg-gold/10 transition-colors ${index === categories.length - 1 ? 'text-grey-200 cursor-not-allowed' : 'text-grey-400 hover:text-gold'}`}
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-grey-100">
                    {cat.image_url ? <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" /> : <FolderTree size={18} className="m-auto mt-3 text-grey-300" />}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-earth">{cat.name}</td>
                <td className="px-6 py-4 text-grey-500 text-sm font-mono">{cat.slug}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${cat.is_active ? 'bg-green/10 text-green' : 'bg-grey-200 text-grey-500'}`}>{cat.is_active ? 'Active' : 'Hidden'}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(cat)} className="p-2 text-grey-500 hover:text-gold hover:bg-gold/10 rounded-lg"><Edit3 size={16} /></button>
                    <button onClick={() => setDeleteTarget(cat)} className="p-2 text-grey-500 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-earth/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-grey-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-earth">{editing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-grey-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="flex-1 px-8 py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Category Name *</label>
                <input name="name" value={form.name} onChange={handleChange} onBlur={() => !form.slug && setForm(f => ({ ...f, slug: autoSlug(f.name) }))}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="e.g. Flours & Grains" />
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">URL Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold font-mono text-grey-600" placeholder="auto-generated" />
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Image URL</label>
                <input name="image_url" value={form.image_url} onChange={handleChange}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none" placeholder="Optional short description..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Display Order</label>
                <input name="display_order" type="number" value={form.display_order} onChange={handleChange}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="w-4 h-4 accent-gold" />
                <span className="text-sm font-semibold text-earth">Active (visible on site)</span>
              </label>
            </div>
            <div className="px-8 py-5 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => setModalOpen(false)} className="px-5 py-3 border border-grey-200 rounded-xl text-sm font-bold hover:border-gold">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-gold text-white rounded-xl text-sm font-bold shadow hover:bg-gold-light disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-earth/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto"><AlertTriangle size={28} className="text-red-500" /></div>
            <h3 className="text-xl font-bold text-earth">Delete Category?</h3>
            <p className="text-sm text-grey-700">This may affect products in <strong>"{deleteTarget.name}"</strong>. This action cannot be undone.</p>
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
export default AdminCategories
