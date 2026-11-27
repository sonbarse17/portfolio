import { expect, test } from '@playwright/test'

test('the recovery chapter keeps its still and controls if the film is unavailable', async ({
  page,
}) => {
  let attempted = 0
  await page.route(/\/phase-four\/recovery-channel(?:-mobile)?\.(?:webm|mp4)$/, (route) => {
    attempted += 1
    return route.abort()
  })
  await page.goto('/')
  const film = page.locator('.failover-film')
  await film.scrollIntoViewIfNeeded()
  await expect.poll(() => attempted).toBeGreaterThan(0)
  await expect(film.locator('video')).toHaveAttribute('data-playing', 'false')
  await expect
    .poll(() => film.locator('picture img').evaluate((img: HTMLImageElement) => img.naturalWidth))
    .toBeGreaterThan(0)
  await expect(page.getByRole('button', { name: 'Try the simulator' })).toBeVisible()
})

test('data saving keeps the recovery poster until the visitor asks for the film', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      value: Object.assign(new EventTarget(), { saveData: true, effectiveType: '4g' }),
    })
  })
  await page.goto('/')
  const film = page.locator('.failover-film')
  await film.scrollIntoViewIfNeeded()
  const load = film.getByRole('button', { name: 'Load recovery film' })
  await expect(load).toBeVisible()
  await expect(film.locator('video source')).toHaveCount(0)
  await expect(film.locator('picture img')).toBeVisible()

  await load.click()
  await expect(film.locator('video source')).toHaveCount(2)
  await expect(film.locator('video source').first()).toHaveAttribute(
    'src',
    /phase-four\/recovery-channel/
  )
})

test('the request layers take visitors to matching project and lab evidence', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Trace Azure ingress' })).toHaveAttribute(
    'href',
    '/work/azure-internal-access#architecture'
  )
  await page.getByRole('button', { name: 'Recovery', exact: true }).press('Enter')
  await expect(page.getByRole('link', { name: 'Explore failover' })).toHaveAttribute(
    'href',
    '#break-it'
  )
  await expect(page.locator('.stack-art')).toHaveAttribute('data-renderer', 'poster')
})

test('profile and project pages publish their own discovery metadata', async ({
  page,
  request,
}) => {
  await page.goto('/')
  const profile = await page.locator('script[type="application/ld+json"]').textContent()
  expect(JSON.parse(profile ?? '{}')).toMatchObject({
    '@type': 'ProfilePage',
    mainEntity: { '@type': 'Person', name: 'Sushant Sonbarse' },
  })
  await page.goto('/work/crm-on-eks')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://sushantsonbarse.in/work/crm-on-eks'
  )
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://sushantsonbarse.in/work/crm-on-eks'
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /\/assets\/phase-four\/share\.jpg$/
  )
  await expect(page.getByRole('tablist')).toHaveCount(0)
  const artwork = await request.get('/assets/phase-four/share.jpg')
  expect(artwork.ok()).toBe(true)
  expect(artwork.headers()['content-type']).toContain('image/jpeg')
})
