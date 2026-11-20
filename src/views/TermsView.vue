<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { locale, t } = useI18n()
</script>

<template>
  <article class="form-card prose">
    <h1>{{ t[locale].termsTitle }}</h1>
    <p>
      <strong>{{ t[locale].terms1Title }}</strong> {{ t[locale].terms1Body }}
    </p>
    <p>
      <strong>{{ t[locale].terms2Title }}</strong> {{ t[locale].terms2Body }}
    </p>
  </article>
</template>
