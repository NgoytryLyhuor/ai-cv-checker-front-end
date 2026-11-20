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
          <span class="brand-dot" aria-hidden="true" />
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
          <RouterLink to="/#cv-designs" class="nav-link">
            {{ t[locale].navTemplates }}
          </RouterLink>
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
      <div class="footer-inner-wrap">
        <div class="footer-grid">
          <div class="footer-col footer-col--brand">
            <div class="footer-brand-row">
              <span class="brand-dot" aria-hidden="true" />
              <strong class="footer-brand">{{ t[locale].brand }}</strong>
            </div>
            <p class="footer-desc">
              {{ t[locale].footerTagline }}
            </p>
            <span class="footer-trust-pill">{{ t[locale].footerTrust }}</span>
          </div>

          <div class="footer-col">
            <strong class="footer-heading">{{ t[locale].footerNavTitle }}</strong>
            <div class="footer-links-col">
              <RouterLink to="/">{{ t[locale].footerHome }}</RouterLink>
              <RouterLink to="/#cv-designs">{{ t[locale].navTemplates }}</RouterLink>
              <RouterLink to="/sample">{{ t[locale].footerSample }}</RouterLink>
              <RouterLink to="/privacy">{{ t[locale].footerPrivacy }}</RouterLink>
              <RouterLink to="/terms">{{ t[locale].footerTerms }}</RouterLink>
            </div>
          </div>

          <div class="footer-col">
            <strong class="footer-heading">{{ t[locale].footerSupportTitle }}</strong>
            <p class="footer-desc">
              {{ t[locale].footerLocation }}<br>
              {{ t[locale].footerPrivacyNote }}
            </p>
          </div>
        </div>

        <div class="footer-bottom">
          <span>{{ t[locale].footerCopyright }}</span>
          <button
            type="button"
            class="footer-lang-btn"
            @click="toggleLocale"
          >
            <Languages class="icon-sm" aria-hidden="true" />
            {{ locale === 'en' ? 'ភាសាខ្មែរ (KM)' : 'English (EN)' }}
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>
