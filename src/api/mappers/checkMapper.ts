import type { CheckResult, CheckResultDto } from '@/types/check'

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
    errorMessage: dto.error_message,
    expiresAt: dto.expires_at,
    createdAt: dto.created_at,
  }
}
