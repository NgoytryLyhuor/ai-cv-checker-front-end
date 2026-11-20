import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CheckResult } from '@/types/check'

export const useCheckStore = defineStore('check', () => {
  const originalCvText = ref<string>('')
  const latestResult = ref<CheckResult | null>(null)
  const profilePhotoUrl = ref<string | null>(null)

  function setSessionCheck(text: string, result: CheckResult): void {
    originalCvText.value = text
    latestResult.value = result
  }

  function setProfilePhoto(url: string | null): void {
    profilePhotoUrl.value = url
  }

  return {
    originalCvText,
    latestResult,
    profilePhotoUrl,
    setSessionCheck,
    setProfilePhoto,
  }
})
