<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Check, ChevronDown, ChevronUp, Copy, Eye, ImagePlus, Pencil, Printer, Sparkles, X } from 'lucide-vue-next'
import CvTemplatePreview from '@/components/CvTemplatePreview.vue'
import TemplateGallery from '@/components/TemplateGallery.vue'
import { CV_TEMPLATES, type CvTemplateOption } from '@/config/cvTemplates'
import type { CheckResult, StructuredCv } from '@/types/check'
import { useCheckStore } from '@/stores/checkStore'
import { useI18n } from '@/composables/useI18n'

const props = defineProps<{
  result: CheckResult
  originalText?: string
}>()

const store = useCheckStore()
const { locale, t } = useI18n()

type TabKey = 'template' | 'text' | 'original'

const activeTab = ref<TabKey>(props.result.structuredCv ? 'template' : 'text')
const selectedTemplateId = ref<string>(store.selectedTemplateId || CV_TEMPLATES[0]?.id || 'slate-portrait')
const selectedPalette = ref<string>(store.selectedPaletteHex || CV_TEMPLATES[0]?.defaultColor || '#3b4757')
const photoUrl = computed(() => store.profilePhotoUrl)
const copied = ref(false)
const showFeedback = ref(false)
const showEditor = ref(false)
const showPdfPreview = ref(false)

const editableCv = reactive<StructuredCv>({
  fullName: props.result.structuredCv?.fullName ?? '',
  jobTitle: props.result.structuredCv?.jobTitle ?? '',
  email: props.result.structuredCv?.email ?? '',
  phone: props.result.structuredCv?.phone ?? '',
  location: props.result.structuredCv?.location ?? '',
  summary: props.result.structuredCv?.summary ?? '',
  experience: props.result.structuredCv?.experience ?? [],
  education: props.result.structuredCv?.education ?? [],
  skills: props.result.structuredCv?.skills ?? [],
  languages: props.result.structuredCv?.languages ?? [],
})

const skillsInput = ref((props.result.structuredCv?.skills ?? []).join(', '))

watch(skillsInput, (val) => {
  editableCv.skills = val
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
})

const selectedTemplate = computed<CvTemplateOption>(
  () => CV_TEMPLATES.find((tpl) => tpl.id === selectedTemplateId.value) ?? CV_TEMPLATES[0]!,
)

function onGallerySelect(tpl: CvTemplateOption, hex: string): void {
  selectedTemplateId.value = tpl.id
  selectedPalette.value = hex
  store.setDesignChoice(tpl.id, hex)
}

function onGalleryPreview(tpl: CvTemplateOption, hex: string): void {
  onGallerySelect(tpl, hex)
  openPdfPreview()
}

const hasOriginal = computed(() => Boolean(props.originalText?.trim()))

const plainTextContent = computed(() => {
  if (activeTab.value === 'original') return props.originalText ?? ''
  return props.result.improvedCv ?? ''
})

const scoreBadgeClass = computed(() => {
  const score = props.result.score ?? 0
  if (score >= 85) return 'badge--excellent'
  if (score >= 70) return 'badge--good'
  if (score >= 50) return 'badge--fair'
  return 'badge--weak'
})

