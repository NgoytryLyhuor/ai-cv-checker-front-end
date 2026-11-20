export type CheckServiceType = 'review' | 'km_to_en' | 'en_to_km' | 'full'
export type CheckStatusType = 'COMPLETED' | 'FAILED' | 'EXPIRED'

export interface CvExperienceDto {
  role: string
  company: string
  period: string
  bullets: string[]
}

export interface CvEducationDto {
  degree: string
  school: string
  period: string
}

export interface StructuredCvDto {
  full_name: string
  job_title: string
  email: string
  phone: string
  location: string
  summary: string
  experience: CvExperienceDto[]
  education: CvEducationDto[]
  skills: string[]
  languages: string[]
}

export interface CheckResultDto {
  token: string
  service: CheckServiceType
  status: CheckStatusType
  score: number | null
  label: string | null
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  strengths_km?: string[]
  weaknesses_km?: string[]
  suggestions_km?: string[]
  improved_cv: string | null
  translated_cv: string | null
  structured_cv: StructuredCvDto | null
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

export interface StructuredCv {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  summary: string
  experience: CvExperienceDto[]
  education: CvEducationDto[]
  skills: string[]
  languages: string[]
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
  strengthsKm?: string[]
  weaknessesKm?: string[]
  suggestionsKm?: string[]
  improvedCv: string | null
  translatedCv: string | null
  structuredCv: StructuredCv | null
  errorMessage: string | null
  expiresAt: string | null
  createdAt: string | null
}
