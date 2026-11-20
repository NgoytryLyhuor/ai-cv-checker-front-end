export type CvTemplateId =
  | 'slate-portrait'
  | 'navy-ribbon'
  | 'graphite-frame'
  | 'phnom-penh-classic'
  | 'two-tone-corner'
  | 'modern-minimal'

export interface CvTemplateOption {
  id: CvTemplateId
  name: string
  tag: string
  supportsPhoto: boolean
}

export interface CvPaletteOption {
  id: string
  name: string
  hex: string
}

export const CV_TEMPLATES: CvTemplateOption[] = [
  { id: 'slate-portrait', name: 'Slate Portrait', tag: 'Sidebar + Photo', supportsPhoto: true },
  { id: 'navy-ribbon', name: 'Navy Ribbon', tag: 'Banner Header', supportsPhoto: true },
  { id: 'graphite-frame', name: 'Graphite Frame', tag: 'Executive', supportsPhoto: false },
  { id: 'phnom-penh-classic', name: 'Phnom Penh Classic', tag: 'ATS Classic', supportsPhoto: false },
  { id: 'two-tone-corner', name: 'Two-Tone Corner', tag: 'Modern Split', supportsPhoto: true },
  { id: 'modern-minimal', name: 'Modern Minimal', tag: 'Clean Serif/Sans', supportsPhoto: false },
]

export const CV_PALETTES: CvPaletteOption[] = [
  { id: 'color-3b4757', name: 'Slate', hex: '#3b4757' },
  { id: 'color-1e3a8a', name: 'Royal Navy', hex: '#1e3a8a' },
  { id: 'color-065f46', name: 'Emerald', hex: '#065f46' },
  { id: 'color-881337', name: 'Burgundy', hex: '#881337' },
  { id: 'color-92400e', name: 'Royal Gold', hex: '#92400e' },
  { id: 'color-18181b', name: 'Charcoal', hex: '#18181b' },
]
