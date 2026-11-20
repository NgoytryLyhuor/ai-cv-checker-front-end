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

export interface CvTemplateOption {
  id: string
  name: string
  category: CvTemplateCategory
  layout: CvLayoutEngine
  defaultColor: string
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

export const CV_TEMPLATES: CvTemplateOption[] = [
  // Classic & Modern (27)
  { id: 'slate-portrait', name: 'Slate Portrait', category: 'classic', layout: 'sidebar-left-dark', defaultColor: '#3b4757', supportsPhoto: true },
  { id: 'graphite-frame', name: 'Graphite Frame', category: 'classic', layout: 'framed-border', defaultColor: '#334155', supportsPhoto: false },
  { id: 'navy-ribbon', name: 'Navy Ribbon', category: 'classic', layout: 'ribbon-banner', defaultColor: '#1e3a5f', supportsPhoto: true },
  { id: 'sand-profile', name: 'Sand Profile', category: 'classic', layout: 'sidebar-right-tint', defaultColor: '#78350f', supportsPhoto: true },
  { id: 'phnom-penh-classic', name: 'Phnom Penh Classic', category: 'classic', layout: 'ats-classic', defaultColor: '#1e293b', supportsPhoto: false, serif: true },
  { id: 'two-tone-corner', name: 'Two-Tone Corner', category: 'classic', layout: 'two-tone-diagonal', defaultColor: '#0f766e', supportsPhoto: true },
  { id: 'blue-angle-header', name: 'Blue Angle Header', category: 'classic', layout: 'ribbon-banner', defaultColor: '#1d4ed8', supportsPhoto: true },
  { id: 'tech-grid', name: 'Tech Grid', category: 'classic', layout: 'timeline-dots', defaultColor: '#0284c7', supportsPhoto: false },
  { id: 'royal-gold', name: 'Royal Gold', category: 'classic', layout: 'minimal-accent', defaultColor: '#d97706', supportsPhoto: false },
  { id: 'burgundy-elegance', name: 'Burgundy Elegance', category: 'classic', layout: 'minimal-accent', defaultColor: '#881337', supportsPhoto: false, serif: true },
  { id: 'diagonal-slate', name: 'Diagonal Slate', category: 'classic', layout: 'two-tone-diagonal', defaultColor: '#3b4757', supportsPhoto: true },
  { id: 'midnight-card', name: 'Midnight Card', category: 'classic', layout: 'sidebar-left-dark', defaultColor: '#0f172a', supportsPhoto: true },
  { id: 'coral-accent', name: 'Coral Accent', category: 'classic', layout: 'minimal-accent', defaultColor: '#e8735a', supportsPhoto: false },
  { id: 'ocean-wave', name: 'Ocean Wave', category: 'classic', layout: 'two-tone-diagonal', defaultColor: '#0891b2', supportsPhoto: true },
  { id: 'lavender-soft', name: 'Lavender Soft', category: 'classic', layout: 'minimal-accent', defaultColor: '#4b3b78', supportsPhoto: false },
  { id: 'harvard-standard', name: 'Harvard Standard', category: 'classic', layout: 'ats-classic', defaultColor: '#111827', supportsPhoto: false, serif: true },
  { id: 'modern-sans', name: 'Modern Sans', category: 'classic', layout: 'ats-classic', defaultColor: '#0f172a', supportsPhoto: false },
  { id: 'executive-formal', name: 'Executive Formal', category: 'classic', layout: 'framed-border', defaultColor: '#1e293b', supportsPhoto: false, serif: true },
  { id: 'classic-navy-banner', name: 'Classic Navy Banner', category: 'classic', layout: 'ribbon-banner', defaultColor: '#1e3a5f', supportsPhoto: true },
  { id: 'vintage-stone-frame', name: 'Vintage Stone Frame', category: 'classic', layout: 'framed-border', defaultColor: '#3a352f', supportsPhoto: false, serif: true },
  { id: 'slate-split-sidebar', name: 'Slate Split Sidebar', category: 'classic', layout: 'sidebar-left-dark', defaultColor: '#475569', supportsPhoto: true },
  { id: 'emerald-gold-timeline', name: 'Emerald Gold Timeline', category: 'classic', layout: 'timeline-dots', defaultColor: '#064e3b', supportsPhoto: false },
  { id: 'golden-minimalist', name: 'Golden Minimalist', category: 'classic', layout: 'minimal-accent', defaultColor: '#d97706', supportsPhoto: false },
  { id: 'nature-forest-sidebar', name: 'Nature Forest Sidebar', category: 'classic', layout: 'sidebar-left-dark', defaultColor: '#1b4332', supportsPhoto: true },
  { id: 'cyan-double-border', name: 'Cyan Double Border', category: 'classic', layout: 'framed-border', defaultColor: '#0891b2', supportsPhoto: false },
  { id: 'royal-blue-timeline', name: 'Royal Blue Timeline', category: 'classic', layout: 'timeline-dots', defaultColor: '#1d4ed8', supportsPhoto: false },
  { id: 'sage-green-sidebar', name: 'Sage Green Sidebar', category: 'classic', layout: 'sidebar-left-dark', defaultColor: '#67917f', supportsPhoto: true },

  // Angkor & Scenic (7)
  { id: 'scenic-angkor-blue', name: 'Angkor Blue Horizon', category: 'scenic', layout: 'scenic-header', defaultColor: '#1d4ed8', supportsPhoto: true },
  { id: 'scenic-angkor-gold', name: 'Angkor Golden Temple', category: 'scenic', layout: 'scenic-header', defaultColor: '#d97706', supportsPhoto: true },
  { id: 'scenic-angkor-jungle', name: 'Angkor Jungle Ruins', category: 'scenic', layout: 'scenic-header', defaultColor: '#15803d', supportsPhoto: true },
  { id: 'scenic-angkor-burgundy', name: 'Angkor Burgundy Stone', category: 'scenic', layout: 'scenic-header', defaultColor: '#9f1239', supportsPhoto: true },
  { id: 'scenic-angkor-charcoal', name: 'Angkor Charcoal Ruins', category: 'scenic', layout: 'scenic-header', defaultColor: '#1f2937', supportsPhoto: true },
  { id: 'scenic-angkor-emerald', name: 'Angkor Emerald Canopy', category: 'scenic', layout: 'scenic-header', defaultColor: '#047857', supportsPhoto: true },
  { id: 'scenic-angkor-roots', name: 'Angkor Ancient Roots', category: 'scenic', layout: 'scenic-header', defaultColor: '#78350f', supportsPhoto: true },

  // Photo Backdrop (7)
  { id: 'backdrop-blue', name: 'Faded Blue Backdrop', category: 'backdrop', layout: 'faded-backdrop', defaultColor: '#1d4ed8', supportsPhoto: true },
  { id: 'backdrop-orange', name: 'Faded Orange Backdrop', category: 'backdrop', layout: 'faded-backdrop', defaultColor: '#ea580c', supportsPhoto: true },
  { id: 'backdrop-peach', name: 'Faded Peach Backdrop', category: 'backdrop', layout: 'faded-backdrop', defaultColor: '#fb923c', supportsPhoto: true },
  { id: 'backdrop-red', name: 'Faded Red Backdrop', category: 'backdrop', layout: 'faded-backdrop', defaultColor: '#dc2626', supportsPhoto: true },
  { id: 'backdrop-crimson', name: 'Faded Crimson Backdrop', category: 'backdrop', layout: 'faded-backdrop', defaultColor: '#b91c1c', supportsPhoto: true },
  { id: 'backdrop-gold', name: 'Faded Gold Backdrop', category: 'backdrop', layout: 'faded-backdrop', defaultColor: '#ca8a04', supportsPhoto: true },
  { id: 'backdrop-green', name: 'Faded Green Backdrop', category: 'backdrop', layout: 'faded-backdrop', defaultColor: '#16a34a', supportsPhoto: true },
]
