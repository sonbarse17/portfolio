import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const viewports = [
  { width: 3440, height: 1440 },
  { width: 2560, height: 1440 },
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 320, height: 568 },
]

test('the hero keeps the primary actions in view at the requested screen sizes', async ({
  browser,
  baseURL,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'chromium',
    'This test creates its own desktop and touch contexts.'
  )
  test.slow()

  for (const viewport of viewports) {
    const touch = viewport.width < 900
    const context = await browser.newContext({
      baseURL,
      viewport,
      hasTouch: touch,
      isMobile: viewport.width <= 430,
      reducedMotion: 'reduce',
    })

    try {
      const page = await context.newPage()
      await page.goto('/')
      const hero = page.getByRole('region', { name: 'Sushant Sonbarse' })
      const dimensions = `${viewport.width} × ${viewport.height}`

      await expect(hero.getByRole('heading', { level: 1 }), dimensions).toBeInViewport({ ratio: 1 })
      await expect(hero.getByRole('link', { name: 'See the work' }), dimensions).toBeInViewport({
        ratio: 1,
      })
      await expect(hero.getByRole('link', { name: 'View résumé' }), dimensions).toBeInViewport({
        ratio: 1,
      })
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      )
      expect(overflow, dimensions).toBeLessThanOrEqual(0)
    } finally {
      await context.close()
    }
  }
})

test('chapter navigation brings the destination below the sticky navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const rail = page.getByRole('navigation', { name: 'Portfolio chapters' })
  const experience = rail.getByRole('link', { name: 'Experience' })
  await experience.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#record$/)
  await expect(experience).toHaveAttribute('aria-current', 'location')

  const railBottom = await rail.evaluate((element) => element.getBoundingClientRect().bottom)
  const titleTop = await page
    .getByRole('heading', { name: 'Experience.', exact: true })
    .evaluate((element) => element.getBoundingClientRect().top)
  expect(titleTop).toBeGreaterThanOrEqual(railBottom - 1)
})

test('the infrastructure layers remain explorable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const layers = page.getByRole('group', { name: 'Infrastructure layers' })
  const ingress = layers.getByRole('button', { name: 'Ingress' })
  const recovery = layers.getByRole('button', { name: 'Recovery' })
  const scene = page.locator('.stack-art')
  const still = () =>
    scene.locator('picture img').evaluate((image: HTMLImageElement) => image.currentSrc)
  const initial = await still()

  await recovery.focus()
  await page.keyboard.press('Enter')
  await expect(recovery).toHaveAttribute('aria-pressed', 'true')
  await expect(ingress).toHaveAttribute('aria-pressed', 'false')
  await expect(scene).toHaveAttribute('data-renderer', 'poster')
  await expect.poll(still).not.toBe(initial)
  await expect
    .poll(() =>
      scene.locator('picture img').evaluate((image: HTMLImageElement) => image.naturalWidth)
    )
    .toBeGreaterThan(0)
})

test('a failed contact submission keeps the draft and provides a contact alternative', async ({
  page,
}) => {
  await page.route('https://api.emailjs.com/**', (route) => route.abort())
  await page.goto('/#contact')

  const contact = page.getByRole('region', { name: 'Let’s talk infrastructure.' })
  await contact.getByLabel('Name').fill('Portfolio browser test')
  await contact.getByLabel('Email').fill('browser-test@example.com')
  const message = contact.getByLabel('What are you working on?')
  await message.fill('Check that a connection error preserves this draft.')
  await contact.getByRole('button', { name: 'Send message' }).click()

  const status = contact.getByRole('status')
  await expect(status).toContainText('That did not send')
  await expect(status.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    'https://linkedin.com/in/sushant-sonbarse'
  )
  await expect(message).toHaveValue('Check that a connection error preserves this draft.')
  await expect(contact.getByRole('button', { name: 'Send message' })).toBeEnabled()
})

test('both flagship case studies pass accessibility checks in the light theme', async ({
  page,
}) => {
  test.slow()
  await page.addInitScript(() => localStorage.setItem('theme', 'light'))

  for (const slug of ['azure-internal-access', 'aws-hosting-and-sso']) {
    await page.goto(`/work/${slug}`)
    await expect(page.locator('html')).toHaveClass(/light/)
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(
      axe.violations.map(({ id, nodes }) => `${id}: ${nodes[0].target}`),
      slug
    ).toEqual([])
  }
})
