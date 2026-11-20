<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { Check, Copy, ImagePlus, Printer, Sparkles, X } from 'lucide-vue-next'
import CvTemplatePreview from '@/components/CvTemplatePreview.vue'
import { CV_PALETTES, CV_TEMPLATES, type CvTemplateId } from '@/config/cvTemplates'
import type { CheckResult } from '@/types/check'
import { useI18n } from '@/composables/useI18n'

const props = defineProps<{
  result: CheckResult
  originalText?: string
}>()

const { locale, t } = useI18n()

type TabKey = 'template' | 'text' | 'original'
const activeTab = ref<TabKey>(props.result.structuredCv ? 'template' : 'text')
const selectedTemplate = ref<CvTemplateId>('slate-portrait')
const selectedPalette = ref<string>(CV_PALETTES[0]?.hex ?? '#3b4757')
const photoUrl = ref<string | null>(null)
const copied = ref(false)

const currentTemplateMeta = computed(
  () => CV_TEMPLATES.find((tpl) => tpl.id === selectedTemplate.value) ?? CV_TEMPLATES[0],
)

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
  if (photoUrl.value) URL.revokeObjectURL(photoUrl.value)
  photoUrl.value = URL.createObjectURL(file)
}

function clearPhoto(): void {
  if (photoUrl.value) {
    URL.revokeObjectURL(photoUrl.value)
    photoUrl.value = null
  }
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

function printReport(): void {
  activeTab.value = props.result.structuredCv ? 'template' : 'text'
  setTimeout(() => {
    window.print()
  }, 50)
}

onUnmounted(() => {
  if (photoUrl.value) URL.revokeObjectURL(photoUrl.value)
})
</script>

<template>
  <section class="report-card" data-testid="report-view">
    <div class="notice-banner no-print">
      {{ t[locale].expiryNotice }}
    </div>

    <header class="report-header no-print">
      <div>
        <span class="eyebrow">
          <Sparkles class="icon-sm" aria-hidden="true" />
          {{ result.service.toUpperCase() }}
        </span>
        <h2 class="report-title">CV Analysis &amp; Builder</h2>
      </div>

      <div class="score-box" :class="scoreBadgeClass" data-testid="score-badge">
        <span class="score-number">{{ result.score ?? 0 }}/100</span>
        <span class="score-label">{{ result.label ?? 'Reviewed' }}</span>
      </div>
    </header>

    <div class="feedback-grid no-print">
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

    <!-- Template & Color Customizer -->
    <div v-if="result.structuredCv" class="customizer-box no-print" data-testid="template-customizer">
      <div class="customizer-group">
        <span class="label">{{ t[locale].chooseTemplate }}</span>
        <div class="template-strip" role="radiogroup" aria-label="CV Templates">
          <button
            v-for="tpl in CV_TEMPLATES"
            :key="tpl.id"
            type="button"
            class="tpl-pill"
            :class="{ 'tpl-pill--active': selectedTemplate === tpl.id }"
            :data-testid="`tpl-${tpl.id}`"
            @click="selectedTemplate = tpl.id"
          >
            <strong>{{ tpl.name }}</strong>
            <span>{{ tpl.tag }}</span>
          </button>
        </div>
      </div>

      <div class="customizer-row">
        <div class="customizer-group">
          <span class="label">{{ t[locale].chooseColor }}</span>
          <div class="palette-row">
            <button
              v-for="pal in CV_PALETTES"
              :key="pal.id"
              type="button"
              class="swatch"
              :class="{ 'swatch--active': selectedPalette === pal.hex }"
              :style="{ backgroundColor: pal.hex }"
              :title="pal.name"
              :aria-label="pal.name"
              :data-testid="`palette-${pal.id}`"
              @click="selectedPalette = pal.hex"
            />
          </div>
        </div>

        <div v-if="currentTemplateMeta?.supportsPhoto" class="photo-controls">
          <label class="btn btn--secondary">
            <ImagePlus class="icon-sm" aria-hidden="true" />
            {{ t[locale].uploadPhoto }}
            <input type="file" accept="image/*" class="sr-only" @change="onPhotoSelected" />
          </label>
          <button v-if="photoUrl" type="button" class="btn btn--secondary" @click="clearPhoto">
            <X class="icon-sm" aria-hidden="true" />
            {{ t[locale].removePhoto }}
          </button>
        </div>
      </div>
    </div>

    <!-- View Switcher & Download Actions -->
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
        <button type="button" class="btn btn--secondary" data-testid="copy-btn" @click="copyText">
          <Check v-if="copied" class="icon-sm" aria-hidden="true" />
          <Copy v-else class="icon-sm" aria-hidden="true" />
          {{ copied ? t[locale].copiedBtn : t[locale].copyBtn }}
        </button>

        <button type="button" class="btn btn--primary" data-testid="print-btn" @click="printReport">
          <Printer class="icon-sm" aria-hidden="true" />
          {{ t[locale].printBtn }}
        </button>
      </div>
    </div>

    <CvTemplatePreview
      v-if="activeTab === 'template' && result.structuredCv"
      :cv="result.structuredCv"
      :template-id="selectedTemplate"
      :accent-hex="selectedPalette"
      :photo-url="photoUrl"
    />

    <pre v-else class="cv-pre" data-testid="cv-output-text">{{ plainTextContent }}</pre>
  </section>
</template>
