import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
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

  it('renders structured English CV template and switches templates, colors, and plain text tab', async () => {
    const wrapper = mount(ReportView, {
      props: {
        result: sampleResult,
        originalText: 'Original CV text',
      },
    })

    expect(wrapper.get('[data-testid="score-badge"]').text()).toContain('76/100')
    expect(wrapper.get('[data-testid="cv-template-sheet"]').classes()).toContain('cv-tpl--slate-portrait')

    await wrapper.get('[data-testid="tpl-navy-ribbon"]').trigger('click')
    expect(wrapper.get('[data-testid="cv-template-sheet"]').classes()).toContain('cv-tpl--navy-ribbon')

    await wrapper.get('[data-testid="tab-text"]').trigger('click')
    expect(wrapper.get('[data-testid="cv-output-text"]').text()).toBe('Improved CV body')

    await wrapper.get('[data-testid="tab-original"]').trigger('click')
    expect(wrapper.get('[data-testid="cv-output-text"]').text()).toBe('Original CV text')
  })
})
