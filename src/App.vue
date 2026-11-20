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

    <footer class="footer no-print" data-testid="site-footer">
      <div class="footer-grid">
        <div class="footer-col">
          <strong class="footer-brand">MY CV BUILDER</strong>
          <p class="footer-desc">
            Built for Cambodian job seekers. Turn any messy CV into a clean, professional English resume across 41 templates — 100% Free v1.
          </p>
        </div>

        <div class="footer-col">
          <strong class="footer-heading">Navigation</strong>
          <div class="footer-links-col">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/sample">Sample &amp; 41 Templates</RouterLink>
            <RouterLink to="/privacy">Privacy Policy</RouterLink>
            <RouterLink to="/terms">Terms and Conditions</RouterLink>
          </div>
        </div>

        <div class="footer-col">
          <strong class="footer-heading">Privacy &amp; Support</strong>
          <p class="footer-desc">
            Phnom Penh, Cambodia<br>
            Files stay in your browser · Auto-deleted after 7 days
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 MY CV BUILDER. All Rights Reserved.</span>
      </div>
    </footer>
  </div>
</template>
