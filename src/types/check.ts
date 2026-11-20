export type CheckServiceType = 'review' | 'km_to_en' | 'en_to_km' | 'full'
export type CheckStatusType = 'COMPLETED' | 'FAILED' | 'EXPIRED'

export interface CheckResultDto {
  token: string
  service: CheckServiceType
  status: CheckStatusType
  score: number | null
  label: string | null
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  improved_cv: string | null
  translated_cv: string | null
  error_message: string | null
  expires_at: string | null
  created_at: string | null
}

export interface CreateCheckPayloadDto {
  text: string
  service: CheckServiceType
  consent: boolean
  email?: string
}

export interface CheckResult {
  token: string
  service: CheckServiceType
  status: CheckStatusType
  score: number | null
  label: string | null
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  improvedCv: string | null
  translatedCv: string | null
  errorMessage: string | null
  expiresAt: string | null
  createdAt: string | null
}
