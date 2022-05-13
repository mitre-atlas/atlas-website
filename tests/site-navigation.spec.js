const { test } = require('@playwright/test')
const { TIMEOUT_MS } = require('./config.js')

test.describe('ATLAS required routes test', () => {
  test('Visit pages', async ({ page }) => {
    await page.goto('/matrix')
    await page.waitForTimeout(TIMEOUT_MS);
    await page.goto('/tactics')
    await page.waitForTimeout(TIMEOUT_MS);
    await page.goto('/techniques')
    await page.waitForTimeout(TIMEOUT_MS);
  })
})