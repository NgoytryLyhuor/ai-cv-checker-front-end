import { describe, expect, it } from 'vitest'
import { mapCheckResultDto } from '@/api/mappers/checkMapper'

describe('checkMapper', () => {
  it('maps snake_case API DTO including structured_cv to camelCase CheckResult', () => {
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
      translated_cv: '',
      structured_cv: {
        full_name: 'Sokha Chan',
        job_title: 'Developer',
        email: 'sokha@example.com',
        phone: '+855 12 000 000',
        location: 'Phnom Penh',
        summary: 'Summary text',
        experience: [],
        education: [],
        skills: ['Laravel'],
        languages: ['English'],
      },
      error_message: null,
      expires_at: '2026-11-27T06:30:00Z',
      created_at: '2026-11-20T06:30:00Z',
    })

    expect(mapped.improvedCv).toBe('Improved English CV')
    expect(mapped.structuredCv?.fullName).toBe('Sokha Chan')
    expect(mapped.structuredCv?.jobTitle).toBe('Developer')
    expect(mapped.expiresAt).toBe('2026-11-27T06:30:00Z')
  })
})
