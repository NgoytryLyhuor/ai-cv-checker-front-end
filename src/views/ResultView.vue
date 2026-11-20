<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import ReportView from '@/components/ReportView.vue'
import { getCheck } from '@/api/checks'
import { useCheckStore } from '@/stores/checkStore'
import { useI18n } from '@/composables/useI18n'
import type { CheckResult } from '@/types/check'

const route = useRoute()
const store = useCheckStore()
const { locale, t } = useI18n()

const loading = ref(true)
const errorState = ref<'NOT_FOUND' | 'EXPIRED' | 'FAILED' | 'NETWORK' | null>(null)
const errorMessage = ref('')
const result = ref<CheckResult | null>(null)

async function loadResult(): Promise<void> {
  const token = String(route.params.token ?? '')
  if (store.latestResult?.token === token && store.latestResult.status === 'COMPLETED') {
    result.value = store.latestResult
    loading.value = false
    return
  }

  loading.value = true
  errorState.value = null

  try {
    const data = await getCheck(token)
    if (data.status === 'FAILED') {
      errorState.value = 'FAILED'
      errorMessage.value = data.errorMessage || 'AI analysis failed. Please try again.'
    } else {
      result.value = data
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 410) {
        errorState.value = 'EXPIRED'
        errorMessage.value = 'This report expired after 7 days per our privacy policy.'
      } else if (err.response.status === 404) {
        errorState.value = 'NOT_FOUND'
        errorMessage.value = 'We could not find a report with this link.'
      } else {
        errorState.value = 'NETWORK'
        errorMessage.value = 'Unable to load report.'
      }
    } else {
      errorState.value = 'NETWORK'
      errorMessage.value = 'Network error while loading report.'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadResult()
})
</script>

<template>
  <div class="page-stack">
    <div v-if="loading" class="form-card" aria-live="polite">
      <p>{{ t[locale].resultLoading }}</p>
    </div>

    <div v-else-if="errorState" class="form-card" data-testid="result-error">
      <h2>
        {{ errorState === 'EXPIRED' ? t[locale].resultNotFound : t[locale].resultUnavailable }}
      </h2>
      <p>{{ errorMessage }}</p>
      <div class="hero-actions">
        <RouterLink to="/" class="btn btn--primary">{{ t[locale].tryAnother }}</RouterLink>
      </div>
    </div>

    <template v-else-if="result">
      <ReportView :result="result" :original-text="store.originalCvText" />
      <div class="no-print">
        <RouterLink to="/" class="btn btn--secondary">{{ t[locale].tryAnother }}</RouterLink>
      </div>
    </template>
  </div>
</template>
