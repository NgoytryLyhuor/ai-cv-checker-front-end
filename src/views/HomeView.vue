<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ArrowRight, CheckCircle2, FileText, ImagePlus, Palette, Sparkles, X } from 'lucide-vue-next'
import CvUploader from '@/components/CvUploader.vue'
import CvTemplatePreview from '@/components/CvTemplatePreview.vue'
import TemplateGallery from '@/components/TemplateGallery.vue'
import { createCheck } from '@/api/checks'
import { CV_TEMPLATES, type CvTemplateOption } from '@/config/cvTemplates'
import { useCheckStore } from '@/stores/checkStore'
import { useI18n } from '@/composables/useI18n'
import type { CheckServiceType, StructuredCv } from '@/types/check'

const router = useRouter()
const store = useCheckStore()
const { locale, t } = useI18n()

const inputMode = ref<'upload' | 'paste'>('upload')
const uploadedText = ref('')
const pastedText = ref('')
const service = ref<CheckServiceType>('full')
const consent = ref(false)
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})

const activeCvText = computed(() =>
  inputMode.value === 'upload' ? uploadedText.value.trim() : pastedText.value.trim(),
)

const canSubmit = computed(() => {
  return activeCvText.value.length >= 100 && consent.value && !isSubmitting.value
})

const heroTemplate = CV_TEMPLATES[0]!

const previewModalTemplate = ref<CvTemplateOption | null>(null)
const previewModalHex = ref<string>(heroTemplate.defaultColor)

const selectedTemplateObj = computed(
  () => CV_TEMPLATES.find((tpl) => tpl.id === store.selectedTemplateId) ?? heroTemplate,
)

const sampleShowcaseCv: StructuredCv = {
  fullName: 'NGOYTRY LYHUOR',
  jobTitle: 'Senior UI & Frontend Engineer',
  email: 'ngoytry.lyhuor@demo-cv.kh',
  phone: '+855 12 889 412',
  location: 'Phnom Penh, Cambodia',
  summary:
    'Product-focused frontend engineer crafting accessible, high-performance web applications with Vue 3, Laravel, and TypeScript for modern fintech and enterprise teams.',
  experience: [
    {
      role: 'Senior Frontend Engineer',
      company: 'Chaktomuk Tech Labs',
      period: '2024 – Present',
      bullets: [
        'Architected responsive recruitment and analytics dashboards with Vue 3 and TypeScript.',
        'Established a shared component library and automated end-to-end Playwright QA.',
      ],
    },
    {
      role: 'Frontend Developer',
      company: 'Tonle Digital Co.',
      period: '2022 – 2024',
      bullets: [
        'Delivered mobile-first portals and multilingual workflows for local SMEs.',
        'Improved Core Web Vitals, accessibility semantics, and API error resilience.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.Sc. in Computer Science',
      school: 'Royal University of Phnom Penh',
      period: '2018 – 2022',
    },
  ],
  skills: ['Vue 3 / Nuxt', 'TypeScript', 'HTML / CSS', 'Laravel', 'REST API', 'Playwright'],
  languages: ['Khmer — Native', 'English — Fluent'],
}

function onExtracted(text: string): void {
  uploadedText.value = text
  submitError.value = null
  fieldErrors.value = {}
}

function onHomePhotoSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      store.setProfilePhoto(reader.result)
    }
  }
  reader.readAsDataURL(file)
}

function clearHomePhoto(): void {
  store.setProfilePhoto(null)
}

function scrollToBuilder(): void {
  document.getElementById('cv-builder-box')?.scrollIntoView({ behavior: 'smooth' })
}

function scrollToDesigns(): void {
  document.getElementById('cv-designs')?.scrollIntoView({ behavior: 'smooth' })
}

function onHomeSelectTemplate(tpl: CvTemplateOption, hex: string): void {
  store.setDesignChoice(tpl.id, hex)
  scrollToBuilder()
}

function onHomeColorChange(tpl: CvTemplateOption, hex: string): void {
  store.setDesignChoice(tpl.id, hex)
}

function onHomePreviewTemplate(tpl: CvTemplateOption, hex: string): void {
  store.setDesignChoice(tpl.id, hex)
  previewModalTemplate.value = tpl
  previewModalHex.value = hex
}

function applyModalTemplate(): void {
  if (previewModalTemplate.value) {
    store.setDesignChoice(previewModalTemplate.value.id, previewModalHex.value)
  }
  previewModalTemplate.value = null
  scrollToBuilder()
}

