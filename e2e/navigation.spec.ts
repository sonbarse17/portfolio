import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { labs } from '../src/content/labs'
import { projects } from '../src/content/projects'
import { services } from '../src/content/services'

const routes = [
  '/',
  '/work',
  '/lab',
  '/atlas',
  '/freelance',
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
  const widths = [375, 430, 768, 1280, 1440]
  const key = [
    '/',
    '/work/azure-internal-access',
    '/work/aws-hosting-and-sso',
    '/lab/blast-radius',
    '/work/web-applications',
  ]
  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      for (const route of key) {
        await page.goto(route, { waitUntil: 'networkidle' })
        expect(await overflow(page), `${route} at ${width}px`).toBeLessThanOrEqual(0)
      }
    })
  }
})

test('all internal links resolve', async ({ page, request }) => {
  const seen = new Set<string>()
  for (const route of routes) {
    await page.goto(route)
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

test('home shows the opening message, availability and the path strip', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/path from a commit to production/)).toBeVisible()
  await expect(page.getByText('Available', { exact: false }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /Fail a stage yourself/ })).toBeVisible()
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

test('theme toggle switches and persists', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/atlas')
  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test.describe('architecture explorer', () => {
  test('Azure: tabs, keyboard, node detail, steps and follow-up status', async ({ page }) => {
    await page.goto('/work/azure-internal-access')
    const tabs = page.getByRole('tab')
    await expect(tabs).toHaveCount(6)

    await page.getByRole('tab', { name: 'After' }).click()
    await expect(page.getByRole('button', { name: /^Internal Application Gateway/ })).toBeVisible()

    // The legacy edge is marked as follow-up, never as completed.
    const frontDoor = page.getByRole('button', { name: /^Azure Front Door.*follow-up/ })
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
    await expect(page.getByRole('tablist')).toHaveCount(0)
    await expect(page.getByRole('group')).toHaveCount(0)
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
    await lb.focus()
    await page.keyboard.press('Enter')
    // Selecting only inspects. It must not change health.
    await expect(status).toContainText('Read data: Healthy')
    await page.getByRole('button', { name: 'Fail this component' }).focus()
    await page.keyboard.press('Enter')
    await expect(status).toContainText('Read data: Down')
    await page.getByRole('button', { name: 'Apply recovery' }).focus()
    await page.keyboard.press('Enter')
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
    await page.getByLabel('Web tier CPU demand').fill('5000')
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
