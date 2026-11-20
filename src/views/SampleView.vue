<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ReportView from '@/components/ReportView.vue'
import { getSampleReport } from '@/api/checks'
import { useI18n } from '@/composables/useI18n'
import type { CheckResult } from '@/types/check'

const { locale, t } = useI18n()
const loading = ref(true)
const error = ref<string | null>(null)
const sample = ref<CheckResult | null>(null)

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    sample.value = await getSampleReport()
  } catch {
    error.value = t[locale.value].sampleError
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void load()
})
</script>

<template>
  <div class="page-stack">
    <div v-if="loading" class="form-card">{{ t[locale].sampleLoading }}</div>
    <div v-else-if="error" class="form-card">
      <p class="status status--error">{{ error }}</p>
      <button type="button" class="btn btn--primary" @click="load">{{ t[locale].retryBtn }}</button>
    </div>
    <template v-else-if="sample">
      <ReportView :result="sample" />
      <div class="no-print">
        <RouterLink to="/" class="btn btn--primary">{{ t[locale].checkOwnBtn }}</RouterLink>
      </div>
    </template>
  </div>
</template>
