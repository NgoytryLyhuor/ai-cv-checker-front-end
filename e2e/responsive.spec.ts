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
    improved_cv: 'SOKHA CHAN\nPhnom Penh, Cambodia\nSenior IT Support Specialist\nhttps://example.com/very-long-portfolio-link-that-must-wrap-cleanly-on-mobile-devices',
    translated_cv: 'សុខា ចាន់\nភ្នំពេញ កម្ពុជា\nអ្នកឯកទេសគាំទ្របច្ចេកវិទ្យាព័ត៌មានជាន់ខ្ពស់',
    error_message: null,
    expires_at: '2026-11-27T06:30:00Z',
    created_at: '2026-11-20T06:30:00Z',
  },
}

for (const vp of VIEWPORTS) {
  test.describe(`Responsive QA: ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } })

    test('renders all routes cleanly without horizontal overflow in EN and KM', async ({ page }) => {
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

        // Check English layout
        const overflowEn = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        )
        expect(overflowEn, `Horizontal overflow on ${path} (EN)`).toBe(false)

        for (const testId of ['nav-sample', 'nav-privacy', 'lang-toggle']) {
          const box = await page.getByTestId(testId).boundingBox()
          expect(box, `${testId} missing on ${path}`).not.toBeNull()
          if (box) {
            expect(box.x, `${testId} clipped left`).toBeGreaterThanOrEqual(0)
            expect(box.x + box.width, `${testId} clipped right`).toBeLessThanOrEqual(vp.width + 1)
          }
        }

        if (path === '/sample') {
          await expect(page.getByTestId('report-view')).toBeVisible()
          const copyBox = await page.getByTestId('copy-btn').boundingBox()
          const printBox = await page.getByTestId('print-btn').boundingBox()
          expect(copyBox).not.toBeNull()
          expect(printBox).not.toBeNull()
          if (copyBox && printBox) {
            expect(copyBox.x + copyBox.width).toBeLessThanOrEqual(vp.width + 1)
            expect(printBox.x + printBox.width).toBeLessThanOrEqual(vp.width + 1)
          }
        }

        // Switch to Khmer and re-check overflow
        await page.getByTestId('lang-toggle').click()
        const overflowKm = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        )
        expect(overflowKm, `Horizontal overflow on ${path} (KM)`).toBe(false)

        // Toggle back to EN for next route
        await page.getByTestId('lang-toggle').click()
      }

      expect(errors, `Console/Page errors: ${errors.join('; ')}`).toEqual([])
    })
  })
}
