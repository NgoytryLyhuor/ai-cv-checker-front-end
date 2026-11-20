import { describe, expect, it } from 'vitest'
import { mapCheckResultDto } from '@/api/mappers/checkMapper'

describe('checkMapper', () => {
  it('maps snake_case API DTO to camelCase CheckResult', () => {
    const mapped = mapCheckResultDto({
      token: '550e8400-e29b-41d4-a716-446655440000',
      service: 'full',
      status: 'COMPLETED',
      score: 82,
      label: 'Good',
      strengths: ['A'],
      weaknesses: ['B'],
      suggestions: ['C'],
      improved_cv: 'Improved English CV',
      translated_cv: 'ប្រវត្តិរូបសង្ខេប',
      error_message: null,
      expires_at: '2026-11-27T06:30:00Z',
      created_at: '2026-11-20T06:30:00Z',
    })

    expect(mapped.improvedCv).toBe('Improved English CV')
    expect(mapped.translatedCv).toBe('ប្រវត្តិរូបសង្ខេប')
    expect(mapped.expiresAt).toBe('2026-11-27T06:30:00Z')
  })
})
