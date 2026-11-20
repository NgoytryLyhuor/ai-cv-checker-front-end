<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Copy, Printer, Sparkles } from 'lucide-vue-next'
import type { CheckResult } from '@/types/check'
import { useI18n } from '@/composables/useI18n'

const props = defineProps<{
  result: CheckResult
  originalText?: string
}>()

const { locale, t } = useI18n()

type TabKey = 'improved' | 'translated' | 'original'
const activeTab = ref<TabKey>('improved')
const copiedTab = ref<TabKey | null>(null)

const hasTranslation = computed(() => Boolean(props.result.translatedCv?.trim()))
const hasOriginal = computed(() => Boolean(props.originalText?.trim()))

const activeContent = computed(() => {
  if (activeTab.value === 'translated') return props.result.translatedCv ?? ''
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

async function copyActiveText(): Promise<void> {
  if (!activeContent.value) return
  await navigator.clipboard.writeText(activeContent.value)
  copiedTab.value = activeTab.value
  setTimeout(() => {
    copiedTab.value = null
  }, 2000)
}

function printReport(): void {
  window.print()
}
</script>

<template>
  <section class="report-card" data-testid="report-view">
    <div class="notice-banner no-print">
      {{ t[locale].expiryNotice }}
    </div>

    <header class="report-header">
      <div>
        <span class="eyebrow">
          <Sparkles class="icon-sm" aria-hidden="true" />
          {{ result.service.toUpperCase() }}
        </span>
        <h2 class="report-title">CV Analysis Report</h2>
      </div>

      <div class="score-box" :class="scoreBadgeClass" data-testid="score-badge">
        <span class="score-number">{{ result.score ?? 0 }}/100</span>
        <span class="score-label">{{ result.label ?? 'Reviewed' }}</span>
      </div>
    </header>

    <div class="feedback-grid">
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

    <div class="cv-output-section">
      <div class="tabs-bar no-print">
        <div class="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'improved'"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'improved' }"
            data-testid="tab-improved"
            @click="activeTab = 'improved'"
          >
            {{ t[locale].tabImproved }}
          </button>

          <button
            v-if="hasTranslation"
            type="button"
            role="tab"
            :aria-selected="activeTab === 'translated'"
            class="tab-btn"
            :class="{ 'tab-btn--active': activeTab === 'translated' }"
            data-testid="tab-translated"
            @click="activeTab = 'translated'"
          >
            {{ t[locale].tabTranslated }}
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
            type="button"
            class="btn btn--secondary"
            data-testid="copy-btn"
            @click="copyActiveText"
          >
            <Check v-if="copiedTab === activeTab" class="icon-sm" aria-hidden="true" />
            <Copy v-else class="icon-sm" aria-hidden="true" />
            {{ copiedTab === activeTab ? t[locale].copiedBtn : t[locale].copyBtn }}
          </button>

          <button
            type="button"
            class="btn btn--primary"
            data-testid="print-btn"
            @click="printReport"
          >
            <Printer class="icon-sm" aria-hidden="true" />
            {{ t[locale].printBtn }}
          </button>
        </div>
      </div>

      <pre class="cv-pre" data-testid="cv-output-text">{{ activeContent }}</pre>
    </div>
  </section>
</template>
