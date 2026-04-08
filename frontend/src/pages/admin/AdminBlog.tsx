import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, X, AlertTriangle, FileText, Globe, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { adminFetchBlog, adminCreatePost, adminUpdatePost, adminDeletePost } from '../../services/api'

const EMPTY = { title: '', slug: '', excerpt: '', content_html: '', category_tag: '', featured_image_url: '', is_published: false }

const AdminBlog = () => {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setPosts(await adminFetchBlog()) }
    catch { toast.error('Failed to load posts') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const autoSlug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
  const openAdd = () => { setEditing(null); setForm({ ...EMPTY }); setModalOpen(true) }
  const openEdit = (p: any) => {
    setEditing(p)
    setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt || '', content_html: p.content_html || '', category_tag: p.category_tag || '', featured_image_url: p.featured_image_url || '', is_published: p.is_published })
    setModalOpen(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return }
    setSaving(true)
    const payload = { ...form, slug: form.slug || autoSlug(form.title) }
    try {
      if (editing) { await adminUpdatePost(editing.id, payload); toast.success('Post updated!') }
      else { await adminCreatePost(payload); toast.success('Post created!') }
      setModalOpen(false); load()
    } catch (err: any) { toast.error(err?.response?.data?.detail || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try { await adminDeletePost(deleteTarget.id); toast.success('Post deleted'); setDeleteTarget(null); load() }
    catch { toast.error('Delete failed') }
    finally { setDeleting(false) }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-earth">Blog Posts</h1>
          <p className="text-grey-500 text-sm mt-1">Create and manage articles, recipes, and stories.</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 px-6 py-3 shadow-xl">
          <Plus size={18} /> New Post
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Total Posts', value: posts.length }, { label: 'Published', value: posts.filter(p => p.is_published).length }, { label: 'Drafts', value: posts.filter(p => !p.is_published).length }].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-grey-200 p-5 text-center shadow-sm">
            <p className="text-3xl font-bold text-earth">{s.value}</p>
            <p className="text-xs text-grey-500 font-semibold uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-grey-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-grey-100 text-grey-500 text-[10px] uppercase font-bold tracking-widest">
              <th className="px-6 py-4">Post</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-100">
            {loading ? Array(3).fill(0).map((_, i) => (
              <tr key={i} className="animate-pulse">{Array(5).fill(0).map((__, j) => <td key={j} className="px-6 py-5"><div className="h-4 bg-grey-100 rounded w-2/3" /></td>)}</tr>
            )) : posts.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-20 text-center">
                <FileText size={36} className="mx-auto text-grey-200 mb-3" />
                <p className="text-grey-500 text-sm">No posts yet. Write your first article.</p>
              </td></tr>
            ) : posts.map(p => (
              <tr key={p.id} className="hover:bg-grey-100/30 group transition-all">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-grey-100 shrink-0">
                      {p.featured_image_url ? <img src={p.featured_image_url} alt={p.title} className="w-full h-full object-cover" /> : <FileText size={18} className="m-auto mt-3 text-grey-300" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-earth line-clamp-1 max-w-xs">{p.title}</p>
                      <p className="text-[10px] text-grey-500 font-mono">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {p.category_tag && <span className="text-xs font-bold text-grey-700 bg-grey-100 px-3 py-1 rounded-full">{p.category_tag}</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit ${p.is_published ? 'bg-green/10 text-green' : 'bg-gold/10 text-gold'}`}>
                    {p.is_published ? <Globe size={10} /> : <EyeOff size={10} />}
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-grey-500">{new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(p)} className="p-2 text-grey-500 hover:text-gold hover:bg-gold/10 rounded-lg"><Edit3 size={16} /></button>
                    <button onClick={() => setDeleteTarget(p)} className="p-2 text-grey-500 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
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
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-grey-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-earth">{editing ? 'Edit Post' : 'New Blog Post'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-grey-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="flex-1 px-8 py-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Title *</label>
                <input name="title" value={form.title} onChange={handleChange} onBlur={() => !form.slug && setForm(f => ({ ...f, slug: autoSlug(f.title) }))}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="e.g. 5 Authentic Nigerian Recipes" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">URL Slug</label>
                  <input name="slug" value={form.slug} onChange={handleChange}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold font-mono text-grey-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Category Tag</label>
                  <input name="category_tag" value={form.category_tag} onChange={handleChange}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="e.g. Recipes" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Featured Image URL</label>
                <input name="featured_image_url" value={form.featured_image_url} onChange={handleChange}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Excerpt</label>
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none" placeholder="Short summary shown on listing pages..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Content (HTML)</label>
                <textarea name="content_html" value={form.content_html} onChange={handleChange} rows={10}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none font-mono" placeholder="<p>Your article content here...</p>" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} className="w-4 h-4 accent-gold" />
                <span className="text-sm font-semibold text-earth">Publish immediately (visible on site)</span>
              </label>
            </div>
            <div className="px-8 py-5 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => setModalOpen(false)} className="px-5 py-3 border border-grey-200 rounded-xl text-sm font-bold hover:border-gold">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-gold text-white rounded-xl text-sm font-bold shadow hover:bg-gold-light disabled:opacity-60">
                {saving ? 'Saving...' : form.is_published ? (editing ? 'Save & Publish' : 'Create & Publish') : (editing ? 'Save Draft' : 'Save as Draft')}
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
            <h3 className="text-xl font-bold text-earth">Delete Post?</h3>
            <p className="text-sm text-grey-700">Permanently delete <strong>"{deleteTarget.title}"</strong>?</p>
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
export default AdminBlog
