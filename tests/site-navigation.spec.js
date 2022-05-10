const { test, expect } = require('@playwright/test')
const { TIMEOUT_MS } = require('./config.js')

test.describe('Case studies list page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/studies')
    await page.waitForTimeout(TIMEOUT_MS);
  })

  test('Click side menu links', async ({ page }) => {
    await page.click('id=CaseStudy0')
    await page.click('id=CaseStudy1')
    await page.click('id=CaseStudy2')
    await page.click('id=CaseStudy3')
    await page.click('id=CaseStudy4')
    await page.click('id=CaseStudy5')
    await page.click('id=CaseStudy6')
    await page.click('id=CaseStudy7')
    await page.click('id=CaseStudy8')
    await page.click('id=CaseStudy9')
    await page.click('id=CaseStudy10')
    await page.click('id=CaseStudy11')
    await page.click('id=CaseStudy12')
    await page.click('id=CaseStudy13')
    await page.click('id=CaseStudy14')
  })
})

test.describe('Atlas routes test', () => {
  test('Visit pages', async ({ page }) => {
    await page.goto('/matrix')
    await page.waitForTimeout(TIMEOUT_MS);
    await page.goto('/tactics')
    await page.waitForTimeout(TIMEOUT_MS);
    await page.goto('/techniques')
    await page.waitForTimeout(TIMEOUT_MS);
  })
})