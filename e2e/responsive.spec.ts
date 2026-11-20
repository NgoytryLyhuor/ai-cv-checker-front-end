import { expect, test } from '@playwright/test'

const VIEWPORTS = [
  { name: 'Oppo Find X6 (360x800)', width: 360, height: 800 },
  { name: 'iPhone (375x812)', width: 375, height: 812 },
  { name: 'Android Large (412x915)', width: 412, height: 915 },
  { name: 'Desktop (1280x720)', width: 1280, height: 720 },
]

const SAMPLE_RESPONSE = {
  data: {
    token: '00000000-0000-0000-0000-000000000000',
    service: 'full',
    status: 'COMPLETED',
    score: 78,
    label: 'Good',
    strengths: ['Clear layout', 'Quantified results', 'Relevant education'],
    weaknesses: ['Generic summary', 'Passive verbs', 'Missing skills grouping'],
    suggestions: ['Add target title', 'Use action verbs', 'Group skills'],
    improved_cv: 'SOKHA CHAN\nIT Support & Junior Developer\nPhnom Penh, Cambodia',
    translated_cv: '',
    structured_cv: {
      full_name: 'Sokha Chan',
      job_title: 'IT Support & Junior Developer',
      email: 'sokha.chan@example.com',
      phone: '+855 12 345 678',
      location: 'Phnom Penh, Cambodia',
      summary: 'Detail-oriented IT graduate with 1+ year experience in support and Laravel.',
      experience: [
        {
          role: 'IT Support & Junior Developer',
          company: 'Phnom Penh Fintech Co.',
          period: '2025 - Present',
          bullets: ['Resolved 40+ daily tickets with 95% satisfaction.'],
        },
      ],
      education: [
        {
          degree: 'B.Sc. in Computer Science',
          school: 'Royal University of Phnom Penh',
          period: '2021 - 2025',
        },
      ],
      skills: ['PHP', 'Laravel', 'Vue.js', 'SQL'],
      languages: ['Khmer (Native)', 'English (Professional)'],
    },
    error_message: null,
    expires_at: '2026-11-27T06:30:00Z',
    created_at: '2026-11-20T06:30:00Z',
  },
}

for (const vp of VIEWPORTS) {
  test.describe(`Responsive, Paste & Preview PDF QA: ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    test('renders all routes, paste mode, template switch, and Preview PDF modal cleanly in EN and KM', async ({
      page,
    }) => {
      const errors: string[] = []
      page.on('pageerror', (err) => errors.push(err.message))
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text())
      })

      await page.route('**/api/v1/sample', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(SAMPLE_RESPONSE),
        })
      })

      for (const path of ['/', '/sample', '/privacy', '/terms']) {
        await page.goto(path)
        await page.waitForLoadState('networkidle')

        const overflowEn = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        )
        expect(overflowEn, `Horizontal overflow on ${path} (EN)`).toBe(false)

        if (path === '/') {
          await expect(page.getByTestId('home-photo-input')).toBeAttached()
          await page.getByTestId('mode-paste').click()
          await expect(page.getByTestId('paste-textarea')).toBeVisible()
          await page.getByTestId('mode-upload').click()
        }

        await expect(page.getByTestId('site-footer')).toBeVisible()

        if (path === '/sample') {
          await expect(page.getByTestId('cv-template-sheet')).toBeVisible()
          await expect(page.getByTestId('cv-avatar-slot')).toBeVisible()
          await page.getByTestId('cat-scenic').click()
          await page.getByTestId('tpl-scenic-angkor-gold').click()
          await expect(page.getByTestId('cv-template-sheet')).toHaveClass(/a4-layout--scenic-header/)

          await page.getByTestId('preview-pdf-btn').click()
          await expect(page.getByTestId('pdf-preview-modal')).toBeVisible()
          const overflowModal = await page.evaluate(
            () => document.documentElement.scrollWidth > window.innerWidth,
          )
          expect(overflowModal, 'Overflow inside Preview PDF modal').toBe(false)
          await page.getByTestId('close-preview-btn').click()
          await expect(page.getByTestId('pdf-preview-modal')).toBeHidden()
        }

        await page.getByTestId('lang-toggle').click()
        const overflowKm = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        )
        expect(overflowKm, `Horizontal overflow on ${path} (KM)`).toBe(false)
        await page.getByTestId('lang-toggle').click()
      }

      expect(errors, `Console/Page errors: ${errors.join('; ')}`).toEqual([])
    })
  })
}
