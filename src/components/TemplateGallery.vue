<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ChevronLeft, ChevronRight, LayoutGrid, GalleryHorizontal } from 'lucide-vue-next'
import CvTemplatePreview from '@/components/CvTemplatePreview.vue'
import { useI18n } from '@/composables/useI18n'
import {
  CV_PALETTES,
  CV_TEMPLATES,
  type CvTemplateCategory,
  type CvTemplateOption,
} from '@/config/cvTemplates'
import type { StructuredCv } from '@/types/check'

const { locale, t } = useI18n()

const props = withDefaults(
  defineProps<{
    cv: StructuredCv
    selectedTemplateId: string
    selectedPaletteHex: string
    photoUrl?: string | null
    actionLabel?: string
  }>(),
  {
    photoUrl: null,
    actionLabel: 'Create with this template',
  },
)

const emit = defineEmits<{
  select: [template: CvTemplateOption, paletteHex: string]
  color: [template: CvTemplateOption, paletteHex: string]
  preview: [template: CvTemplateOption, paletteHex: string]
}>()

type CategoryFilter = 'all' | CvTemplateCategory
const categoryFilter = ref<CategoryFilter>('all')
const viewMode = ref<'carousel' | 'grid'>('carousel')
const trackRef = ref<HTMLElement | null>(null)

// Per-card active color state so users can tap color dots on any card live
const cardColors = reactive<Record<string, string>>({})

function getCardColor(tpl: CvTemplateOption): string {
  if (props.selectedTemplateId === tpl.id && props.selectedPaletteHex) {
    return cardColors[tpl.id] ?? props.selectedPaletteHex
  }
  return cardColors[tpl.id] ?? tpl.defaultColor
}

function getCardColorName(tpl: CvTemplateOption): string {
  const hex = getCardColor(tpl).toLowerCase()
  const swatchMatch = tpl.swatches.find((s) => s.hex.toLowerCase() === hex)
  if (swatchMatch) return swatchMatch.name
  const found = CV_PALETTES.find((p) => p.hex.toLowerCase() === hex)
  return found ? found.name : 'Original'
}

function getCardSwatches(tpl: CvTemplateOption): Array<{ id: string; name: string; hex: string }> {
  if (tpl.swatches.length > 0) {
    return tpl.swatches.map((s) => ({
      id: `color-${s.hex.replace('#', '').toLowerCase()}`,
      name: s.name,
      hex: s.hex,
    }))
  }
  return CV_PALETTES.slice(0, 8)
}

function pickCardColor(tpl: CvTemplateOption, hex: string): void {
  cardColors[tpl.id] = hex
  emit('color', tpl, hex)
}

function chooseCardTemplate(tpl: CvTemplateOption): void {
  const hex = getCardColor(tpl)
  emit('select', tpl, hex)
}

function previewCardTemplate(tpl: CvTemplateOption): void {
  const hex = getCardColor(tpl)
  emit('select', tpl, hex)
  emit('preview', tpl, hex)
}

const counts = computed(() => ({
  all: CV_TEMPLATES.length,
  classic: CV_TEMPLATES.filter((t) => t.category === 'classic').length,
  scenic: CV_TEMPLATES.filter((t) => t.category === 'scenic').length,
  backdrop: CV_TEMPLATES.filter((t) => t.category === 'backdrop').length,
}))

const filteredTemplates = computed(() => {
  if (categoryFilter.value === 'all') return CV_TEMPLATES
  return CV_TEMPLATES.filter((tpl) => tpl.category === categoryFilter.value)
})

function scrollCarousel(dir: -1 | 1): void {
  if (!trackRef.value) return
  const step = Math.max(280, Math.round(trackRef.value.clientWidth * 0.88))
  trackRef.value.scrollBy({ left: dir * step, behavior: 'smooth' })
}
</script>

