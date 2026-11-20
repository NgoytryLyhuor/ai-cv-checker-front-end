<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ReportView from '@/components/ReportView.vue'
import { getSampleReport } from '@/api/checks'
import type { CheckResult } from '@/types/check'

const loading = ref(true)
const error = ref<string | null>(null)
const sample = ref<CheckResult | null>(null)

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    sample.value = await getSampleReport()
  } catch {
    error.value = 'Could not load sample report from the API.'
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
    <div v-if="loading" class="form-card">Loading sample report...</div>
    <div v-else-if="error" class="form-card">
      <p class="status status--error">{{ error }}</p>
      <button type="button" class="btn btn--primary" @click="load">Retry</button>
    </div>
    <template v-else-if="sample">
      <ReportView :result="sample" />
      <div class="no-print">
        <RouterLink to="/" class="btn btn--primary">Check Your Own CV Free</RouterLink>
      </div>
    </template>
  </div>
</template>