async function onSubmit(): Promise<void> {
  if (!canSubmit.value) return
  isSubmitting.value = true
  submitError.value = null
  fieldErrors.value = {}

  try {
    const result = await createCheck({
      text: activeCvText.value,
      service: service.value,
      consent: consent.value,
    })
    store.setSessionCheck(activeCvText.value, result)
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
    <!-- Jobify-style Deep Navy Hero Banner + Live Preview Card -->
    <section class="jobify-hero">
      <div class="jobify-hero-copy">
        <span class="jobify-pill">{{ t[locale].heroPill }}</span>
        <h1>{{ t[locale].heroTitle }}</h1>
        <p class="jobify-hero-sub">{{ t[locale].heroSubtitle }}</p>

        <div class="jobify-hero-actions">
          <button type="button" class="btn btn--white" @click="scrollToBuilder">
            {{ t[locale].submitBtn }}
            <ArrowRight class="icon-sm" aria-hidden="true" />
          </button>
          <button type="button" class="btn btn--ghost-white" @click="scrollToDesigns">
            {{ t[locale].heroBrowseBtn }}
          </button>
        </div>

        <div class="hero-trust-row">
          <span class="hero-trust-item">{{ t[locale].heroTrust1 }}</span>
          <span class="hero-trust-item">{{ t[locale].heroTrust2 }}</span>
          <span class="hero-trust-item">{{ t[locale].heroTrust3 }}</span>
        </div>
      </div>

      <!-- Live Scaled A4 Sample Preview Card (Jobify Hero Style) -->
      <div class="jobify-hero-preview">
        <div class="hero-live-a4-frame">
          <CvTemplatePreview
            :cv="sampleShowcaseCv"
            :template="heroTemplate"
            :accent-hex="heroTemplate.defaultColor"
            :thumbnail="true"
          />
          <span class="hero-live-a4-caption">{{ t[locale].heroPreviewCaption }}</span>
        </div>
      </div>
    </section>

    <!-- Upload / Paste CV Form Card -->
    <form id="cv-builder-box" class="form-card" @submit.prevent="onSubmit">
      <div class="builder-top-bar">
        <div>
          <span class="eyebrow">{{ t[locale].builderEyebrow }}</span>
          <h2 class="builder-heading">{{ t[locale].builderHeading }}</h2>
        </div>
        <button type="button" class="selected-tpl-pill" @click="scrollToDesigns">
          <span
            class="selected-tpl-dot"
            :style="{ backgroundColor: store.selectedPaletteHex }"
            aria-hidden="true"
          />
          <span>{{ selectedTemplateObj.name }}</span>
          <span class="selected-tpl-change">{{ t[locale].changeBtn }}</span>
        </button>
      </div>

      <div class="segmented" role="tablist" aria-label="CV input method">
        <button
          type="button"
          role="tab"
          :aria-selected="inputMode === 'upload'"
          class="seg-btn"
          :class="{ 'seg-btn--active': inputMode === 'upload' }"
          data-testid="mode-upload"
          @click="inputMode = 'upload'"
        >
          {{ t[locale].modeUpload }}
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="inputMode === 'paste'"
          class="seg-btn"
          :class="{ 'seg-btn--active': inputMode === 'paste' }"
          data-testid="mode-paste"
          @click="inputMode = 'paste'"
        >
          {{ t[locale].modePaste }}
        </button>
      </div>

      <CvUploader v-if="inputMode === 'upload'" @extracted="onExtracted" />

      <div v-else class="field-group">
        <textarea
          v-model="pastedText"
          rows="6"
          class="input textarea"
          data-testid="paste-textarea"
          :placeholder="t[locale].pastePlaceholder"
        />
        <p class="dropzone-hint">
          {{ t[locale].pasteHint }} ({{ pastedText.trim().length }} / 100+ chars)
        </p>
      </div>

      <p v-if="fieldErrors.text" class="field-error">{{ fieldErrors.text }}</p>

      <div class="mode-pills" role="radiogroup" :aria-label="t[locale].serviceLabel">
        <button
          type="button"
          class="mode-pill"
          :class="{ 'mode-pill--active': service === 'full' }"
          @click="service = 'full'"
        >
          {{ t[locale].serviceFull }}
        </button>
        <button
          type="button"
          class="mode-pill"
          :class="{ 'mode-pill--active': service === 'km_to_en' }"
          @click="service = 'km_to_en'"
        >
          {{ t[locale].serviceKmToEn }}
        </button>
      </div>

      <div class="photo-upload-row">
        <span class="label">{{ t[locale].profilePhotoLabel }}</span>
        <div class="photo-upload-controls">
          <img
            v-if="store.profilePhotoUrl"
            :src="store.profilePhotoUrl"
            alt="Profile preview"
            class="home-avatar-preview"
            data-testid="home-photo-preview"
          />
          <label class="btn btn--secondary btn--sm">
            <ImagePlus class="icon-sm" aria-hidden="true" />
            {{ t[locale].uploadPhoto }}
            <input
              type="file"
              accept="image/*"
              class="sr-only"
              data-testid="home-photo-input"
              @change="onHomePhotoSelected"
            />
          </label>
          <button
            v-if="store.profilePhotoUrl"
            type="button"
            class="btn btn--secondary btn--sm"
            @click="clearHomePhoto"
          >
            <X class="icon-sm" aria-hidden="true" />
            {{ t[locale].removePhoto }}
          </button>
        </div>
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

    <!-- Three Simple Steps (Jobify-style) -->
    <section class="section-card">
      <span class="eyebrow">{{ t[locale].stepsEyebrow }}</span>
      <h2 class="section-title">{{ t[locale].stepsTitle }}</h2>
      <div class="steps-grid">
        <div class="step-item">
          <span class="step-num">1</span>
          <h3>{{ t[locale].step1Title }}</h3>
          <p>{{ t[locale].step1Desc }}</p>
        </div>
        <div class="step-item">
          <span class="step-num">2</span>
          <h3>{{ t[locale].step2Title }}</h3>
          <p>{{ t[locale].step2Desc }}</p>
        </div>
        <div class="step-item">
          <span class="step-num">3</span>
          <h3>{{ t[locale].step3Title }}</h3>
          <p>{{ t[locale].step3Desc }}</p>
        </div>
      </div>
    </section>

    <!-- Why AI CV Checker? 4 Feature Cards -->
    <section class="section-card">
      <span class="eyebrow">{{ t[locale].whyEyebrow }}</span>
      <h2 class="section-title">{{ t[locale].whyTitle }}</h2>
      <div class="why-grid" style="margin-bottom: 1.5rem">
        <div class="why-card">
          <Sparkles class="icon-md" aria-hidden="true" />
          <h3>{{ t[locale].why1Title }}</h3>
          <p>{{ t[locale].why1Desc }}</p>
        </div>
        <div class="why-card">
          <FileText class="icon-md" aria-hidden="true" />
          <h3>{{ t[locale].why2Title }}</h3>
          <p>{{ t[locale].why2Desc }}</p>
        </div>
        <div class="why-card">
          <Palette class="icon-md" aria-hidden="true" />
          <h3>{{ t[locale].why3Title }}</h3>
          <p>{{ t[locale].why3Desc }}</p>
        </div>
        <div class="why-card">
          <CheckCircle2 class="icon-md" aria-hidden="true" />
          <h3>{{ t[locale].why4Title }}</h3>
          <p>{{ t[locale].why4Desc }}</p>
        </div>
      </div>

      <TemplateGallery
        :cv="sampleShowcaseCv"
        :selected-template-id="store.selectedTemplateId"
        :selected-palette-hex="store.selectedPaletteHex"
        :photo-url="store.profilePhotoUrl"
        :action-label="t[locale].createWithTemplate"
        @select="onHomeSelectTemplate"
        @color="onHomeColorChange"
        @preview="onHomePreviewTemplate"
      />
    </section>

    <!-- Full-Size Template Preview Modal -->
    <div
      v-if="previewModalTemplate"
      class="home-preview-backdrop"
      role="dialog"
      aria-modal="true"
      :aria-label="`Preview ${previewModalTemplate.name}`"
      @click.self="previewModalTemplate = null"
    >
      <div class="home-preview-modal">
        <div class="home-preview-head">
          <div>
            <h3>{{ previewModalTemplate.name }}</h3>
            <p>{{ previewModalTemplate.tier }} · {{ t[locale].firstPagePreview }}</p>
          </div>
          <div class="home-preview-head-actions">
            <div v-if="previewModalTemplate.swatches.length" class="home-modal-swatches">
              <button
                v-for="sw in previewModalTemplate.swatches"
                :key="sw.hex"
                type="button"
                class="jb-color-dot"
                :class="{
                  'jb-color-dot--active': previewModalHex.toLowerCase() === sw.hex.toLowerCase(),
                }"
                :style="{ backgroundColor: sw.hex }"
                :title="sw.name"
                :aria-label="`${previewModalTemplate.name} · ${sw.name}`"
                @click="previewModalHex = sw.hex"
              />
            </div>
            <button type="button" class="btn btn--primary btn--sm" @click="applyModalTemplate">
              {{ t[locale].useTemplateBtn }}
              <ArrowRight class="icon-sm" aria-hidden="true" />
            </button>
            <button
              type="button"
              class="btn btn--secondary btn--sm"
              aria-label="Close preview"
              @click="previewModalTemplate = null"
            >
              <X class="icon-sm" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div class="home-preview-body">
          <div class="home-preview-sheet-wrap">
            <CvTemplatePreview
              :cv="sampleShowcaseCv"
              :template="previewModalTemplate"
              :accent-hex="previewModalHex"
              :exact-sample="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
