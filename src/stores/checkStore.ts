import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CheckResult } from '@/types/check'

export const useCheckStore = defineStore('check', () => {
  const originalCvText = ref<string>('')
  const latestResult = ref<CheckResult | null>(null)

  function setSessionCheck(text: string, result: CheckResult): void {
    originalCvText.value = text
    latestResult.value = result
  }

  return {
    originalCvText,
    latestResult,
    setSessionCheck,
  }
})
