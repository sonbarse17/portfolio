import { expect, test } from '@playwright/test'

test('the SAML request and response follow opposite directions without motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/work/aws-hosting-and-sso')
  await page.getByRole('tab', { name: 'Authentication' }).click()

  const panel = page.getByRole('tabpanel')
  const outbound = panel.getByRole('button', { name: /Cognito federates to/ })
  await outbound.focus()
  await page.keyboard.press('Enter')
  await expect(outbound).toHaveAttribute('aria-pressed', 'true')
  const directions = panel.getByRole('list', { name: 'Connections in this hop' })
  await expect(directions).toContainText(/Amazon Cognito.*Microsoft Entra ID/)

  await panel.getByRole('button', { name: 'Next hop' }).click()
  await expect(directions).toContainText(/Microsoft Entra ID.*Amazon Cognito/)
  await expect(panel.getByRole('status')).toContainText('Route step 4 of 5')
  await expect(panel.getByRole('button', { name: 'Play route' })).toBeHidden()

  await panel.getByRole('button', { name: 'Reset' }).click()
  await expect(directions).toHaveCount(0)
  await panel.getByRole('button', { name: /^Amazon Cognito,/ }).click()
  await expect(panel.getByRole('heading', { name: 'Amazon Cognito' })).toBeVisible()
})
