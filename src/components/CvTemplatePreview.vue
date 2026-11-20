<script setup lang="ts">
import { computed } from 'vue'
import type { CvTemplateId } from '@/config/cvTemplates'
import type { StructuredCv } from '@/types/check'

const props = defineProps<{
  cv: StructuredCv
  templateId: CvTemplateId
  accentHex: string
  photoUrl?: string | null
}>()

const hasSidebar = computed(() =>
  ['slate-portrait', 'navy-ribbon', 'two-tone-corner'].includes(props.templateId),
)

const contactItems = computed(() =>
  [props.cv.email, props.cv.phone, props.cv.location].filter((item) => item.trim() !== ''),
)
</script>

<template>
  <article
    class="cv-sheet"
    :class="`cv-tpl--${templateId}`"
    :style="{ '--cv-accent': accentHex }"
    data-testid="cv-template-sheet"
  >
    <!-- Header for Banner / Classic / Frame / Minimal -->
    <header v-if="templateId !== 'slate-portrait'" class="cv-sheet-header">
      <div class="cv-header-main">
        <h1 class="cv-name">{{ cv.fullName }}</h1>
        <p class="cv-role">{{ cv.jobTitle }}</p>
        <p v-if="contactItems.length" class="cv-contact-line">
          {{ contactItems.join('  •  ') }}
        </p>
      </div>
      <img
        v-if="photoUrl && (templateId === 'navy-ribbon' || templateId === 'two-tone-corner')"
        :src="photoUrl"
        alt="Candidate portrait"
        class="cv-avatar"
      />
    </header>

    <div class="cv-sheet-body" :class="{ 'cv-sheet-body--split': hasSidebar }">
      <!-- Sidebar Column for Split Templates -->
      <aside v-if="hasSidebar" class="cv-sidebar">
        <div v-if="templateId === 'slate-portrait'" class="cv-sidebar-identity">
          <img v-if="photoUrl" :src="photoUrl" alt="Candidate portrait" class="cv-avatar cv-avatar--lg" />
          <h1 class="cv-name cv-name--sidebar">{{ cv.fullName }}</h1>
          <p class="cv-role cv-role--sidebar">{{ cv.jobTitle }}</p>
        </div>

        <div v-if="contactItems.length && templateId === 'slate-portrait'" class="cv-block">
          <h2 class="cv-heading cv-heading--sidebar">Contact</h2>
          <ul class="cv-list cv-list--plain">
            <li v-for="(item, i) in contactItems" :key="`c-${i}`">{{ item }}</li>
          </ul>
        </div>

        <div v-if="cv.skills.length" class="cv-block">
          <h2 class="cv-heading" :class="{ 'cv-heading--sidebar': templateId === 'slate-portrait' }">
            Skills
          </h2>
          <div class="cv-chips">
            <span v-for="(skill, i) in cv.skills" :key="`sk-${i}`" class="cv-chip">
              {{ skill }}
            </span>
          </div>
        </div>

        <div v-if="cv.languages.length" class="cv-block">
          <h2 class="cv-heading" :class="{ 'cv-heading--sidebar': templateId === 'slate-portrait' }">
            Languages
          </h2>
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
          <div v-for="(exp, i) in cv.experience" :key="`exp-${i}`" class="cv-entry">
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
          <div v-for="(edu, i) in cv.education" :key="`edu-${i}`" class="cv-entry">
            <div class="cv-entry-top">
              <strong>{{ edu.degree }}</strong>
              <span v-if="edu.period" class="cv-period">{{ edu.period }}</span>
            </div>
            <p v-if="edu.school" class="cv-company">{{ edu.school }}</p>
          </div>
        </section>

        <!-- Skills & Languages inline for single-column templates -->
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