<template>
  <section id="cv-designs" class="jb-gallery" data-testid="template-customizer">
    <p class="jb-eyebrow">{{ t[locale].galleryEyebrow }}</p>
    <h2 class="jb-title">{{ t[locale].galleryTitle }}</h2>
    <p class="jb-note">
      {{ t[locale].galleryNote }}
    </p>

    <div class="jb-toolbar">
      <div class="jb-family-chips" role="group" aria-label="Filter templates">
        <button
          type="button"
          class="jb-chip"
          :class="{ 'jb-chip--active': categoryFilter === 'all' }"
          data-testid="cat-all"
          @click="categoryFilter = 'all'"
        >
          {{ t[locale].catAll }} <span class="jb-chip-count">{{ counts.all }}</span>
        </button>
        <button
          type="button"
          class="jb-chip"
          :class="{ 'jb-chip--active': categoryFilter === 'classic' }"
          data-testid="cat-classic"
          @click="categoryFilter = 'classic'"
        >
          {{ t[locale].catClassic }} <span class="jb-chip-count">{{ counts.classic }}</span>
        </button>
        <button
          type="button"
          class="jb-chip"
          :class="{ 'jb-chip--active': categoryFilter === 'backdrop' }"
          data-testid="cat-backdrop"
          @click="categoryFilter = 'backdrop'"
        >
          {{ t[locale].catBackdrop }} <span class="jb-chip-count">{{ counts.backdrop }}</span>
        </button>
      </div>

      <div class="jb-toolbar-end">
        <div class="jb-view-switch" role="group" aria-label="Template view">
          <button
            type="button"
            class="jb-view-btn"
            :class="{ 'jb-view-btn--active': viewMode === 'carousel' }"
            data-testid="view-carousel"
            @click="viewMode = 'carousel'"
          >
            <GalleryHorizontal class="icon-sm" aria-hidden="true" />
            {{ t[locale].viewCarousel }}
          </button>
          <button
            type="button"
            class="jb-view-btn"
            :class="{ 'jb-view-btn--active': viewMode === 'grid' }"
            data-testid="view-grid"
            @click="viewMode = 'grid'"
          >
            <LayoutGrid class="icon-sm" aria-hidden="true" />
            {{ t[locale].viewGrid }}
          </button>
        </div>

        <div v-if="viewMode === 'carousel'" class="jb-arrows">
          <button
            type="button"
            class="jb-arrow"
            aria-label="Previous template"
            @click="scrollCarousel(-1)"
          >
            <ChevronLeft class="icon-sm" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="jb-arrow"
            aria-label="Next template"
            @click="scrollCarousel(1)"
          >
            <ChevronRight class="icon-sm" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <p class="jb-design-count" role="status">
      {{ filteredTemplates.length }} {{ t[locale].supportedTemplates }}
    </p>

    <div
      ref="trackRef"
      class="jb-cards-container"
      :class="viewMode === 'carousel' ? 'jb-cards--carousel' : 'jb-cards--grid'"
    >
      <article
        v-for="tpl in filteredTemplates"
        :key="tpl.id"
        class="jb-card"
        :class="{ 'jb-card--selected': selectedTemplateId === tpl.id }"
        :data-design-id="tpl.id"
      >
        <button
          type="button"
          class="jb-preview-btn"
          :aria-label="`Preview ${tpl.name}`"
          @click="previewCardTemplate(tpl)"
        >
          <div class="jb-preview-frame">
            <CvTemplatePreview
              :cv="cv"
              :template="tpl"
              :accent-hex="getCardColor(tpl)"
              :photo-url="photoUrl"
              :thumbnail="true"
            />
          </div>
          <span class="jb-thumb-caption">{{ t[locale].firstPagePreview }}</span>
        </button>

        <div class="jb-card-info">
          <h3 class="jb-card-title">
            {{ tpl.name }}
            <span v-if="tpl.hasNewBadge" class="jb-new-badge">New</span>
          </h3>
          <p class="jb-card-sub">
            {{ tpl.tier }} · {{ getCardColorName(tpl) }}
          </p>

          <div class="jb-colors" role="group" :aria-label="`${tpl.name} colors`">
            <button
              v-for="pal in getCardSwatches(tpl)"
              :key="`${tpl.id}-${pal.id}`"
              type="button"
              class="jb-color-dot"
              :class="{
                'jb-color-dot--active': getCardColor(tpl).toLowerCase() === pal.hex.toLowerCase(),
              }"
              :style="{ backgroundColor: pal.hex }"
              :title="pal.name"
              :aria-label="`${tpl.name} · ${pal.name}`"
              :data-testid="selectedTemplateId === tpl.id ? `palette-${pal.id}` : undefined"
              @click="pickCardColor(tpl, pal.hex)"
            />
          </div>

          <button
            type="button"
            class="jb-create-btn"
            :class="{ 'jb-create-btn--selected': selectedTemplateId === tpl.id }"
            :data-testid="`tpl-${tpl.id}`"
            @click="chooseCardTemplate(tpl)"
          >
            {{ selectedTemplateId === tpl.id ? `✓ ${t[locale].selectedLabel} (${tpl.name})` : actionLabel }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>
