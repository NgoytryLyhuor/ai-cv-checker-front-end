import rawJobifyTemplates from '@/data/jobifyTemplates.json'

export type CvTemplateCategory = 'classic' | 'scenic' | 'backdrop'

export type CvLayoutEngine =
  | 'sidebar-left-dark'
  | 'sidebar-right-tint'
  | 'ribbon-banner'
  | 'framed-border'
  | 'timeline-dots'
  | 'two-tone-diagonal'
  | 'ats-classic'
  | 'minimal-accent'
  | 'scenic-header'
  | 'faded-backdrop'

export interface CvSwatchOption {
  name: string
  hex: string
}

export interface CvTemplateOption {
  id: string
  designId: string
  name: string
  category: CvTemplateCategory
  tier: 'Basic' | 'Premium'
  hasNewBadge: boolean
  layout: CvLayoutEngine
  defaultColor: string
  swatches: CvSwatchOption[]
  supportsPhoto: boolean
  serif?: boolean
}

export interface CvPaletteOption {
  id: string
  name: string
  hex: string
}

export const CV_PALETTES: CvPaletteOption[] = [
  { id: 'color-3b4757', name: 'Slate', hex: '#3b4757' },
  { id: 'color-1e3a5f', name: 'Navy Blue', hex: '#1e3a5f' },
  { id: 'color-111827', name: 'Onyx', hex: '#111827' },
  { id: 'color-064e3b', name: 'Emerald', hex: '#064e3b' },
  { id: 'color-67917f', name: 'Sage', hex: '#67917f' },
  { id: 'color-0f766e', name: 'Teal', hex: '#0f766e' },
  { id: 'color-0891b2', name: 'Cyan', hex: '#0891b2' },
  { id: 'color-1d4ed8', name: 'Royal Blue', hex: '#1d4ed8' },
  { id: 'color-4338ca', name: 'Indigo', hex: '#4338ca' },
  { id: 'color-881337', name: 'Burgundy', hex: '#881337' },
  { id: 'color-e11d48', name: 'Rose', hex: '#e11d48' },
  { id: 'color-d97706', name: 'Royal Gold', hex: '#d97706' },
]

interface RawJobifyTemplate {
  id: string
  designId: string
  name: string
  category: CvTemplateCategory
  tier: 'Basic' | 'Premium'
  hasNewBadge: boolean
  defaultColor: string
  swatches: CvSwatchOption[]
  html: string
}

const LAYOUT_BY_ID: Record<string, CvLayoutEngine> = {
  'slate-portrait': 'sidebar-left-dark',
  'graphite-frame': 'framed-border',
  'navy-ribbon': 'ribbon-banner',
  'sand-profile': 'sidebar-right-tint',
  'phnom-penh-classic': 'ats-classic',
  'two-tone-corner': 'two-tone-diagonal',
  'blue-angle-header': 'ribbon-banner',
  'khmer-bilingual': 'sidebar-left-dark',
  'tech-grid': 'timeline-dots',
  'royal-gold': 'minimal-accent',
  'burgundy-elegance': 'minimal-accent',
  'diagonal-slate': 'two-tone-diagonal',
  'midnight-card': 'sidebar-left-dark',
  'coral-accent': 'minimal-accent',
  'ocean-wave': 'two-tone-diagonal',
  'lavender-soft': 'minimal-accent',
  'ats-classic': 'ats-classic',
  'ats-modern': 'ats-classic',
  b: 'ribbon-banner',
  c: 'framed-border',
  d: 'sidebar-left-dark',
  e: 'minimal-accent',
  f: 'timeline-dots',
  h: 'sidebar-left-dark',
  k: 'timeline-dots',
  l: 'sidebar-left-dark',
  m: 'minimal-accent',
  'black-badge': 'framed-border',
  'sage-sidebar': 'sidebar-left-dark',
  n: 'sidebar-left-dark',
  q: 'minimal-accent',
  r: 'ribbon-banner',
  s: 'sidebar-left-dark',
}

const SERIF_IDS = new Set([
  'phnom-penh-classic',
  'burgundy-elegance',
  'ats-classic',
  'c',
  'q',
])

const typedRaw = rawJobifyTemplates as RawJobifyTemplate[]

const HTML_MAP = new Map<string, string>(typedRaw.map((item) => [item.id, item.html]))

export const CV_TEMPLATES: CvTemplateOption[] = typedRaw.map((item) => {
  const layout: CvLayoutEngine =
    item.category === 'scenic'
      ? 'scenic-header'
      : item.category === 'backdrop'
        ? 'faded-backdrop'
        : (LAYOUT_BY_ID[item.id] ?? 'minimal-accent')

  return {
    id: item.id,
    designId: item.designId,
    name: item.name,
    category: item.category,
    tier: item.tier,
    hasNewBadge: item.hasNewBadge,
    layout,
    defaultColor: item.defaultColor,
    swatches: item.swatches,
    supportsPhoto: item.html.includes('<img') || item.category !== 'classic',
    serif: SERIF_IDS.has(item.id),
  }
})

function hexToRgbString(hex: string): string | null {
  const clean = hex.replace('#', '').trim()
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgb(${r}, ${g}, ${b})`
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function getJobifyTemplateHtml(id: string, accentHex?: string): string | null {
  const raw = HTML_MAP.get(id)
  if (!raw) return null
  const tpl = CV_TEMPLATES.find((t) => t.id === id)
  if (!tpl || !accentHex || accentHex.toLowerCase() === tpl.defaultColor.toLowerCase()) {
    return raw
  }

  let updated = raw.replace(new RegExp(escapeRegExp(tpl.defaultColor), 'gi'), accentHex)
  const defaultRgb = hexToRgbString(tpl.defaultColor)
  const targetRgb = hexToRgbString(accentHex)
  if (defaultRgb && targetRgb) {
    updated = updated.replace(new RegExp(escapeRegExp(defaultRgb), 'gi'), targetRgb)
  }
  return updated
}
