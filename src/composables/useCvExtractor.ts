import { ref } from 'vue'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const MIN_TEXT_CHARS = 100
const MAX_TEXT_CHARS = 50000

export function useCvExtractor() {
  const isExtracting = ref(false)
  const extractError = ref<string | null>(null)
  const extractedText = ref('')
  const fileName = ref('')
  const warning = ref<string | null>(null)

  async function extractFile(file: File): Promise<void> {
    extractError.value = null
    warning.value = null
    extractedText.value = ''
    fileName.value = file.name

    const lower = file.name.toLowerCase()
    const isPdf = lower.endsWith('.pdf') || file.type === 'application/pdf'
    const isDocx =
      lower.endsWith('.docx') ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    if (!isPdf && !isDocx) {
      extractError.value = 'Unsupported file type. Please upload a .pdf or .docx file.'
      return
    }

    if (file.size > MAX_FILE_BYTES) {
      extractError.value = 'File is larger than 5 MB. Please upload a smaller CV.'
      return
    }

    isExtracting.value = true
    try {
      let rawText = ''
      if (isPdf) {
        rawText = await extractPdfText(file)
      } else {
        rawText = await extractDocxText(file)
      }

      const cleaned = rawText.replace(/\s+/g, ' ').trim()
      if (cleaned.length < MIN_TEXT_CHARS) {
        extractError.value =
          'Could not read enough text. Please use a text-based PDF or DOCX, not a scanned image.'
        return
      }

      if (cleaned.length > MAX_TEXT_CHARS) {
        extractedText.value = rawText.slice(0, MAX_TEXT_CHARS)
        warning.value = 'Your CV is very long and was trimmed to 50,000 characters for analysis.'
      } else {
        extractedText.value = rawText.trim()
      }
    } catch (err: unknown) {
      const name = err instanceof Error ? err.name : ''
      if (name === 'PasswordException') {
        extractError.value = 'This PDF is password-protected. Please unlock it and try again.'
      } else {
        extractError.value =
          'Could not read this file. Please ensure it is a valid text-based PDF or DOCX.'
      }
    } finally {
      isExtracting.value = false
    }
  }

  return {
    isExtracting,
    extractError,
    extractedText,
    fileName,
    warning,
    extractFile,
  }
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist')
  const workerSrcModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrcModule.default

  const buffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: buffer }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const line = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pages.push(line)
  }

  return pages.join('\n')
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import('mammoth')
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value
}
