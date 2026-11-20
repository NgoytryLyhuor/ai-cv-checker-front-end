import { ref } from 'vue'

export type Locale = 'en' | 'km'

const locale = ref<Locale>('en')

const messages = {
  en: {
    brand: 'AI CV Checker',
    freeBadge: '100% Free v1',
    navSample: 'Sample & Templates',
    navPrivacy: 'Privacy',
    heroTitle: 'Turn Any Messy CV into a Professional English Template',
    heroSubtitle:
      'Upload your CV (PDF or Word). AI cleans your experience into structured English sections so you can pick a template, choose a color, and download your PDF.',
    noteTitle: 'Important:',
    noteBody: 'Generated CVs are in English only. This tool formats and improves your CV document—you use it to apply for jobs yourself.',
    uploadLabel: 'Upload your CV (.pdf or .docx, max 5 MB)',
    uploadHint: 'Text-based PDF or Word (.docx). Scanned image PDFs are not supported.',
    extracting: 'Reading CV text in your browser...',
    extractedReady: 'CV text extracted successfully',
    serviceLabel: 'Choose Processing Mode',
    serviceFull: 'Full AI Polish + English CV Template',
    serviceKmToEn: 'Translate Khmer CV → English CV Template',
    serviceReview: 'Rewrite & Structure Existing English CV',
    emailLabel: 'Email (optional)',
    consentLabel: 'I agree to send my extracted CV text to AI for review. Data is automatically deleted after 7 days.',
    submitBtn: 'Analyze & Build My CV Free',
    submittingBtn: 'AI is structuring your CV (10–30s)...',
    viewSample: 'Preview Templates & Sample',
    copyBtn: 'Copy Plain Text',
    copiedBtn: 'Copied!',
    printBtn: 'Download / Print PDF',
    expiryNotice: 'Privacy notice: Your CV text and report are automatically deleted after 7 days. Please download your PDF now.',
    chooseTemplate: '1. Choose CV Template',
    chooseColor: '2. Choose Color',
    uploadPhoto: 'Optional Photo (kept in browser)',
    removePhoto: 'Remove Photo',
    tabTemplate: 'Visual CV Template',
    tabText: 'Plain English Text',
    tabOriginal: 'Original Extracted',
    strengths: 'Strengths',
    weaknesses: 'Areas to Improve',
    suggestions: 'Actionable Suggestions',
    tryAnother: 'Check Another CV',
  },
  km: {
    brand: 'AI CV Checker',
    freeBadge: 'ឥតគិតថ្លៃ ១០០%',
    navSample: 'គំរូ និង Template',
    navPrivacy: 'ឯកជនភាព',
    heroTitle: 'ប្រែក្លាយ CV ធម្មតារបស់អ្នកទៅជា Template ភាសាអង់គ្លេសវិជ្ជាជីវៈ',
    heroSubtitle:
      'បញ្ចូល CV របស់អ្នក (PDF ឬ Word)។ AI នឹងបំបែក និងរៀបចំផ្នែកនីមួយៗជាភាសាអង់គ្លេសស្អាត ហើយអ្នកអាចជ្រើសរើស Template ពណ៌ និងទាញយក PDF បានភ្លាមៗ។',
    noteTitle: 'សម្គាល់៖',
    noteBody: 'CV ដែលបង្កើតចេញមានតែភាសាអង់គ្លេសប៉ុណ្ណោះ។ ឧបករណ៍នេះជួយរៀបចំ CV របស់អ្នក—លោកអ្នកយកទៅដាក់ពាក្យការងារដោយខ្លួនឯង។',
    uploadLabel: 'ជ្រើសរើសឯកសារ CV (.pdf ឬ .docx, អតិបរមា 5 MB)',
    uploadHint: 'សូមប្រើ PDF ឬ Word (.docx) ដែលមានអក្សរ។ មិនគាំទ្ររូបភាពស្កេនទេ។',
    extracting: 'កំពុងអានអក្សរពី CV ក្នុង Browser...',
    extractedReady: 'បានអានអក្សរពី CV រួចរាល់',
    serviceLabel: 'ជ្រើសរើសប្រភេទ',
    serviceFull: 'កែលម្អពេញលេញ + បង្កើត Template អង់គ្លេស',
    serviceKmToEn: 'បកប្រែ CV ខ្មែរ → Template អង់គ្លេស',
    serviceReview: 'កែសម្រួល និងរៀបចំ CV អង់គ្លេសឡើងវិញ',
    emailLabel: 'អ៊ីមែល (មិនបង្ខំ)',
    consentLabel: 'ខ្ញុំយល់ព្រមឱ្យ AI ពិនិត្យអត្ថបទ CV របស់ខ្ញុំ។ ទិន្នន័យនឹងត្រូវលុបដោយស្វ័យប្រវត្តិក្រោយ ៧ ថ្ងៃ។',
    submitBtn: 'វិភាគ និងបង្កើត CV ឥតគិតថ្លៃ',
    submittingBtn: 'AI កំពុងរៀបចំផ្នែក CV (១០–៣០ វិនាទី)...',
    viewSample: 'មើលគំរូ Template',
    copyBtn: 'ចម្លងអត្ថបទ',
    copiedBtn: 'បានចម្លង!',
    printBtn: 'ទាញយក / បោះពុម្ព PDF',
    expiryNotice: 'សេចក្តីជូនដំណឹង៖ អត្ថបទ CV និងរបាយការណ៍នឹងត្រូវលុបក្រោយ ៧ ថ្ងៃ។ សូមទាញយក PDF ឥឡូវនេះ។',
    chooseTemplate: '១. ជ្រើសរើស Template CV',
    chooseColor: '២. ជ្រើសរើសពណ៌',
    uploadPhoto: 'រូបថត (មិនបង្ខំ - រក្សាក្នុង Browser)',
    removePhoto: 'ដករូបថត',
    tabTemplate: 'ទម្រង់ CV ស្អាត',
    tabText: 'អត្ថបទអង់គ្លេស',
    tabOriginal: 'អត្ថបទដើម',
    strengths: 'ចំណុចខ្លាំង',
    weaknesses: 'ចំណុចគួរកែលម្អ',
    suggestions: 'ការណែនាំជាក់ស្តែង',
    tryAnother: 'ពិនិត្យ CV ផ្សេងទៀត',
  },
} as const

export function useI18n() {
  function toggleLocale(): void {
    locale.value = locale.value === 'en' ? 'km' : 'en'
  }

  return {
    locale,
    t: messages,
    toggleLocale,
  }
}
