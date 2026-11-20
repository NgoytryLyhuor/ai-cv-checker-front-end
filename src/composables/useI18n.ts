import { ref } from 'vue'

export type Locale = 'en' | 'km'

const locale = ref<Locale>('en')

const messages = {
  en: {
    brand: 'AI CV Checker',
    freeBadge: '100% Free v1',
    navSample: 'Sample Report',
    navPrivacy: 'Privacy',
    heroTitle: 'Improve Your CV & Translate Khmer ↔ English in Seconds',
    heroSubtitle:
      'Built for Cambodian job seekers applying to NGOs, banks, and international companies. Your file is read in your browser and never stored on our server.',
    noteTitle: 'Important:',
    noteBody: 'This tool improves and translates your CV document only. You use the improved CV to apply for jobs yourself.',
    uploadLabel: 'Upload your CV (.pdf or .docx, max 5 MB)',
    uploadHint: 'Text-based PDF or Word (.docx). Scanned image PDFs are not supported.',
    extracting: 'Reading CV text in your browser...',
    extractedReady: 'CV text extracted successfully',
    serviceLabel: 'Choose Service',
    serviceFull: 'Full Package (Score + Improved English + Khmer Translation)',
    serviceReview: 'Review & Rewrite in English Only',
    serviceKmToEn: 'Translate Khmer CV → Professional English',
    serviceEnToKm: 'Translate English CV → Khmer + Improved English',
    emailLabel: 'Email (optional)',
    consentLabel: 'I agree to send my extracted CV text to AI for review. Data is automatically deleted after 7 days.',
    submitBtn: 'Check My CV Free',
    submittingBtn: 'Analyzing with AI (10–30s)...',
    viewSample: 'View Free Sample Report',
    copyBtn: 'Copy Text',
    copiedBtn: 'Copied!',
    printBtn: 'Download / Print PDF',
    expiryNotice: 'Privacy notice: Your CV text and report are automatically deleted after 7 days. Please copy or print your PDF now.',
    tabImproved: 'Improved CV',
    tabTranslated: 'Translation',
    tabOriginal: 'Original Extracted',
    strengths: 'Strengths',
    weaknesses: 'Areas to Improve',
    suggestions: 'Actionable Suggestions',
    tryAnother: 'Check Another CV',
  },
  km: {
    brand: 'AI CV Checker',
    freeBadge: 'ឥតគិតថ្លៃ ១០០%',
    navSample: 'របាយការណ៍គំរូ',
    navPrivacy: 'ឯកជនភាព',
    heroTitle: 'កែលម្អ CV និងបកប្រែ ខ្មែរ ↔ អង់គ្លេស ក្នុងរយៈពេលប៉ុន្មានវិនាទី',
    heroSubtitle:
      'បង្កើតឡើងសម្រាប់អ្នកស្វែងរកការងារនៅកម្ពុជា ដែលដាក់ពាក្យទៅអង្គការ ធនាគារ និងក្រុមហ៊ុនអន្តរជាតិ។ ឯកសារត្រូវបានអានក្នុង Browser របស់អ្នក ដោយមិនរក្សាទុក File លើ Server ឡើយ។',
    noteTitle: 'សម្គាល់៖',
    noteBody: 'ឧបករណ៍នេះជួយកែលម្អ និងបកប្រែ CV របស់អ្នកតែប៉ុណ្ណោះ។ លោកអ្នកយក CV ដែលកែលម្អរួចទៅដាក់ពាក្យការងារដោយខ្លួនឯង។',
    uploadLabel: 'ជ្រើសរើសឯកសារ CV (.pdf ឬ .docx, អតិបរមា 5 MB)',
    uploadHint: 'សូមប្រើ PDF ឬ Word (.docx) ដែលមានអក្សរ។ មិនគាំទ្ររូបភាពស្កេនទេ។',
    extracting: 'កំពុងអានអក្សរពី CV ក្នុង Browser...',
    extractedReady: 'បានអានអក្សរពី CV រួចរាល់',
    serviceLabel: 'ជ្រើសរើសសេវាកម្ម',
    serviceFull: 'កញ្ចប់ពេញលេញ (ពិន្ទុ + កែលម្អភាសាអង់គ្លេស + បកប្រែខ្មែរ)',
    serviceReview: 'ពិនិត្យ និងកែលម្អជាភាសាអង់គ្លេសតែប៉ុណ្ណោះ',
    serviceKmToEn: 'បកប្រែ CV ខ្មែរ → អង់គ្លេសវិជ្ជាជីវៈ',
    serviceEnToKm: 'បកប្រែ CV អង់គ្លេស → ខ្មែរ + កែលម្អអង់គ្លេស',
    emailLabel: 'អ៊ីមែល (មិនបង្ខំ)',
    consentLabel: 'ខ្ញុំយល់ព្រមឱ្យ AI ពិនិត្យអត្ថបទ CV របស់ខ្ញុំ។ ទិន្នន័យនឹងត្រូវលុបដោយស្វ័យប្រវត្តិក្រោយ ៧ ថ្ងៃ។',
    submitBtn: 'ពិនិត្យ CV ឥតគិតថ្លៃ',
    submittingBtn: 'AI កំពុងវិភាគ (១០–៣០ វិនាទី)...',
    viewSample: 'មើលរបាយការណ៍គំរូ',
    copyBtn: 'ចម្លងអត្ថបទ',
    copiedBtn: 'បានចម្លង!',
    printBtn: 'ទាញយក / បោះពុម្ព PDF',
    expiryNotice: 'សេចក្តីជូនដំណឹង៖ អត្ថបទ CV និងរបាយការណ៍នឹងត្រូវលុបក្រោយ ៧ ថ្ងៃ។ សូមចម្លង ឬទាញយក PDF ឥឡូវនេះ។',
    tabImproved: 'CV កែលម្អរួច',
    tabTranslated: 'អត្ថបទបកប្រែ',
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
