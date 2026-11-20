import { ref } from 'vue'
import { defineStore } from 'pinia'
import { CV_TEMPLATES } from '@/config/cvTemplates'
import type { CheckResult } from '@/types/check'

export const useCheckStore = defineStore('check', () => {
  const originalCvText = ref<string>('')
  const latestResult = ref<CheckResult | null>(null)
  const profilePhotoUrl = ref<string | null>(null)
  const selectedTemplateId = ref<string>(CV_TEMPLATES[0]?.id ?? 'slate-portrait')
  const selectedPaletteHex = ref<string>(CV_TEMPLATES[0]?.defaultColor ?? '#3b4757')

  function setSessionCheck(text: string, result: CheckResult): void {
    originalCvText.value = text
    latestResult.value = result
  }

  function setProfilePhoto(url: string | null): void {
    profilePhotoUrl.value = url
  }

  function setDesignChoice(templateId: string, paletteHex: string): void {
    selectedTemplateId.value = templateId
    selectedPaletteHex.value = paletteHex
  }

  return {
    originalCvText,
    latestResult,
    profilePhotoUrl,
    selectedTemplateId,
    selectedPaletteHex,
    setSessionCheck,
    setProfilePhoto,
    setDesignChoice,
  }
})
