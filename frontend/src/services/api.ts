import axios from 'axios'

const API_BASE_URL = 'http://localhost:9000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

// Add auth token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Public endpoints
export const fetchProducts = async (params = {}) => {
  const response = await api.get('/products', { params })
  return response.data
}

export const fetchProductBySlug = async (slug: string) => {
  const response = await api.get(`/products/${slug}`)
  return response.data
}

export const fetchFeaturedProducts = async () => {
  const response = await api.get('/products/featured')
  return response.data
}

export const fetchCategories = async () => {
  const response = await api.get('/categories')
  return response.data
}

export const fetchCMSSection = async (key: string) => {
  try {
    const response = await api.get(`/cms/${key}`)
    return response.data
  } catch (error) {
    console.warn(`CMS Section ${key} failed to load or not found.`)
    return { data: null }
  }
}

export const adminUpdateCMSSection = async (key: string, data: any) => {
  const response = await api.put(`/admin/cms/${key}`, { section_key: key, data })
  return response.data
}

export const fetchNavLinks = async () => {
  const response = await api.get(`/nav-links?t=${new Date().getTime()}`)
  return response.data
}

// Admin Auth
// ...
// Admin Navigation CRUD
export const adminFetchNavLinks = async () => {
  const response = await api.get('/admin/nav-links')
  return response.data
}
export const adminCreateNavLink = async (data: any) => {
  const response = await api.post('/admin/nav-links', data)
  return response.data
}
export const adminUpdateNavLink = async (id: number, data: any) => {
  const response = await api.put(`/admin/nav-links/${id}`, data)
  return response.data
}
export const adminDeleteNavLink = async (id: number) => {
  const response = await api.delete(`/admin/nav-links/${id}`)
  return response.data
}
export const adminLogin = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password })
  return response.data
}

// Admin Products CRUD
export const adminFetchProducts = async () => {
  const response = await api.get('/admin/products')
  return response.data
}

export const adminFetchCategories = async () => {
  const response = await api.get('/admin/categories')
  return response.data
}

export const adminUploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/admin/upload', formData)
  return response.data
}

export const adminCreateProduct = async (data: any) => {
  const response = await api.post('/admin/products', data)
  return response.data
}

export const adminUpdateProduct = async (id: number, data: any) => {
  const response = await api.put(`/admin/products/${id}`, data)
  return response.data
}

export const adminDeleteProduct = async (id: number) => {
  const response = await api.delete(`/admin/products/${id}`)
  return response.data
}

export const adminImportProducts = async (rows: any[]) => {
  const response = await api.post('/admin/products/import', { rows }, { timeout: 60000 })
  return response.data
}

export const adminImportCategories = async (rows: any[]) => {
  const response = await api.post('/admin/categories/import', { rows }, { timeout: 60000 })
  return response.data
}

export const adminImportTestimonials = async (rows: any[]) => {
  const response = await api.post('/admin/testimonials/import', { rows }, { timeout: 60000 })
  return response.data
}


export const adminCreateCategory = async (data: any) => {
  const response = await api.post('/admin/categories', data)
  return response.data
}
export const adminUpdateCategory = async (id: number, data: any) => {
  const response = await api.put(`/admin/categories/${id}`, data)
  return response.data
}
export const adminDeleteCategory = async (id: number) => {
  const response = await api.delete(`/admin/categories/${id}`)
  return response.data
}

// Admin Blog CRUD
export const adminFetchBlog = async () => {
  const response = await api.get('/admin/blog')
  return response.data
}
export const adminCreatePost = async (data: any) => {
  const response = await api.post('/admin/blog', data)
  return response.data
}
export const adminUpdatePost = async (id: number, data: any) => {
  const response = await api.put(`/admin/blog/${id}`, data)
  return response.data
}
export const adminDeletePost = async (id: number) => {
  const response = await api.delete(`/admin/blog/${id}`)
  return response.data
}

// Admin Testimonials CRUD
export const adminFetchTestimonials = async () => {
  const response = await api.get('/admin/testimonials')
  return response.data
}
export const adminCreateTestimonial = async (data: any) => {
  const response = await api.post('/admin/testimonials', data)
  return response.data
}
export const adminUpdateTestimonial = async (id: number, data: any) => {
  const response = await api.put(`/admin/testimonials/${id}`, data)
  return response.data
}
export const adminDeleteTestimonial = async (id: number) => {
  const response = await api.delete(`/admin/testimonials/${id}`)
  return response.data
}

// Admin Newsletter
export const adminFetchNewsletter = async () => {
  const response = await api.get('/admin/newsletter')
  return response.data
}
export const adminDeleteSubscriber = async (id: number) => {
  const response = await api.delete(`/admin/newsletter/${id}`)
  return response.data
}

// Admin Stats
export const adminFetchStats = async () => {
  const response = await api.get('/admin/stats')
  return response.data
}

export default api


