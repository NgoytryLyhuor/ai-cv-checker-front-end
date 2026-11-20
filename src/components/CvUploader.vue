<script setup lang="ts">
import { ref } from 'vue'
import { FileText, UploadCloud, AlertCircle, CheckCircle2 } from 'lucide-vue-next'
import { useCvExtractor } from '@/composables/useCvExtractor'
import { useI18n } from '@/composables/useI18n'

const emit = defineEmits<{
  extracted: [text: string]
}>()

const { locale, t } = useI18n()
const { isExtracting, extractError, extractedText, fileName, warning, extractFile } =
  useCvExtractor()
const isDragging = ref(false)

async function handleFiles(files: FileList | null): Promise<void> {
  const file = files?.[0]
  if (!file) return
  await extractFile(file)
  emit('extracted', extractedText.value)
}

function onInputChange(event: Event): void {
  const target = event.target as HTMLInputElement
  void handleFiles(target.files)
}

function onDrop(event: DragEvent): void {
  isDragging.value = false
  void handleFiles(event.dataTransfer?.files ?? null)
}
</script>

<template>
  <div class="uploader-wrapper">
    <label
      for="cv-file-input"
      class="dropzone"
      :class="{ 'dropzone--active': isDragging, 'dropzone--ready': !!extractedText }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <input
        id="cv-file-input"
        data-testid="cv-file-input"
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        class="sr-only"
        @change="onInputChange"
      />
      <UploadCloud class="icon-lg" aria-hidden="true" />
      <span class="dropzone-title">{{ t[locale].uploadLabel }}</span>
      <span class="dropzone-hint">{{ t[locale].uploadHint }}</span>

      <span v-if="fileName" class="file-pill">
        <FileText class="icon-sm" aria-hidden="true" />
        {{ fileName }}
      </span>
    </label>

    <p v-if="isExtracting" class="status status--info" aria-live="polite">
      {{ t[locale].extracting }}
    </p>

    <p
      v-else-if="extractError"
      data-testid="extract-error"
      class="status status--error"
      role="alert"
    >
      <AlertCircle class="icon-sm" aria-hidden="true" />
      {{ extractError }}
    </p>

    <p v-else-if="extractedText" data-testid="extract-success" class="status status--success">
      <CheckCircle2 class="icon-sm" aria-hidden="true" />
      {{ t[locale].extractedReady }} ({{ extractedText.length.toLocaleString() }} chars)
    </p>

    <p v-if="warning" class="status status--warn">
      {{ warning }}
    </p>
  </div>
</template>
