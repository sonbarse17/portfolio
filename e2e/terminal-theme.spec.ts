import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function openCommandLine(page: Page) {
  const input = page.getByRole('combobox', { name: 'Search the portfolio' })
  // Keystrokes before hydration are dropped harmlessly; retry until the listener is live.
  await expect(async () => {
    await page.keyboard.press(':')
    await expect(input).toBeVisible({ timeout: 500 })
  }).toPass({ timeout: 10_000 })
  await expect(input).toHaveValue(':')
  return input
}

test.describe('palette picker', () => {
  test('switches palettes and persists across reload', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'blackmoney')
    await page.getByRole('button', { name: 'Change palette' }).click()
    await page.getByRole('radio', { name: /^Paper/ }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(axe.violations.map((violation) => violation.id)).toEqual([])
  })

  test('is a keyboard radio group', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'Change palette' })
    await trigger.click()
    const group = page.getByRole('radiogroup', { name: 'Palette' })
    await expect(group.getByRole('radio', { name: /^Blackmoney/ })).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
    await expect(group.getByRole('radio', { name: /^Paper/ })).toBeFocused()
    await expect(group.getByRole('radio', { name: /^Paper/ })).toHaveAttribute(
      'aria-checked',
      'true'
    )
    await page.keyboard.press('Escape')
    await expect(group).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('has no axe violations while open and closes on Tab', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Change palette' }).click()
    const group = page.getByRole('radiogroup', { name: 'Palette' })
    await expect(group).toBeVisible()
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(axe.violations.map((violation) => violation.id)).toEqual([])
    await page.keyboard.press('Tab')
    await expect(group).toBeHidden()
  })
})

test.describe('command line', () => {
  test(':theme switches the palette and closes', async ({ page }) => {
    await page.goto('/work')
    await openCommandLine(page)
    await page.keyboard.type('theme sora')
    await page.keyboard.press('Enter')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'sora')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('unknown palettes and commands explain themselves', async ({ page }) => {
    await page.goto('/work')
    const input = await openCommandLine(page)
    await page.keyboard.type('theme nope')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('status')).toContainText("No palette 'nope'")
    await input.fill(':deploy')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('status')).toContainText('Unknown command')
  })

  test(':resume navigates', async ({ page }) => {
    await page.goto('/work')
    await openCommandLine(page)
    await page.keyboard.type('resume')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/resume$/)
  })

  test(': types normally inside form fields', async ({ page }) => {
    await page.goto('/')
    const name = page.getByLabel('Name', { exact: true })
    await name.fill('a')
    await name.press(':')
    await expect(name).toHaveValue('a:')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
})
