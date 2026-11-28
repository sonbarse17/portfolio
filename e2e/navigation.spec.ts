import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { labs } from '../src/content/labs'
import { projects } from '../src/content/projects'
import { services } from '../src/content/services'

const routes = [
  '/',
  '/work',
  '/lab',
  '/lab/studio',
  '/atlas',
  '/freelance',
  '/resume',
  ...projects.map((p) => `/work/${p.slug}`),
  ...labs.map((l) => `/lab/${l.slug}`),
  ...services.map((s) => `/services/${s.id}`),
]

function watchConsole(page: Page) {
  const problems: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(m.text())
  })
  page.on('pageerror', (e) => problems.push(e.message))
  return problems
}

const overflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

test.describe('every route', () => {
  for (const route of routes) {
    test(`${route} renders, has no console errors, overflow or a11y violations`, async ({
      page,
    }) => {
      const problems = watchConsole(page)
      await page.goto(route, { waitUntil: 'networkidle' })
      // Wait for the homepage hero lines to reveal; a no-op on other routes.
      await expect
        .poll(() =>
          page.evaluate(() =>
            [...document.querySelectorAll('.term-out')].every(
              (el) => getComputedStyle(el).visibility === 'visible'
            )
          )
        )
        .toBe(true)

      await expect(page.locator('h1')).toHaveCount(1)
      expect(await page.title()).toContain('Sushant Sonbarse')
      expect(await overflow(page), 'horizontal overflow in px').toBeLessThanOrEqual(0)

      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes[0].target}`)).toEqual([])
      expect(problems).toEqual([])
    })
  }
})

test.describe('responsive widths', () => {
  const widths = [320, 375, 430, 768, 1280, 1440, 1920, 2560]
  const key = [
    '/',
    '/work/azure-internal-access',
    '/work/aws-hosting-and-sso',
    '/lab/blast-radius',
    '/lab/studio',
    '/work/web-applications',
  ]
  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      test.slow()
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.setViewportSize({ width, height: 900 })
      for (const route of key) {
        await page.goto(route, { waitUntil: 'domcontentloaded' })
        await page.evaluate(() => document.fonts.ready)
        expect(await overflow(page), `${route} at ${width}px`).toBeLessThanOrEqual(0)
        if (route === '/') {
          const wordsFit = await page.locator('h1 span').evaluateAll((words) => {
            return words.every((word) => {
              const range = document.createRange()
              range.selectNodeContents(word)
              const text = range.getBoundingClientRect()
              const line = word.getBoundingClientRect()
              return range.getClientRects().length === 1 && text.right <= line.right
            })
          })
          expect(wordsFit, `name fits in the hero at ${width}px`).toBe(true)
        }
      }
    })
  }
})

test('all internal links resolve', async ({ page, request }) => {
  test.slow()
  const seen = new Set<string>()
  for (const route of routes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href')!.split('#')[0] || '/'))
    hrefs.forEach((href) => seen.add(href))
  }
  for (const href of seen) {
    const response = await request.get(href)
    expect(response.status(), href).toBe(200)
  }
})

test('main navigation and unknown routes', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Sushant')
  await page.getByRole('link', { name: 'See the work' }).click()
  await expect(page).toHaveURL(/#work$/)
  await page.getByRole('link', { name: 'All projects' }).click()
  await expect(page).toHaveURL(/\/work$/)
  await page
    .getByRole('link', { name: /Internal-only access for an enterprise Azure application/ })
    .first()
    .click()
  await expect(page).toHaveURL(/\/work\/azure-internal-access/)

  const response = await page.goto('/no-such-route')
  expect(response?.status()).toBe(404)
  await expect(page.locator('h1')).toContainText('No such route')
})

test('the editorial homepage shows career evidence and access to the résumé', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Available for remote freelance work')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Portrait of Sushant Sonbarse' })).toBeVisible()
  await expect(page.getByText(/CI\/CD pipeline efficiency improved by 40%/)).toBeVisible()
  await expect(page.locator('.stack-art, .pipeline, .failover-film')).toHaveCount(0)
  await page.getByRole('link', { name: 'View résumé' }).click()
  await expect(page).toHaveURL(/\/resume$/)
  await expect(page.getByRole('button', { name: 'Print or save PDF' })).toBeVisible()
})

test('the studio deployment diagram responds to the keyboard', async ({ page }) => {
  await page.goto('/lab/studio')
  await expect(page.getByRole('link', { name: /Fail a stage yourself/ })).toBeVisible()
  const build = page.getByRole('button', { name: 'Build', exact: true })
  await build.focus()
  await page.keyboard.press('Enter')
  await expect(build).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByText('Build an artifact', { exact: true })).toBeVisible()
})

test('studio domain selection and recovery simulator work', async ({ page }) => {
  await page.goto('/lab/studio')

  const observability = page.getByRole('button', { name: 'Observability', exact: true })
  await observability.click()
  await expect(observability).toHaveAttribute('aria-pressed', 'true')
  await expect(
    page.getByRole('link', { name: 'Prometheus and Grafana on Kubernetes' })
  ).toBeVisible()

  await page.getByRole('button', { name: 'Try the simulator' }).click()
  await page.getByRole('button', { name: 'DNS failure' }).click()
  await expect(page.getByRole('log')).toContainText('DNS failed')
  await page.getByRole('button', { name: 'Close simulator' }).click()
  await expect(page.getByRole('log')).toHaveCount(0)
})

test('desktop scrolling advances the pinned deployment sequence', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 })
  await page.goto('/lab/studio')
  const chapters = page.locator('.pipeline-chapter')
  const stages = page.getByRole('group', { name: 'Deployment stages' })

  await chapters.nth(1).evaluate((chapter) => chapter.scrollIntoView({ block: 'center' }))
  await expect(stages.getByRole('button', { name: 'Deploy' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await chapters.nth(2).evaluate((chapter) => chapter.scrollIntoView({ block: 'center' }))
  await expect(stages.getByRole('button', { name: 'Operate' })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await expect(page.getByText('Watch the rollout', { exact: true })).toBeVisible()
})

test('the failover film loads in view and pauses when requested or off-screen', async ({
  page,
}) => {
  await page.goto('/lab/studio')
  const film = page.locator('.failover-film')
  const video = film.locator('video')
  const paused = () => video.evaluate((media: HTMLVideoElement) => media.paused)

  await expect(video.locator('source')).toHaveCount(0)
  await film.scrollIntoViewIfNeeded()
  await expect
    .poll(() => video.evaluate((media: HTMLVideoElement) => media.currentTime))
    .toBeGreaterThan(0)

  await film.getByRole('button', { name: 'Pause motion' }).click()
  await expect.poll(paused).toBe(true)
  await film.getByRole('button', { name: 'Play motion' }).click()
  await expect.poll(paused).toBe(false)
  await page.locator('h1').scrollIntoViewIfNeeded()
  await expect.poll(paused).toBe(true)
})

test('reduced motion preserves the deployment controls and uses the film poster', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/lab/studio')
  const build = page.getByRole('button', { name: 'Build', exact: true })
  await build.click()
  await expect(build).toHaveAttribute('aria-pressed', 'true')

  const film = page.locator('.failover-film')
  await film.scrollIntoViewIfNeeded()
  await expect(film.locator('video source')).toHaveCount(0)
  await expect(film.locator('picture img')).toBeVisible()
})

test('the finder closes with Escape and opens the résumé by keyboard', async ({ page }) => {
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Find in portfolio' })
  await trigger.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(trigger).toBeFocused()

  await page.keyboard.press('Control+k')
  const search = page.getByRole('combobox', { name: 'Search the portfolio' })
  await search.fill('resume')
  await expect(page.getByRole('option', { name: /Résumé/ })).toBeVisible()
  await search.press('Enter')
  await expect(page).toHaveURL(/\/resume$/)
})

test('legacy homepage fragments and finder results reach the engineering studio', async ({
  page,
}) => {
  await page.goto('/#pipeline')
  await page.getByRole('link', { name: 'Release pipeline', exact: true }).click()
  await expect(page).toHaveURL(/\/lab\/studio#pipeline$/)
  await expect(page.locator('#pipeline')).toBeVisible()

  await page.getByRole('button', { name: 'Find in portfolio' }).click()
  const search = page.getByRole('combobox', { name: 'Search the portfolio' })
  await search.fill('failover')
  await page.getByRole('option', { name: /Reliability/ }).click()
  await expect(page).toHaveURL(/\/lab\/studio#break-it$/)
  await expect(page.getByRole('heading', { name: 'What breaks first?' })).toBeVisible()
})

test('the studio simulation models a scan block and two rollout outcomes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/lab/studio')
  await page.getByRole('button', { name: 'Simulate a deployment' }).click()
  const run = page.getByRole('region', { name: 'Deployment simulation' })
  const scenario = run.getByLabel('Scenario')
  const status = run.getByRole('status')

  await scenario.selectOption('cve')
  await run.getByRole('button', { name: 'Start simulation' }).click()
  await expect(status).toContainText('0%')
  await expect(run.getByText('Blocked', { exact: true })).toBeVisible()

  await scenario.selectOption('bad-release')
  await run.getByRole('button', { name: 'Start simulation' }).click()
  await expect(status).toContainText('5%')
  await expect(run.getByText('Rolled back', { exact: true })).toBeVisible()
  await run.getByLabel('Rollout strategy').selectOption('rolling')
  await run.getByRole('button', { name: 'Start simulation' }).click()
  await expect(status).toContainText('25%')
})

test('the desktop scene falls back to the same artwork when WebGL is disabled', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      value: function (this: HTMLCanvasElement, context: string, options?: unknown) {
        if (context === 'webgl2') return null
        return Reflect.apply(get, this, [context, options])
      },
    })
  })
  await page.goto('/lab/studio')
  await expect(page.locator('.stack-art picture img')).toBeVisible()
  await expect(page.locator('.stack-art')).toHaveAttribute('data-renderer', 'poster')
  await expect(page.getByRole('link', { name: 'Follow a deployment' })).toBeVisible()
})

test('case studies step through documented traffic with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/work/azure-internal-access')
  await page.getByRole('tab', { name: 'Traffic flow' }).click()
  await page.getByRole('button', { name: 'Next hop' }).click()
  await expect(page.getByRole('status')).toContainText('Route step 1')
  await page.getByRole('button', { name: 'Next hop' }).click()
  await expect(page.getByRole('status')).toContainText('Route step 2')
})

test('external links open safely', async ({ page }) => {
  await page.goto('/')
  const links = page.locator('a[href^="https://"]')
  expect(await links.count()).toBeGreaterThan(0)
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
})

test.describe('architecture explorer', () => {
  test('Azure: tabs, keyboard, node detail, steps and follow-up status', async ({ page }) => {
    await page.goto('/work/azure-internal-access')
    const tabs = page.getByRole('tab')
    await expect(tabs).toHaveCount(6)

    await page.getByRole('tab', { name: 'After' }).click()
    await expect(page.getByRole('button', { name: /^Internal Application Gateway/ })).toBeVisible()

    // The legacy edge is marked as follow-up, never as completed.
    const frontDoor = page.getByRole('button', { name: /^Azure Front Door.*follow-up/i })
    await expect(frontDoor).toBeVisible()
    await frontDoor.click()
    await expect(page.getByText('The legacy public entry point')).toBeVisible()

    // Roving tabindex: arrow keys move between tabs.
    await page.getByRole('tab', { name: 'After' }).focus()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByRole('tab', { name: 'Traffic flow' })).toHaveAttribute(
      'aria-selected',
      'true'
    )

    const step = page.getByRole('button', { name: /Corporate DNS resolves it/ })
    await step.click()
    await expect(step).toHaveAttribute('aria-pressed', 'true')

    await page.getByRole('tab', { name: 'Integration workflow' }).click()
    await expect(page.getByRole('button', { name: /^Workflow endpoint/ })).toBeVisible()
    await page.getByRole('button', { name: /Only this endpoint skips interactive sign-in/ }).click()
    await expect(page.getByText(/Only this endpoint skips interactive sign-in/)).toBeVisible()
  })

  test('Azure: the Private Endpoint note is a collapsible reference, not the solution', async ({
    page,
  }) => {
    await page.goto('/work/azure-internal-access')
    const note = page.getByText('Application Gateway and Private Endpoint: how they differ')
    await note.click()
    await expect(page.getByText(/Private Endpoint was evaluated and not selected/)).toBeVisible()
    await expect(page.getByText('Application Gateway, not Private Endpoint').first()).toBeVisible()
  })

  test('AWS: the application hosting view contains no S3 node', async ({ page }) => {
    await page.goto('/work/aws-hosting-and-sso')
    await page.getByRole('tab', { name: 'Application hosting' }).click()
    await expect(page.getByRole('button', { name: /^Elastic Beanstalk/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /S3/ })).toHaveCount(0)
    await page.getByRole('tab', { name: 'Static hosting' }).click()
    await expect(page.getByRole('button', { name: /^Private S3 bucket/ })).toBeVisible()
  })

  test('the overview-only project publishes an overview and no diagram', async ({ page }) => {
    await page.goto('/work/cloud-architecture-project')
    await expect(page.getByText('Overview only').first()).toBeVisible()
    const architecture = page.getByRole('region', { name: 'Architecture', exact: true })
    await expect(architecture).toBeVisible()
    await expect(architecture.getByRole('tablist')).toHaveCount(0)
    await expect(architecture.getByRole('group')).toHaveCount(0)
  })

  test('the implementation timeline marks environment steps and the follow-up', async ({
    page,
  }) => {
    await page.goto('/work/azure-internal-access')
    const timeline = page.locator('#implementation ol')
    await expect(timeline.getByText('Dev', { exact: true })).toBeVisible()
    await expect(timeline.getByText('UAT', { exact: true })).toBeVisible()
    await expect(timeline.getByText('Production', { exact: true }).first()).toBeVisible()
    await expect(timeline.getByText(/reviewed, follow-up remains/)).toHaveCount(1)
  })
})

test.describe('labs respond to interaction', () => {
  test('failure lab: scenario, dependency chain, event log, recovery, restore', async ({
    page,
  }) => {
    await page.goto('/lab/blast-radius', { waitUntil: 'networkidle' })
    const status = page.getByRole('status').first()
    const log = page.getByRole('log')

    await page.getByRole('button', { name: 'DNS failure' }).click()
    await expect(status).toContainText('Load the site: Down')
    await expect(status).toContainText('Read data: Down')
    await expect(log).toContainText('DNS failed')
    await expect(log).toContainText('Load the site: Healthy to Down')

    // Select the failed component: chain, recovery action and the recovery button.
    await page.getByRole('button', { name: /^DNS,/ }).click()
    await expect(page.getByText('Recovery action', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Apply recovery' }).first().click()
    await expect(status).toContainText('Load the site: Healthy')
    await expect(log).toContainText('DNS recovered')
  })

  test('failure lab: production survives zone loss, dev does not, and unavailable scenarios are disabled', async ({
    page,
  }) => {
    await page.goto('/lab/blast-radius', { waitUntil: 'networkidle' })
    const status = page.getByRole('status').first()

    await page.getByRole('button', { name: 'Zone A outage' }).click()
    await expect(status).toContainText('Write data: Degraded')

    await page.getByRole('button', { name: 'Dev, one zone' }).click()
    await expect(page.getByRole('button', { name: 'Cache lost' })).toBeDisabled()
    await page.getByRole('button', { name: 'Zone A outage' }).click()
    await expect(status).toContainText('Write data: Down')

    await page.getByRole('button', { name: 'Azure' }).click()
    await expect(page.getByRole('button', { name: /Front Door/ })).toBeVisible()
  })

  test('failure lab: keyboard selects, fails and recovers a component', async ({ page }) => {
    await page.goto('/lab/blast-radius', { waitUntil: 'networkidle' })
    const status = page.getByRole('status').first()
    const lb = page.getByRole('button', { name: /^Load balancer,/ })
    // The static export can show the diagram before its lazy client chunk is ready.
    await expect(async () => {
      await lb.press('Enter')
      await expect(lb).toHaveAttribute('aria-current', 'true', { timeout: 800 })
    }).toPass({ timeout: 10000 })
    // Selecting only inspects. It must not change health.
    await expect(status).toContainText('Read data: Healthy')
    await page.getByRole('button', { name: 'Fail this component' }).press('Enter')
    await expect(status).toContainText('Read data: Down')
    await page.getByRole('button', { name: 'Apply recovery' }).press('Enter')
    await expect(status).toContainText('Read data: Healthy')
  })

  test('release path: fault stops the run', async ({ page }) => {
    await page.goto('/lab/release-path', { waitUntil: 'networkidle' })
    await page.getByLabel('Critical CVE in a base image').check()
    await page.getByRole('button', { name: 'Run release' }).click()
    await expect(page.getByText('Users exposed to the bad build')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Failed', { exact: true })).toBeVisible()
    await expect(page.getByText('0%', { exact: true })).toBeVisible()
  })

  test('scheduler: load creates nodes, and pending appears without the autoscaler', async ({
    page,
  }) => {
    await page.goto('/lab/cluster', { waitUntil: 'networkidle' })
    const slider = page.getByRole('slider', { name: 'Web tier CPU demand' })
    const width = await slider.evaluate((input) => input.clientWidth)
    await slider.click({ position: { x: width - 12, y: 16 } })
    await expect(page.getByText(/added node-4/)).toBeVisible()
    await page.getByLabel(/Cluster Autoscaler/).uncheck()
    await expect(page.getByText(/Pending, no node can host/)).toBeVisible()
  })

  test('plan: prevent_destroy blocks a database replacement', async ({ page }) => {
    await page.goto('/lab/plan', { waitUntil: 'networkidle' })
    await page.getByLabel('Change the VPC CIDR block').check()
    await expect(page.getByLabel('Plan output')).toContainText('prevent_destroy')
    await page.getByLabel(/prevent_destroy/).uncheck()
    await expect(page.getByLabel('Plan output')).toContainText('aws_db_instance.main')
    await expect(page.getByLabel('Plan output')).toContainText('to destroy')
  })

  test('error budget: severe incident pages, small one does not', async ({ page }) => {
    await page.goto('/lab/error-budget', { waitUntil: 'networkidle' })
    await page.getByLabel('Error rate during incident').fill('9')
    await expect(page.getByText('Wake someone up.')).toBeVisible()
    await page.getByLabel('Error rate during incident').fill('0')
    await page.getByLabel('Incident duration').fill('0')
    await expect(page.getByText(/No alert/)).toBeVisible()
  })

  test('access trace: explicit deny wins', async ({ page }) => {
    await page.goto('/lab/access-trace', { waitUntil: 'networkidle' })
    await expect(page.getByText('Allow', { exact: true })).toBeVisible()
    await page.getByLabel('A policy has a matching Deny').check()
    await expect(page.getByText('Deny', { exact: true })).toBeVisible()
    await expect(page.getByText(/Stopped at Explicit deny/)).toBeVisible()
  })
})

test('contact form validates required fields and reports failure honestly', async ({ page }) => {
  await page.route('https://api.emailjs.com/**', (route) =>
    route.fulfill({ status: 500, body: 'no' })
  )
  await page.goto('/#contact')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByText('That did not send')).not.toBeVisible()

  await page.getByLabel('Name').fill('Test')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('What are you working on?').fill('A test message')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByText('That did not send')).toBeVisible()
})