function onPhotoSelected(event: Event): void {
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

function clearPhoto(): void {
  store.setProfilePhoto(null)
}

async function copyText(): Promise<void> {
  const textToCopy = props.result.improvedCv || props.originalText || ''
  if (!textToCopy) return
  await navigator.clipboard.writeText(textToCopy)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

function openPdfPreview(): void {
  activeTab.value = props.result.structuredCv ? 'template' : 'text'
  showPdfPreview.value = true
}

function printReport(): void {
  activeTab.value = props.result.structuredCv ? 'template' : 'text'
  setTimeout(() => {
    window.print()
  }, 60)
}
</script>

<template>
  <section class="report-card" data-testid="report-view">
    <div class="notice-banner no-print">
      {{ t[locale].expiryNotice }}
    </div>

    <div class="score-strip no-print">
      <div class="score-strip-left">
        <div class="score-box score-box--sm" :class="scoreBadgeClass" data-testid="score-badge">
          <span class="score-number">{{ result.score ?? 0 }}/100</span>
          <span class="score-label">{{ result.label ?? 'Reviewed' }}</span>
        </div>
        <div>
          <span class="eyebrow">
            <Sparkles class="icon-sm" aria-hidden="true" />
            English CV Ready
          </span>
          <h2 class="report-title">{{ editableCv.fullName || 'CV Builder' }}</h2>
        </div>
      </div>

      <button
        type="button"
        class="btn btn--secondary btn--sm"
        data-testid="feedback-toggle"
        @click="showFeedback = !showFeedback"
      >
        {{ t[locale].feedbackToggle }}
        <ChevronUp v-if="showFeedback" class="icon-sm" aria-hidden="true" />
        <ChevronDown v-else class="icon-sm" aria-hidden="true" />
      </button>
    </div>

    <div v-if="showFeedback" class="feedback-grid no-print">
      <div class="feedback-panel">
        <h3>{{ t[locale].strengths }}</h3>
        <ul>
          <li v-for="(item, idx) in result.strengths" :key="`s-${idx}`">{{ item }}</li>
        </ul>
      </div>
      <div class="feedback-panel">
        <h3>{{ t[locale].weaknesses }}</h3>
        <ul>
          <li v-for="(item, idx) in result.weaknesses" :key="`w-${idx}`">{{ item }}</li>
        </ul>
      </div>
      <div class="feedback-panel">
        <h3>{{ t[locale].suggestions }}</h3>
        <ul>
          <li v-for="(item, idx) in result.suggestions" :key="`g-${idx}`">{{ item }}</li>
        </ul>
      </div>
    </div>

    <!-- Jobify-style Swipeable Carousel & Grid Template Picker -->
    <div v-if="result.structuredCv" class="no-print">
      <TemplateGallery
        :cv="editableCv"
        :selected-template-id="selectedTemplateId"
        :selected-palette-hex="selectedPalette"
        :photo-url="photoUrl"
        action-label="Use this template"
        @select="onGallerySelect"
        @preview="onGalleryPreview"
      />

      <div class="photo-controls" style="margin-bottom: 1rem">
        <label v-if="selectedTemplate.supportsPhoto" class="btn btn--secondary btn--sm">
          <ImagePlus class="icon-sm" aria-hidden="true" />
          {{ t[locale].uploadPhoto }}
          <input type="file" accept="image/*" class="sr-only" @change="onPhotoSelected" />
        </label>
        <button v-if="photoUrl" type="button" class="btn btn--secondary btn--sm" @click="clearPhoto">
          <X class="icon-sm" aria-hidden="true" />
          {{ t[locale].removePhoto }}
        </button>
        <button
          type="button"
          class="btn btn--secondary btn--sm"
          data-testid="edit-cv-toggle"
          @click="showEditor = !showEditor"
        >
          <Pencil class="icon-sm" aria-hidden="true" />
          {{ t[locale].editDetailsBtn }}
        </button>
      </div>

      <div v-if="showEditor" class="editor-panel" style="margin-bottom: 1rem" data-testid="cv-editor-panel">
        <div class="editor-grid">
          <label class="editor-field">
            <span>Full Name</span>
            <input v-model="editableCv.fullName" type="text" class="input" data-testid="edit-full-name" />
          </label>
          <label class="editor-field">
            <span>Job Title</span>
            <input v-model="editableCv.jobTitle" type="text" class="input" data-testid="edit-job-title" />
          </label>
          <label class="editor-field">
            <span>Phone</span>
            <input v-model="editableCv.phone" type="text" class="input" />
          </label>
          <label class="editor-field">
            <span>Email</span>
            <input v-model="editableCv.email" type="email" class="input" />
          </label>
          <label class="editor-field">
            <span>Location</span>
            <input v-model="editableCv.location" type="text" class="input" />
          </label>
          <label class="editor-field">
            <span>Skills (comma separated)</span>
            <input v-model="skillsInput" type="text" class="input" />
          </label>
        </div>
        <label class="editor-field">
          <span>Professional Summary</span>
          <textarea v-model="editableCv.summary" rows="3" class="input textarea" />
        </label>
      </div>
    </div>

    <!-- View Switcher & Preview/Download Actions -->
    <div class="tabs-bar no-print">
      <div class="tabs" role="tablist">
        <button
          v-if="result.structuredCv"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'template'"
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'template' }"
          data-testid="tab-template"
          @click="activeTab = 'template'"
        >
          {{ t[locale].tabTemplate }}
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="activeTab === 'text'"
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'text' }"
          data-testid="tab-text"
          @click="activeTab = 'text'"
        >
          {{ t[locale].tabText }}
        </button>
        <button
          v-if="hasOriginal"
          type="button"
          role="tab"
          :aria-selected="activeTab === 'original'"
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'original' }"
          data-testid="tab-original"
          @click="activeTab = 'original'"
        >
          {{ t[locale].tabOriginal }}
        </button>
      </div>

      <div class="action-buttons">
        <button
          v-if="result.structuredCv"
          type="button"
          class="btn btn--primary"
          data-testid="preview-pdf-btn"
          @click="openPdfPreview"
        >
          <Eye class="icon-sm" aria-hidden="true" />
          {{ t[locale].previewPdfBtn }}
        </button>

        <button type="button" class="btn btn--secondary" data-testid="copy-btn" @click="copyText">
          <Check v-if="copied" class="icon-sm" aria-hidden="true" />
          <Copy v-else class="icon-sm" aria-hidden="true" />
          {{ copied ? t[locale].copiedBtn : t[locale].copyBtn }}
        </button>

        <button type="button" class="btn btn--secondary" data-testid="print-btn" @click="printReport">
          <Printer class="icon-sm" aria-hidden="true" />
          {{ t[locale].printBtn }}
        </button>
      </div>
    </div>

    <div :class="{ 'no-print': showPdfPreview }">
      <CvTemplatePreview
        v-if="activeTab === 'template' && result.structuredCv"
        :cv="editableCv"
        :template="selectedTemplate"
        :accent-hex="selectedPalette"
        :photo-url="photoUrl"
      />
      <pre v-else class="cv-pre" data-testid="cv-output-text">{{ plainTextContent }}</pre>
    </div>

    <!-- Full-Screen A4 PDF Preview Modal -->
    <div
      v-if="showPdfPreview && result.structuredCv"
      class="pdf-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="A4 PDF Preview"
      data-testid="pdf-preview-modal"
    >
      <div class="pdf-modal-bar no-print">
        <strong>{{ t[locale].previewModalTitle }}</strong>
        <div class="pdf-modal-actions">
          <button
            type="button"
            class="btn btn--secondary btn--sm"
            data-testid="close-preview-btn"
            @click="showPdfPreview = false"
          >
            <X class="icon-sm" aria-hidden="true" />
            {{ t[locale].closeBtn }}
          </button>
          <button
            type="button"
            class="btn btn--primary btn--sm"
            data-testid="modal-print-btn"
            @click="printReport"
          >
            <Printer class="icon-sm" aria-hidden="true" />
            {{ t[locale].printBtn }}
          </button>
        </div>
      </div>

      <div class="pdf-modal-canvas">
        <CvTemplatePreview
          :cv="editableCv"
          :template="selectedTemplate"
          :accent-hex="selectedPalette"
          :photo-url="photoUrl"
        />
      </div>
    </div>
  </section>
</template>
