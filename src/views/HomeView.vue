<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import CvUploader from '@/components/CvUploader.vue'
import { createCheck } from '@/api/checks'
import { useCheckStore } from '@/stores/checkStore'
import { useI18n } from '@/composables/useI18n'
import type { CheckServiceType } from '@/types/check'

const router = useRouter()
const store = useCheckStore()
const { locale, t } = useI18n()

const cvText = ref('')
const service = ref<CheckServiceType>('full')
const email = ref('')
const consent = ref(false)
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})

const canSubmit = computed(() => {
  return cvText.value.length >= 100 && consent.value && !isSubmitting.value
})

function onExtracted(text: string): void {
  cvText.value = text
  submitError.value = null
  fieldErrors.value = {}
}

async function onSubmit(): Promise<void> {
  if (!canSubmit.value) return
  isSubmitting.value = true
  submitError.value = null
  fieldErrors.value = {}

  try {
    const payload = {
      text: cvText.value,
      service: service.value,
      consent: consent.value,
      ...(email.value.trim() ? { email: email.value.trim() } : {}),
    }

    const result = await createCheck(payload)
    store.setSessionCheck(cvText.value, result)
    await router.push({ name: 'result', params: { token: result.token } })
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 422 && err.response.data?.errors) {
        const rawErrors = err.response.data.errors as Record<string, string[]>
        for (const [key, msgs] of Object.entries(rawErrors)) {
          if (msgs[0]) fieldErrors.value[key] = msgs[0]
        }
        submitError.value = err.response.data.message || 'Please check your input.'
      } else if (err.response.status === 429) {
        submitError.value = 'Too many requests. Please wait a minute and try again.'
      } else {
        submitError.value = err.response.data?.message || 'Unable to analyze CV right now.'
      }
    } else {
      submitError.value = 'Network error. Please check your connection and try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="page-stack">
    <section class="hero-card">
      <span class="pill-free">{{ t[locale].freeBadge }}</span>
      <h1>{{ t[locale].heroTitle }}</h1>
      <p class="hero-sub">{{ t[locale].heroSubtitle }}</p>

      <div class="clarification-box">
        <strong>{{ t[locale].noteTitle }}</strong> {{ t[locale].noteBody }}
      </div>

      <div class="hero-actions">
        <RouterLink to="/sample" class="btn btn--secondary" data-testid="sample-link">
          {{ t[locale].viewSample }}
        </RouterLink>
      </div>
    </section>

    <form class="form-card" @submit.prevent="onSubmit">
      <CvUploader @extracted="onExtracted" />
      <p v-if="fieldErrors.text" class="field-error">{{ fieldErrors.text }}</p>

      <fieldset class="fieldset">
        <legend class="label">{{ t[locale].serviceLabel }}</legend>
        <div class="radio-grid">
          <label class="radio-card" :class="{ 'radio-card--selected': service === 'full' }">
            <input v-model="service" type="radio" value="full" name="service" />
            <span>{{ t[locale].serviceFull }}</span>
          </label>
          <label class="radio-card" :class="{ 'radio-card--selected': service === 'km_to_en' }">
            <input v-model="service" type="radio" value="km_to_en" name="service" />
            <span>{{ t[locale].serviceKmToEn }}</span>
          </label>
          <label class="radio-card" :class="{ 'radio-card--selected': service === 'review' }">
            <input v-model="service" type="radio" value="review" name="service" />
            <span>{{ t[locale].serviceReview }}</span>
          </label>
        </div>
      </fieldset>

      <div class="field-group">
        <label for="email-input" class="label">{{ t[locale].emailLabel }}</label>
        <input
          id="email-input"
          v-model="email"
          type="email"
          class="input"
          placeholder="you@example.com"
          :aria-invalid="Boolean(fieldErrors.email)"
        />
        <p v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</p>
      </div>

      <label class="consent-row">
        <input v-model="consent" type="checkbox" data-testid="consent-checkbox" />
        <span>
          {{ t[locale].consentLabel }}
          <RouterLink to="/privacy" class="inline-link">{{ t[locale].navPrivacy }}</RouterLink>
        </span>
      </label>
      <p v-if="fieldErrors.consent" class="field-error">{{ fieldErrors.consent }}</p>

      <p v-if="submitError" class="status status--error" role="alert" data-testid="submit-error">
        {{ submitError }}
      </p>

      <button
        type="submit"
        class="btn btn--primary btn--full"
        :disabled="!canSubmit"
        data-testid="submit-btn"
      >
        {{ isSubmitting ? t[locale].submittingBtn : t[locale].submitBtn }}
      </button>
    </form>
  </div>
</template>
