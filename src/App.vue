<script setup lang="ts">
import { Languages } from 'lucide-vue-next'
import { useI18n } from '@/composables/useI18n'

const { locale, t, toggleLocale } = useI18n()
</script>

<template>
  <div class="app-shell">
    <header class="topbar no-print">
      <div class="topbar-inner">
        <RouterLink to="/" class="brand">
          {{ t[locale].brand }}
        </RouterLink>

        <button
          type="button"
          class="lang-btn"
          data-testid="lang-toggle"
          @click="toggleLocale"
        >
          <Languages class="icon-sm" aria-hidden="true" />
          {{ locale === 'en' ? 'ខ្មែរ' : 'EN' }}
        </button>

        <nav class="nav-links" aria-label="Main navigation">
          <RouterLink to="/sample" class="nav-link" data-testid="nav-sample">
            {{ t[locale].navSample }}
          </RouterLink>
          <RouterLink to="/privacy" class="nav-link" data-testid="nav-privacy">
            {{ t[locale].navPrivacy }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="main-container">
      <RouterView />
    </main>

    <footer class="footer no-print">
      <div class="footer-inner">
        <span>AI CV Checker — Free v1</span>
        <div class="footer-links">
          <RouterLink to="/privacy">Privacy</RouterLink>
          <RouterLink to="/terms">Terms</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>
