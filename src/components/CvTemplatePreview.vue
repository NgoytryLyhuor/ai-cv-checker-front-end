<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getJobifyTemplateHtml, type CvTemplateOption } from '@/config/cvTemplates'
import { hydrateJobifyTemplate } from '@/utils/hydrateJobifyTemplate'
import type { StructuredCv } from '@/types/check'

const props = withDefaults(
  defineProps<{
    cv: StructuredCv
    template: CvTemplateOption
    accentHex: string
    photoUrl?: string | null
    thumbnail?: boolean
    exactSample?: boolean
  }>(),
  {
    photoUrl: null,
    thumbnail: false,
    exactSample: false,
  },
)

const wrapperRef = ref<HTMLElement | null>(null)
const scale = ref(1)
let ro: ResizeObserver | null = null

function updateScale(): void {
  if (!wrapperRef.value) return
  const w = wrapperRef.value.clientWidth
  if (w > 0) {
    scale.value = Math.min(1, w / 794)
  }
}

onMounted(() => {
  updateScale()
  if (typeof ResizeObserver !== 'undefined' && wrapperRef.value) {
    ro = new ResizeObserver(() => updateScale())
    ro.observe(wrapperRef.value)
  }
})

onUnmounted(() => {
  ro?.disconnect()
})

const initials = computed(() => {
  const parts = props.cv.fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'CV'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase()
})

const exactTemplateHtml = computed(() => {
  const raw = getJobifyTemplateHtml(props.template.id, props.accentHex)
  if (!raw) return null
  if (props.thumbnail || props.exactSample) return raw
  return hydrateJobifyTemplate(raw, props.cv, props.photoUrl)
})

const isSplitSidebar = computed(() =>
  [
    'sidebar-left-dark',
    'sidebar-right-tint',
    'two-tone-diagonal',
    'ats-classic',
  ].includes(props.template.layout),
)

const isSandStyle = computed(() => props.template.layout === 'sidebar-right-tint')
const isTwoToneCorner = computed(() => props.template.layout === 'two-tone-diagonal')
const isClassicNavy = computed(() => props.template.id === 'phnom-penh-classic')
</script>

