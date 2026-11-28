import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

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
