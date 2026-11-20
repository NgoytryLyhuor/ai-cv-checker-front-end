import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ReportView from '@/components/ReportView.vue'
import type { CheckResult } from '@/types/check'

describe('ReportView', () => {
  const sampleResult: CheckResult = {
    token: '550e8400-e29b-41d4-a716-446655440000',
    service: 'full',
    status: 'COMPLETED',
    score: 76,
    label: 'Good',
    strengths: ['Clear layout'],
    weaknesses: ['Short summary'],
    suggestions: ['Add metrics'],
    improvedCv: 'Improved CV body',
    translatedCv: '',
    structuredCv: {
      fullName: 'Sokha Chan',
      jobTitle: 'IT Support',
      email: 'sokha@example.com',
      phone: '+855 12 345 678',
      location: 'Phnom Penh',
      summary: 'Dedicated IT graduate.',
      experience: [
        {
          role: 'IT Support',
          company: 'Fintech Co.',
          period: '2025 - Present',
          bullets: ['Resolved 40+ tickets/day'],
        },
      ],
      education: [{ degree: 'B.Sc. CS', school: 'RUPP', period: '2021 - 2025' }],
      skills: ['Laravel', 'Vue.js'],
      languages: ['Khmer', 'English'],
    },
    errorMessage: null,
    expiresAt: '2026-11-27T06:30:00Z',
    createdAt: '2026-11-20T06:30:00Z',
  }

  it('switches templates, edits CV details live, and opens/closes Preview PDF modal', async () => {
    const wrapper = mount(ReportView, {
      global: {
        plugins: [createPinia()],
      },
      props: {
        result: sampleResult,
        originalText: 'Original CV text',
      },
    })

    expect(wrapper.get('[data-testid="score-badge"]').text()).toContain('76/100')
    expect(wrapper.get('[data-testid="cv-template-sheet"]').classes()).toContain('a4-layout--sidebar-left-dark')

    await wrapper.get('[data-testid="tpl-navy-ribbon"]').trigger('click')
    expect(wrapper.get('[data-testid="cv-template-sheet"]').classes()).toContain('a4-layout--ribbon-banner')

    await wrapper.get('[data-testid="edit-cv-toggle"]').trigger('click')
    await wrapper.get('[data-testid="edit-full-name"]').setValue('Dara Kim')
    expect(wrapper.get('[data-testid="cv-template-sheet"]').text()).toContain('Dara Kim')

    await wrapper.get('[data-testid="preview-pdf-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="pdf-preview-modal"]').exists()).toBe(true)

    await wrapper.get('[data-testid="close-preview-btn"]').trigger('click')
    expect(wrapper.find('[data-testid="pdf-preview-modal"]').exists()).toBe(false)
  })
})