<template>
  <div
    ref="wrapperRef"
    class="a4-scale-wrapper"
    :class="{ 'a4-scale-wrapper--thumb': thumbnail }"
    :style="{ height: `${Math.round(1123 * scale)}px` }"
  >
    <div
      v-if="exactTemplateHtml"
      class="cv-document donor-scope a4-exact-donor"
      :class="[`a4-layout--${template.layout}`, `a4-tpl--${template.id}`]"
      :style="{ transform: `scale(${scale})`, transformOrigin: 'top left' }"
      :data-testid="thumbnail ? 'cv-template-thumb' : 'cv-template-sheet'"
      v-html="exactTemplateHtml"
    />
    <article
      v-else
      class="a4-page"
      :class="[
        `a4-layout--${template.layout}`,
        `a4-tpl--${template.id}`,
        { 'a4-page--serif': template.serif },
      ]"
      :style="{
        '--cv-accent': accentHex,
        transform: `scale(${scale})`,
      }"
      :data-testid="thumbnail ? 'cv-template-thumb' : 'cv-template-sheet'"
    >
      <!-- Decorative Corner Triangles for Two-Tone Corner -->
      <template v-if="isTwoToneCorner">
        <div class="a4-corner-tl" aria-hidden="true" />
        <div class="a4-corner-tr" aria-hidden="true" />
      </template>

      <!-- Full-Width Top Banner Layouts (Ribbon, Scenic, Backdrop, Framed, Minimal, Timeline) -->
      <header
        v-if="!isSplitSidebar"
        class="a4-top-banner"
        :class="{
          'a4-top-banner--scenic': template.layout === 'scenic-header',
          'a4-top-banner--backdrop': template.layout === 'faded-backdrop',
          'a4-top-banner--minimal':
            template.layout === 'minimal-accent' ||
            template.layout === 'framed-border' ||
            template.layout === 'timeline-dots',
        }"
      >
        <svg
          v-if="template.layout === 'scenic-header'"
          class="a4-scenic-svg"
          viewBox="0 0 800 110"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,110 L0,75 L110,75 L145,48 L180,75 L280,75 L315,38 L340,55 L375,18 L410,55 L435,38 L470,75 L570,75 L605,46 L640,75 L800,75 L800,110 Z"
            fill="rgba(255,255,255,0.16)"
          />
        </svg>

        <div class="a4-top-banner-inner">
          <div class="a4-avatar-wrap" :data-testid="thumbnail ? undefined : 'cv-avatar-slot'">
            <img v-if="photoUrl" :src="photoUrl" alt="Candidate portrait" class="a4-avatar" />
            <div v-else class="a4-avatar-initials">{{ initials }}</div>
          </div>

          <div class="a4-banner-titles">
            <h1 class="a4-name">{{ cv.fullName }}</h1>
            <p class="a4-job-title">{{ cv.jobTitle }}</p>
            <div class="a4-contact-row">
              <span v-if="cv.phone">☎ {{ cv.phone }}</span>
              <span v-if="cv.email">✉ {{ cv.email }}</span>
              <span v-if="cv.location">⌂ {{ cv.location }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- 2-Column Split Body (Slate Portrait, Sand Profile, Phnom Penh Classic, Two-Tone Corner, or Full-Banner 2-Col) -->
      <div class="a4-columns">
        <!-- LEFT SIDEBAR -->
        <aside
          class="a4-sidebar"
          :class="{
            'a4-sidebar--sand': isSandStyle,
            'a4-sidebar--light': !isSplitSidebar,
            'a4-sidebar--corner': isTwoToneCorner,
          }"
        >
          <!-- Avatar inside Sidebar for Split Layouts -->
          <div
            v-if="isSplitSidebar"
            class="a4-sidebar-photo-box"
            :class="{ 'a4-sidebar-photo-box--overlap': isTwoToneCorner }"
            :data-testid="thumbnail ? undefined : 'cv-avatar-slot'"
          >
            <img v-if="photoUrl" :src="photoUrl" alt="Candidate portrait" class="a4-avatar a4-avatar--lg" />
            <div v-else class="a4-avatar-initials a4-avatar-initials--lg">{{ initials }}</div>
          </div>

          <!-- Contact Section (Slate Portrait & Two-Tone Corner & Phnom Penh Classic) -->
          <section class="a4-side-section">
            <h2 class="a4-side-heading">
              <span>{{ isSandStyle ? 'PROFILE' : isClassicNavy ? 'PERSONAL DETAILS' : 'CONTACT' }}</span>
            </h2>
            <p v-if="isSandStyle && cv.summary" class="a4-side-summary">
              {{ cv.summary }}
            </p>
            <ul v-else class="a4-contact-list">
              <li v-if="cv.phone">
                <span class="a4-contact-icon">☎</span>
                <span>{{ cv.phone }}</span>
              </li>
              <li v-if="cv.email">
                <span class="a4-contact-icon">✉</span>
                <span>{{ cv.email }}</span>
              </li>
              <li v-if="cv.location">
                <span class="a4-contact-icon">⌂</span>
                <span>{{ cv.location }}</span>
              </li>
            </ul>
          </section>

          <!-- Skills Section in Sidebar -->
          <section v-if="cv.skills.length" class="a4-side-section">
            <h2 class="a4-side-heading">
              <span>SKILLS</span>
            </h2>
            <div
              class="a4-skills-grid"
              :class="{ 'a4-skills-grid--boxes': isClassicNavy || isTwoToneCorner }"
            >
              <span v-for="(skill, i) in cv.skills" :key="`sk-${i}`" class="a4-skill-item">
                <template v-if="!isClassicNavy && !isTwoToneCorner">• </template>{{ skill }}
              </span>
            </div>
          </section>

          <!-- Education in Sidebar -->
          <section v-if="cv.education.length" class="a4-side-section">
            <h2 class="a4-side-heading">
              <span>EDUCATION</span>
            </h2>
            <div v-for="(edu, i) in cv.education" :key="`s-edu-${i}`" class="a4-side-edu">
              <strong class="a4-side-edu-deg">{{ edu.degree }}</strong>
              <span class="a4-side-edu-sch">{{ edu.school }}</span>
              <span v-if="edu.period" class="a4-side-edu-per">{{ edu.period }}</span>
            </div>
          </section>

          <!-- Languages with Progress Bars in Sidebar -->
          <section v-if="cv.languages.length" class="a4-side-section">
            <h2 class="a4-side-heading">
              <span>LANGUAGES</span>
            </h2>
            <div class="a4-lang-list">
              <div v-for="(lang, i) in cv.languages" :key="`lg-${i}`" class="a4-lang-item">
                <div class="a4-lang-row">
                  <span>{{ lang }}</span>
                </div>
                <div class="a4-lang-bar">
                  <div class="a4-lang-fill" :style="{ width: i === 0 ? '100%' : '82%' }" />
                </div>
              </div>
            </div>
          </section>
        </aside>

        <!-- RIGHT MAIN CONTENT -->
        <div class="a4-main">
          <!-- Right Header Block for Split Sidebar Templates (Slate Portrait, Sand Profile, Phnom Penh Classic, Two-Tone Corner) -->
          <header
            v-if="isSplitSidebar"
            class="a4-main-header"
            :class="{
              'a4-main-header--slate': template.id === 'slate-portrait',
              'a4-main-header--left': template.id !== 'slate-portrait',
            }"
          >
            <h1 class="a4-main-name">{{ cv.fullName }}</h1>
            <div class="a4-main-role-row">
              <span v-if="template.id === 'slate-portrait'" class="a4-role-line" />
              <p class="a4-main-role">{{ cv.jobTitle }}</p>
              <span v-if="template.id === 'slate-portrait'" class="a4-role-line" />
            </div>

            <!-- Inline Contact Grid for Sand Profile & Phnom Penh Classic -->
            <div v-if="isSandStyle || isClassicNavy" class="a4-main-contacts">
              <span v-if="cv.phone"><b>☎</b> {{ cv.phone }}</span>
              <span v-if="cv.email"><b>✉</b> {{ cv.email }}</span>
              <span v-if="cv.location"><b>⌂</b> {{ cv.location }}</span>
            </div>
          </header>

          <div class="a4-main-body">
            <!-- ABOUT ME -->
            <section v-if="cv.summary && !isSandStyle" class="a4-main-section">
              <div class="a4-section-title-row" :class="{ 'a4-section-title-row--shaded': isSandStyle }">
                <span class="a4-section-icon">■</span>
                <h2 class="a4-section-title">ABOUT ME</h2>
                <span class="a4-section-rule" />
              </div>
              <p class="a4-summary-text">{{ cv.summary }}</p>
            </section>

            <!-- WORK EXPERIENCE -->
            <section v-if="cv.experience.length" class="a4-main-section">
              <div class="a4-section-title-row" :class="{ 'a4-section-title-row--shaded': isSandStyle }">
                <span class="a4-section-icon">■</span>
                <h2 class="a4-section-title">WORK EXPERIENCE</h2>
                <span class="a4-section-rule" />
              </div>

              <div class="a4-timeline">
                <div v-for="(exp, i) in cv.experience" :key="`exp-${i}`" class="a4-exp-item">
                  <span class="a4-timeline-dot" />
                  <div class="a4-exp-head">
                    <div>
                      <strong class="a4-exp-role">{{ exp.role }}</strong>
                      <p v-if="exp.company" class="a4-exp-company">{{ exp.company }}</p>
                    </div>
                    <span
                      v-if="exp.period"
                      class="a4-date-pill"
                      :class="{ 'a4-date-pill--solid': isTwoToneCorner }"
                    >
                      {{ exp.period }}
                    </span>
                  </div>
                  <ul v-if="exp.bullets.length" class="a4-bullets">
                    <li v-for="(b, j) in exp.bullets" :key="`b-${i}-${j}`">{{ b }}</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- EDUCATION IN MAIN COLUMN -->
            <section v-if="cv.education.length" class="a4-main-section">
              <div class="a4-section-title-row" :class="{ 'a4-section-title-row--shaded': isSandStyle }">
                <span class="a4-section-icon">■</span>
                <h2 class="a4-section-title">EDUCATION</h2>
                <span class="a4-section-rule" />
              </div>

              <div class="a4-timeline">
                <div v-for="(edu, i) in cv.education" :key="`edu-${i}`" class="a4-exp-item">
                  <span class="a4-timeline-dot" />
                  <div class="a4-exp-head">
                    <div>
                      <strong class="a4-exp-role">{{ edu.degree }}</strong>
                      <p v-if="edu.school" class="a4-exp-company">{{ edu.school }}</p>
                    </div>
                    <span
                      v-if="edu.period"
                      class="a4-date-pill"
                      :class="{ 'a4-date-pill--solid': isTwoToneCorner }"
                    >
                      {{ edu.period }}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <!-- KEY COMPETENCIES / HIGHLIGHTS -->
            <section v-if="cv.skills.length" class="a4-main-section">
              <div class="a4-section-title-row" :class="{ 'a4-section-title-row--shaded': isSandStyle }">
                <span class="a4-section-icon">■</span>
                <h2 class="a4-section-title">CORE COMPETENCIES</h2>
                <span class="a4-section-rule" />
              </div>
              <div class="a4-main-tags">
                <span v-for="(sk, i) in cv.skills" :key="`m-sk-${i}`" class="a4-main-tag">
                  {{ sk }}
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
