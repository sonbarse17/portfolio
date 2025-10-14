import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Sushant Sonbarse')
  })

  test('should navigate to freelance page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=View Services')
    await expect(page).toHaveURL('/freelance')
    await expect(page.locator('h2')).toContainText('What I Offer')
  })

  test('should navigate to service detail page', async ({ page }) => {
    await page.goto('/freelance')
    const firstLink = page.locator('text=Learn More').first()
    await firstLink.click()
    await expect(page).toHaveURL(/\/services\//)
  })

  test('should scroll to sections', async ({ page }) => {
    await page.goto('/')

    await page.click('text=View My Work')
    await page.waitForTimeout(1000)
    const projectsSection = page.locator('#projects')
    await expect(projectsSection).toBeInViewport()
  })

  test('should validate external links', async ({ page }) => {
    await page.goto('/')

    const githubLink = page.locator('a[href*="github.com"]').first()
    await expect(githubLink).toHaveAttribute('target', '_blank')
    await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
