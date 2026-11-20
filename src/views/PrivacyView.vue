<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { locale, t } = useI18n()
</script>

<template>
  <article class="form-card prose">
    <h1>{{ t[locale].privacyTitle }}</h1>
    <p>
      <strong>{{ t[locale].privacy1Title }}</strong> {{ t[locale].privacy1Body }}
    </p>
    <p>
      <strong>{{ t[locale].privacy2Title }}</strong> {{ t[locale].privacy2Body }}
    </p>
    <p>
      <strong>{{ t[locale].privacy3Title }}</strong> {{ t[locale].privacy3Body }}
    </p>
  </article>
</template>
