<script setup lang="ts">
import { computed } from 'vue'
import type { CvTemplateOption } from '@/config/cvTemplates'
import type { StructuredCv } from '@/types/check'

const props = defineProps<{
  cv: StructuredCv
  template: CvTemplateOption
  accentHex: string
  photoUrl?: string | null
}>()

const hasSidebar = computed(() =>
  ['sidebar-left-dark', 'sidebar-right-tint', 'two-tone-diagonal'].includes(props.template.layout),
)

const isDarkSidebar = computed(() => props.template.layout === 'sidebar-left-dark')

const contactItems = computed(() =>
  [props.cv.email, props.cv.phone, props.cv.location].filter((item) => item.trim() !== ''),
)

const initials = computed(() => {
  const parts = props.cv.fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'CV'
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase()
})
</script>

<template>
  <article
    class="cv-sheet"
    :class="[`cv-layout--${template.layout}`, { 'cv-sheet--serif': template.serif }]"
    :style="{ '--cv-accent': accentHex }"
    data-testid="cv-template-sheet"
  >
    <!-- Scenic Temple/Horizon Header -->
    <header v-if="template.layout === 'scenic-header'" class="cv-scenic-banner">
      <svg class="cv-scenic-svg" viewBox="0 0 800 90" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M0,90 L0,60 L120,60 L150,42 L180,60 L270,60 L300,32 L320,45 L350,18 L380,45 L400,32 L430,60 L540,60 L570,40 L600,60 L800,60 L800,90 Z"
          fill="rgba(255,255,255,0.16)"
        />
      </svg>
      <div class="cv-scenic-content">
        <div>
          <h1 class="cv-name cv-name--white">{{ cv.fullName }}</h1>
          <p class="cv-role cv-role--white">{{ cv.jobTitle }}</p>
          <p v-if="contactItems.length" class="cv-contact-line cv-contact-line--white">
            {{ contactItems.join('  •  ') }}
          </p>
        </div>
        <img v-if="photoUrl" :src="photoUrl" alt="Candidate portrait" class="cv-avatar" data-testid="cv-avatar-slot" />
        <div v-else class="cv-avatar-placeholder" data-testid="cv-avatar-slot">{{ initials }}</div>
      </div>
    </header>

    <!-- Header for non-sidebar-left-dark & non-scenic -->
    <header
      v-else-if="template.layout !== 'sidebar-left-dark'"
      class="cv-sheet-header"
      :class="{
        'cv-header--banner': template.layout === 'ribbon-banner',
        'cv-header--backdrop': template.layout === 'faded-backdrop',
        'cv-header--centered': template.layout === 'ats-classic' && template.serif,
      }"
    >
      <div class="cv-header-main">
        <h1 class="cv-name">{{ cv.fullName }}</h1>
        <p class="cv-role">{{ cv.jobTitle }}</p>
        <p v-if="contactItems.length" class="cv-contact-line">
          {{ contactItems.join('  •  ') }}
        </p>
      </div>
      <img v-if="photoUrl && template.supportsPhoto" :src="photoUrl" alt="Candidate portrait" class="cv-avatar" data-testid="cv-avatar-slot" />
      <div v-else-if="template.supportsPhoto" class="cv-avatar-placeholder" data-testid="cv-avatar-slot">{{ initials }}</div>
    </header>

    <div
      class="cv-sheet-body"
      :class="{
        'cv-sheet-body--split': hasSidebar,
        'cv-sheet-body--split-right': template.layout === 'sidebar-right-tint',
      }"
    >
      <!-- Sidebar Column for Split Layouts -->
      <aside v-if="hasSidebar" class="cv-sidebar" :class="{ 'cv-sidebar--dark': isDarkSidebar }">
        <div v-if="template.layout === 'sidebar-left-dark'" class="cv-sidebar-identity">
          <img v-if="photoUrl" :src="photoUrl" alt="Candidate portrait" class="cv-avatar cv-avatar--lg" data-testid="cv-avatar-slot" />
          <div v-else class="cv-avatar-placeholder cv-avatar-placeholder--lg" data-testid="cv-avatar-slot">{{ initials }}</div>
          <h1 class="cv-name cv-name--white">{{ cv.fullName }}</h1>
          <p class="cv-role cv-role--white">{{ cv.jobTitle }}</p>
        </div>

        <div v-if="contactItems.length && template.layout === 'sidebar-left-dark'" class="cv-block">
          <h2 class="cv-heading cv-heading--light">Contact</h2>
          <ul class="cv-list cv-list--plain">
            <li v-for="(item, i) in contactItems" :key="`c-${i}`">{{ item }}</li>
          </ul>
        </div>

        <div v-if="cv.skills.length" class="cv-block">
          <h2 class="cv-heading" :class="{ 'cv-heading--light': isDarkSidebar }">Skills</h2>
          <div class="cv-chips">
            <span v-for="(skill, i) in cv.skills" :key="`sk-${i}`" class="cv-chip">
              {{ skill }}
            </span>
          </div>
        </div>

        <div v-if="cv.languages.length" class="cv-block">
          <h2 class="cv-heading" :class="{ 'cv-heading--light': isDarkSidebar }">Languages</h2>
          <ul class="cv-list cv-list--plain">
            <li v-for="(lang, i) in cv.languages" :key="`lg-${i}`">{{ lang }}</li>
          </ul>
        </div>
      </aside>

      <!-- Main Column -->
      <div class="cv-main">
        <section v-if="cv.summary" class="cv-block">
          <h2 class="cv-heading">Professional Summary</h2>
          <p class="cv-text">{{ cv.summary }}</p>
        </section>

        <section v-if="cv.experience.length" class="cv-block">
          <h2 class="cv-heading">Work Experience</h2>
          <div
            v-for="(exp, i) in cv.experience"
            :key="`exp-${i}`"
            class="cv-entry"
            :class="{ 'cv-entry--timeline': template.layout === 'timeline-dots' }"
          >
            <div class="cv-entry-top">
              <strong>{{ exp.role }}</strong>
              <span v-if="exp.period" class="cv-period">{{ exp.period }}</span>
            </div>
            <p v-if="exp.company" class="cv-company">{{ exp.company }}</p>
            <ul v-if="exp.bullets.length" class="cv-list">
              <li v-for="(b, j) in exp.bullets" :key="`b-${i}-${j}`">{{ b }}</li>
            </ul>
          </div>
        </section>

        <section v-if="cv.education.length" class="cv-block">
          <h2 class="cv-heading">Education</h2>
          <div
            v-for="(edu, i) in cv.education"
            :key="`edu-${i}`"
            class="cv-entry"
            :class="{ 'cv-entry--timeline': template.layout === 'timeline-dots' }"
          >
            <div class="cv-entry-top">
              <strong>{{ edu.degree }}</strong>
              <span v-if="edu.period" class="cv-period">{{ edu.period }}</span>
            </div>
            <p v-if="edu.school" class="cv-company">{{ edu.school }}</p>
          </div>
        </section>

        <!-- Skills & Languages inline for single-column layouts -->
        <template v-if="!hasSidebar">
          <section v-if="cv.skills.length" class="cv-block">
            <h2 class="cv-heading">Skills</h2>
            <p class="cv-text">{{ cv.skills.join(' • ') }}</p>
          </section>

          <section v-if="cv.languages.length" class="cv-block">
            <h2 class="cv-heading">Languages</h2>
            <p class="cv-text">{{ cv.languages.join(' • ') }}</p>
          </section>
        </template>
      </div>
    </div>
  </article>
</template>
