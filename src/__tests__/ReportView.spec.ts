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
    translatedCv: 'ប្រវត្តិរូបសង្ខេបជាភាសាខ្មែរ',
    errorMessage: null,
    expiresAt: '2026-11-27T06:30:00Z',
    createdAt: '2026-11-20T06:30:00Z',
  }

  it('renders score, feedback, and switches between improved and translated tabs', async () => {
    const wrapper = mount(ReportView, {
      props: {
        result: sampleResult,
        originalText: 'Original CV text',
      },
    })

    expect(wrapper.get('[data-testid="score-badge"]').text()).toContain('76/100')
    expect(wrapper.get('[data-testid="cv-output-text"]').text()).toBe('Improved CV body')

    await wrapper.get('[data-testid="tab-translated"]').trigger('click')
    expect(wrapper.get('[data-testid="cv-output-text"]').text()).toBe('ប្រវត្តិរូបសង្ខេបជាភាសាខ្មែរ')

    await wrapper.get('[data-testid="tab-original"]').trigger('click')
    expect(wrapper.get('[data-testid="cv-output-text"]').text()).toBe('Original CV text')
  })
})
