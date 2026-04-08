import { useState, useRef, useCallback } from 'react'
import { X, Upload, FileText, CheckCircle2, XCircle, Loader2, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { toast } from 'react-hot-toast'
import { adminImportProducts, adminImportCategories, adminImportTestimonials } from '../../services/api'

interface ImportResult {
  row: number
  status: 'created' | 'skipped'
  name?: string
  reason?: string
  sku?: string
  category?: string
  price?: number
}

type ImportType = 'products' | 'categories' | 'testimonials'

interface ImportModalProps {
  type: ImportType
  onClose: () => void
  onSuccess: () => void
}

const CONFIG = {
  products: {
    title: 'Products',
    headers: ['Name', 'CategoryId', 'SalePriceExTax', 'Barcode', 'Description', 'Stock'],
    importFn: adminImportProducts,
    guide: [
      { col: 'Name', req: true, note: 'Product name' },
      { col: 'CategoryId', req: false, note: 'Category name (must exist)' },
      { col: 'Price', req: false, note: 'SalePriceExTax' },
      { col: 'SKU/Barcode', req: false, note: 'Barcode column' },
    ]
  },
  categories: {
    title: 'Categories',
    headers: ['Name', 'Slug', 'Description', 'Image_URL', 'Display_Order'],
    importFn: adminImportCategories,
    guide: [
      { col: 'Name', req: true, note: 'Category name' },
      { col: 'Slug', req: false, note: 'URL slug (auto-generated if empty)' },
      { col: 'Description', req: false, note: 'Optional text' },
    ]
  },
  testimonials: {
    title: 'Testimonials',
    headers: ['Reviewer_Name', 'Comment', 'Location', 'Rating', 'Avatar_URL'],
    importFn: adminImportTestimonials,
    guide: [
      { col: 'Reviewer_Name', req: true, note: 'Customer name' },
      { col: 'Comment', req: true, note: 'The review text' },
      { col: 'Rating', req: false, note: '1-5 (default: 5)' },
    ]
  }
}

const ACCEPTED = '.csv,.xlsx,.xls'

const ImportModal = ({ type, onClose, onSuccess }: ImportModalProps) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload')
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ total: number; created: number; skipped: number; results: ImportResult[] } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const config = CONFIG[type]

  const parseFile = (file: File) => {
    setFileName(file.name)
    const ext = file.name.split('.').pop()?.toLowerCase()

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          setHeaders(res.meta.fields || [])
          setRows(res.data as any[])
          setStep('preview')
        },
        error: () => toast.error('Failed to parse CSV')
      })
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const wb = XLSX.read(e.target?.result, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json<any>(ws, { defval: '' })
        if (data.length > 0) {
          setHeaders(Object.keys(data[0]))
          setRows(data)
          setStep('preview')
        } else {
          toast.error('Spreadsheet is empty')
        }
      }
      reader.readAsArrayBuffer(file)
    } else {
      toast.error('Unsupported file type. Use .csv, .xlsx, or .xls')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) parseFile(file)
  }, [])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
  }

  const handleImport = async () => {
    setImporting(true)
    try {
      const res = await config.importFn(rows)
      setResult(res)
      setStep('result')
      if (res.created > 0) {
        toast.success(`${res.created} ${type} imported!`)
        onSuccess()
      }
    } catch (err: any) {
      if (err?.code === 'ECONNABORTED') {
        toast.error('Import taking too long. The server is still processing, please check back in a minute.')
      } else {
        toast.error(err?.response?.data?.detail || 'Import failed')
      }
    } finally {
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([config.headers])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template')
    XLSX.writeFile(wb, `kowope_${type}_template.xlsx`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="flex-1 bg-earth/50 backdrop-blur-sm h-full" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white h-full flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-grey-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/10 rounded-xl"><Upload size={18} className="text-gold" /></div>
            <div>
              <h2 className="text-xl font-bold text-earth">Import {config.title}</h2>
              <p className="text-xs text-grey-500">Upload CSV or Excel file</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-grey-100 rounded-xl"><X size={20} /></button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-8 py-4 border-b border-grey-100 bg-grey-100/30">
          {['Upload', 'Preview', 'Result'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-all ${
                (i === 0 && step === 'upload') || (i === 1 && step === 'preview') || (i === 2 && step === 'result')
                  ? 'bg-gold text-white' : 'text-grey-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  (i === 0 && step === 'upload') || (i === 1 && step === 'preview') || (i === 2 && step === 'result')
                    ? 'bg-white text-gold' : 'bg-grey-200 text-grey-500'}`}>{i+1}</span>
                {s}
              </div>
              {i < 2 && <div className="w-8 h-px bg-grey-200 mx-1" />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {step === 'upload' && (
            <div className="p-8 space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
                  dragging ? 'border-gold bg-gold/10 scale-[1.01]' : 'border-grey-200 hover:border-gold hover:bg-gold/5'}`}
              >
                <input ref={fileRef} type="file" accept={ACCEPTED} className="hidden" onChange={handleFile} />
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload size={28} className="text-gold" />
                </div>
                <p className="text-earth font-bold text-lg">Drop your file here</p>
                <p className="text-grey-500 text-sm mt-1">or click to browse</p>
              </div>

              <div className="bg-grey-100/60 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-grey-500 uppercase tracking-widest">Supported Columns</p>
                  <button onClick={downloadTemplate} className="flex items-center gap-1.5 text-xs font-bold text-gold hover:text-earth transition-colors">
                    <Download size={13} /> Download Template
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {config.guide.map(c => (
                    <div key={c.col} className="flex items-start gap-2 bg-white rounded-xl p-3 border border-grey-200">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 ${c.req ? 'bg-gold/20 text-gold' : 'bg-grey-200 text-grey-500'}`}>
                        {c.req ? 'REQ' : 'OPT'}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-earth font-mono">{c.col}</p>
                        <p className="text-[10px] text-grey-500">{c.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'preview' && (
            <div className="p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gold" />
                  <span className="text-sm font-bold text-earth">{fileName}</span>
                </div>
                <span className="text-xs font-bold bg-gold/10 text-gold px-3 py-1 rounded-full">{rows.length} rows</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-grey-200">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-grey-100 border-b border-grey-200">
                      <th className="px-4 py-3 font-bold text-grey-500 tracking-widest text-[9px]">#</th>
                      {headers.map(h => <th key={h} className="px-4 py-3 font-bold text-grey-500 tracking-widest text-[9px] whitespace-nowrap">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-grey-100">
                    {rows.slice(0, 10).map((row, i) => (
                      <tr key={i} className="hover:bg-grey-100/40">
                        <td className="px-4 py-2.5 text-grey-400 font-bold">{i + 1}</td>
                        {headers.map(h => <td key={h} className="px-4 py-2.5 text-earth max-w-[160px] truncate">{row[h] || '—'}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {step === 'result' && result && (
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total', value: result.total, color: 'text-earth' },
                  { label: 'Created', value: result.created, color: 'text-green-600' },
                  { label: 'Skipped', value: result.skipped, color: 'text-amber-500' },
                ].map(s => (
                  <div key={s.label} className="bg-grey-100 rounded-2xl p-4 text-center">
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-grey-500 font-semibold mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-grey-200 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <tbody className="divide-y divide-grey-100">
                    {result.results.map((r) => (
                      <tr key={r.row} className={r.status === 'skipped' ? 'bg-red-50/50' : ''}>
                        <td className="px-4 py-2.5 text-grey-400 font-bold">{r.row}</td>
                        <td className="px-4 py-2.5">
                          {r.status === 'created'
                            ? <span className="flex items-center gap-1 text-green-600 font-bold"><CheckCircle2 size={12} /> Success</span>
                            : <span className="flex items-center gap-1 text-red-500 font-bold"><XCircle size={12} /> {r.reason || 'Skipped'}</span>}
                        </td>
                        <td className="px-4 py-2.5 text-earth font-semibold">{r.name || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="px-8 py-5 border-t border-grey-100 flex justify-between items-center sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-5 py-3 border border-grey-200 rounded-xl text-sm font-bold hover:border-gold">
            {step === 'result' ? 'Close' : 'Cancel'}
          </button>
          {step === 'preview' && (
            <button onClick={handleImport} disabled={importing || rows.length === 0}
              className="flex items-center gap-2 px-8 py-3 bg-gold text-white rounded-xl text-sm font-bold shadow hover:bg-gold-light disabled:opacity-60 transition-all">
              {importing ? <><Loader2 size={16} className="animate-spin" /> Importing...</> : <><Upload size={16} /> Import {rows.length} {config.title}</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImportModal
