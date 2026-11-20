import type { CheckResult, CheckResultDto, StructuredCv, StructuredCvDto } from '@/types/check'

function mapStructuredCv(dto: StructuredCvDto | null | undefined): StructuredCv | null {
  if (!dto) return null
  return {
    fullName: dto.full_name || 'Candidate Name',
    jobTitle: dto.job_title || 'Professional',
    email: dto.email || '',
    phone: dto.phone || '',
    location: dto.location || '',
    summary: dto.summary || '',
    experience: dto.experience ?? [],
    education: dto.education ?? [],
    skills: dto.skills ?? [],
    languages: dto.languages ?? [],
  }
}

export function mapCheckResultDto(dto: CheckResultDto): CheckResult {
  return {
    token: dto.token,
    service: dto.service,
    status: dto.status,
    score: dto.score,
    label: dto.label,
    strengths: dto.strengths ?? [],
    weaknesses: dto.weaknesses ?? [],
    suggestions: dto.suggestions ?? [],
    improvedCv: dto.improved_cv,
    translatedCv: dto.translated_cv,
    structuredCv: mapStructuredCv(dto.structured_cv),
    errorMessage: dto.error_message,
    expiresAt: dto.expires_at,
    createdAt: dto.created_at,
  }
}
