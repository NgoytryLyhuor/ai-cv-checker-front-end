import { apiClient } from '@/api/client'
import { mapCheckResultDto } from '@/api/mappers/checkMapper'
import type { CheckResult, CheckResultDto, CreateCheckPayloadDto } from '@/types/check'

interface SingleResponse<T> {
  data: T
}

export async function createCheck(payload: CreateCheckPayloadDto): Promise<CheckResult> {
  const response = await apiClient.post<SingleResponse<CheckResultDto>>('/api/v1/checks', payload)
  return mapCheckResultDto(response.data.data)
}

export async function getCheck(token: string): Promise<CheckResult> {
  const response = await apiClient.get<SingleResponse<CheckResultDto>>(`/api/v1/checks/${token}`)
  return mapCheckResultDto(response.data.data)
}

export async function getSampleReport(): Promise<CheckResult> {
  const response = await apiClient.get<SingleResponse<CheckResultDto>>('/api/v1/sample')
  return mapCheckResultDto(response.data.data)
}
