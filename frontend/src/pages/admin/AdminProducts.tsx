import { useState, useEffect } from 'react'
import { Plus, Search, Edit3, Trash2, ExternalLink, X, ChevronLeft, ChevronRight, AlertTriangle, Package, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import {
  adminFetchProducts,
  adminFetchCategories,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUploadImage,
} from '../../services/api'
import ImportModal from '../../components/admin/ImportModal'

const EMPTY_FORM = {
  name: '',
  slug: '',
  short_description: '',
  full_description_html: '',
  price: '',
  sale_price: '',
  sku: '',
  stock_quantity: '',
  weight_grams: '',
  country_of_origin: '',
  category_id: '',
  images: '',
  dietary_tags: '',
  is_featured: false,
  is_new_arrival: false,
  is_active: true,
}

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const PER_PAGE = 200

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)

  // Import modal state
  const [importOpen, setImportOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [prods, cats] = await Promise.all([adminFetchProducts(), adminFetchCategories()])
      setProducts(prods)
      setCategories(cats)
    } catch (err) {
      toast.error('Failed to load products — are you logged in as admin?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.country_of_origin?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE)
  const pagedProducts = filteredProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const openAddModal = () => {
    setEditingProduct(null)
    setForm({ ...EMPTY_FORM })
    setModalOpen(true)
  }

  const openEditModal = (product: any) => {
    setEditingProduct(product)
    setForm({
      name: product.name || '',
      slug: product.slug || '',
      short_description: product.short_description || '',
      full_description_html: product.full_description_html || '',
      price: product.price ?? '',
      sale_price: product.sale_price ?? '',
      sku: product.sku || '',
      stock_quantity: product.stock_quantity ?? '',
      weight_grams: product.weight_grams ?? '',
      country_of_origin: product.country_of_origin || '',
      category_id: product.category_id?.toString() || '',
      images: (product.images || []).join(', '),
      dietary_tags: (product.dietary_tags || []).join(', '),
      is_featured: product.is_featured || false,
      is_new_arrival: product.is_new_arrival || false,
      is_active: product.is_active ?? true,
    })
    setModalOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const res = await adminUploadImage(file)
      const currentImages = (form.images as string).split(',').map(s => s.trim()).filter(Boolean)
      const newImages = [...currentImages, res.url].join(', ')
      setForm(prev => ({ ...prev, images: newImages }))
      toast.success('Image uploaded!')
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || 'Image upload failed.'
      toast.error(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  const autoSlug = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')

  const handleSave = async () => {
    const missingFields = []
    if (!form.name.trim()) missingFields.push('Product Name')
    if (!form.price.toString().trim()) missingFields.push('Price')
    if (!form.category_id) missingFields.push('Category')
    if (!form.sku.trim()) missingFields.push('SKU')

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`, {
        icon: '⚠️',
        duration: 4000
      })
      return
    }
    setSaving(true)
    const cid = parseInt(form.category_id as string)
    const payload = {
      ...form,
      slug: form.slug || autoSlug(form.name),
      price: parseFloat(form.price as string) || 0,
      sale_price: form.sale_price !== '' ? parseFloat(form.sale_price as string) : null,
      stock_quantity: parseInt(form.stock_quantity as string) || 0,
      weight_grams: parseInt(form.weight_grams as string) || 0,
      category_id: isNaN(cid) ? null : cid,
      images: (form.images as string).split(',').map((s: string) => s.trim()).filter(Boolean),
      dietary_tags: (form.dietary_tags as string).split(',').map((s: string) => s.trim()).filter(Boolean),
    }
    try {
      if (editingProduct) {
        await adminUpdateProduct(editingProduct.id, payload)
        toast.success('Product updated!')
      } else {
        await adminCreateProduct(payload)
        toast.success('Product created!')
      }
      setModalOpen(false)
      loadData()
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Save failed. Check all required fields.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminDeleteProduct(deleteTarget.id)
      toast.success(`"${deleteTarget.name}" deleted.`)
      setDeleteTarget(null)
      loadData()
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Delete failed.')
    } finally {
      setDeleting(false)
    }
  }

  const statusLabel = (p: any) => {
    if (p.stock_quantity === 0) return { label: 'Out of Stock', cls: 'bg-red-50 text-red-600' }
    if (p.stock_quantity <= 10) return { label: 'Low Stock', cls: 'bg-gold/10 text-gold' }
    return { label: 'In Stock', cls: 'bg-green/10 text-green' }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-earth">Products Management</h1>
          <p className="text-grey-500 text-sm mt-1">Manage your catalog, stock levels, and pricing.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 px-5 py-3 border border-gold text-gold rounded-xl text-sm font-bold hover:bg-gold/10 transition-colors shadow-sm">
            <Upload size={16} /> Import CSV / Excel
          </button>
          <button onClick={openAddModal} className="btn-primary flex items-center gap-2 px-6 py-3 shadow-xl whitespace-nowrap">
            <Plus size={20} /> Add New Product
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {importOpen && (
        <ImportModal
          type="products"
          onClose={() => setImportOpen(false)}
          onSuccess={() => { setImportOpen(false); loadData() }}
        />
      )}

      {/* Filters Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-grey-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-grow max-w-md bg-grey-100 px-4 py-3 rounded-xl border border-grey-200">
          <Search size={16} className="text-grey-500 shrink-0" />
          <input
            placeholder="Search by name, SKU or origin..."
            className="bg-transparent text-sm w-full focus:outline-none"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
          />
        </div>
        <span className="text-xs text-grey-500 font-semibold">{filteredProducts.length} products total</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-grey-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-grey-100 text-grey-500 text-[10px] uppercase font-bold tracking-widest">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-100">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array(7).fill(0).map((__, j) => (
                      <td key={j} className="px-6 py-5"><div className="h-4 bg-grey-100 rounded w-3/4"></div></td>
                    ))}
                  </tr>
                ))
              ) : pagedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <Package size={40} className="mx-auto text-grey-200 mb-3" />
                    <p className="text-grey-500 text-sm font-semibold">No products found.</p>
                  </td>
                </tr>
              ) : pagedProducts.map((p) => {
                const status = statusLabel(p)
                const cat = categories.find(c => c.id === p.category_id)
                return (
                  <tr key={p.id} className="hover:bg-grey-100/30 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-grey-100 shrink-0">
                          {p.images?.[0]
                            ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            : <Package size={20} className="m-auto mt-2.5 text-grey-300" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-bold text-earth line-clamp-1 max-w-[200px]">{p.name}</p>
                          <p className="text-[10px] text-grey-500 font-bold uppercase tracking-widest">SKU: {p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {cat ? (
                        <span className="text-xs font-bold text-grey-700 bg-grey-100 px-3 py-1 rounded-full">{cat.name}</span>
                      ) : (
                        <span className="text-xs font-bold text-grey-400 bg-grey-50 px-3 py-1 rounded-full border border-grey-100 italic">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gold">£{p.price}</span>
                        {p.sale_price && <span className="text-[10px] text-grey-500 line-through">£{p.sale_price}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${p.stock_quantity <= 10 ? 'text-clay' : 'text-earth'}`}>{p.stock_quantity} units</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${status.cls}`}>{status.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${p.is_featured ? 'bg-gold/15 text-gold' : 'bg-grey-100 text-grey-500'}`}>
                        {p.is_featured ? 'Featured' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(p)} className="p-2 text-grey-500 hover:text-gold hover:bg-gold/10 rounded-lg transition-all" title="Edit">
                          <Edit3 size={16} />
                        </button>
                        <Link to={`/product/${p.slug}`} target="_blank" className="p-2 text-grey-500 hover:text-earth hover:bg-earth/10 rounded-lg transition-all" title="View on site">
                          <ExternalLink size={16} />
                        </Link>
                        <button onClick={() => setDeleteTarget(p)} className="p-2 text-grey-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredProducts.length > PER_PAGE && (
          <div className="p-5 border-t border-grey-100 flex justify-between items-center bg-grey-100/20">
            <span className="text-xs font-semibold text-grey-500">
              Page {page} of {totalPages} ({filteredProducts.length} items)
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="flex items-center gap-1 px-3 py-2 border border-grey-200 rounded-lg text-xs font-bold text-grey-500 hover:border-gold transition-colors disabled:opacity-40">
                <ChevronLeft size={14} /> Prev
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-2 bg-earth text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-40">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== ADD / EDIT MODAL ===== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-earth/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

          {/* Slide-over Panel */}
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-grey-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-earth">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <p className="text-xs text-grey-500 mt-0.5">{editingProduct ? `Editing: ${editingProduct.name}` : 'Fill in the details below to add to your catalog.'}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-grey-100 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <div className="flex-1 px-8 py-6 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Product Name *</label>
                  <input name="name" value={form.name} onChange={handleFormChange}
                    onBlur={() => !form.slug && setForm(f => ({ ...f, slug: autoSlug(f.name) }))}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="e.g. Mama Gold Premium Rice" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">SKU *</label>
                  <input name="sku" value={form.sku} onChange={handleFormChange}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="e.g. RG-001" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">URL Slug</label>
                  <input name="slug" value={form.slug} onChange={handleFormChange}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold text-grey-500" placeholder="auto-generated from name" />
                </div>
              </div>

              {/* Category & Origin */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Category *</label>
                  <select name="category_id" value={form.category_id} onChange={handleFormChange}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold bg-white">
                    <option value="">Select category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Country of Origin</label>
                  <input name="country_of_origin" value={form.country_of_origin} onChange={handleFormChange}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="e.g. Nigeria" />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Price (£) *</label>
                  <input name="price" type="number" step="0.01" value={form.price} onChange={handleFormChange}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Sale Price (£)</label>
                  <input name="sale_price" type="number" step="0.01" value={form.sale_price} onChange={handleFormChange}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Stock (units)</label>
                  <input name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleFormChange}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="0" />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Weight (grams)</label>
                <input name="weight_grams" type="number" value={form.weight_grams} onChange={handleFormChange}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="e.g. 500" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Short Description</label>
                <textarea name="short_description" value={form.short_description} onChange={handleFormChange} rows={2}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none" placeholder="One sentence summary..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Full Description (HTML)</label>
                <textarea name="full_description_html" value={form.full_description_html} onChange={handleFormChange} rows={4}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none font-mono" placeholder="<p>Full product description...</p>" />
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-3">Product Images</label>
                
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {/* Image Gallery */}
                  {(form.images as string).split(',').map(s => s.trim()).filter(Boolean).map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-grey-100 border border-grey-200 shadow-sm">
                      <img src={url} alt="Product" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => {
                          const imgs = (form.images as string).split(',').map(s => s.trim()).filter(Boolean);
                          imgs.splice(idx, 1);
                          setForm(prev => ({ ...prev, images: imgs.join(', ') }));
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload Button */}
                  <label 
                    htmlFor="product-image-upload"
                    className="aspect-square rounded-xl border-2 border-dashed border-grey-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-gold hover:bg-gold/5 transition-all group relative overflow-hidden"
                  >
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Plus size={20} className="text-grey-400 group-hover:text-gold" />
                        <span className="text-[10px] font-bold text-grey-400 group-hover:text-gold uppercase tracking-tighter">Upload</span>
                      </>
                    )}
                    <input 
                      id="product-image-upload"
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      disabled={uploading} 
                    />
                  </label>
                </div>

                <div className="relative">
                  <textarea name="images" value={form.images} onChange={handleFormChange} rows={2}
                    className="w-full border border-grey-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-gold resize-none bg-grey-50 text-grey-500" placeholder="Or paste manually: https://..., https://..." />
                  <p className="text-[10px] text-grey-400 mt-1 uppercase font-bold tracking-widest">Supports manual editing (comma-separated)</p>
                </div>
              </div>

              {/* Dietary Tags */}
              <div>
                <label className="block text-xs font-bold text-grey-700 uppercase tracking-widest mb-1.5">Dietary Tags (comma-separated)</label>
                <input name="dietary_tags" value={form.dietary_tags} onChange={handleFormChange}
                  className="w-full border border-grey-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold" placeholder="e.g. Vegan, Gluten Free" />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2">
                {[
                  { field: 'is_featured', label: 'Featured Product' },
                  { field: 'is_new_arrival', label: 'New Arrival' },
                  { field: 'is_active', label: 'Active (visible on site)' },
                ].map(({ field, label }) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" name={field} checked={!!(form as any)[field]} onChange={handleFormChange}
                      className="w-4 h-4 rounded border-grey-300 accent-gold" />
                    <span className="text-sm font-semibold text-earth group-hover:text-gold transition-colors">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-grey-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => setModalOpen(false)} className="px-5 py-3 border border-grey-200 rounded-xl text-sm font-bold text-grey-700 hover:border-gold transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-8 py-3 bg-gold text-white rounded-xl text-sm font-bold shadow-lg hover:bg-gold-light transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM DIALOG ===== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-earth/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-earth">Delete Product?</h3>
            <p className="text-sm text-grey-700">
              You are about to permanently delete <strong>"{deleteTarget.name}"</strong>. This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3 border border-grey-200 rounded-xl text-sm font-bold text-grey-700 hover:border-gold transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-60">
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts
