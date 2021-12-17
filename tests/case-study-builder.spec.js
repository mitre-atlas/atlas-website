const { test, expect } = require('@playwright/test');

TIMEOUT_MS = 1500

test.describe('Case study builder', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/studies/create')
    await page.waitForTimeout(TIMEOUT_MS);
  })

  test('minimal successful form fill', async ({ page }) => {
    // Details
    await page.fill('id=titleInput', 'Playwright Test')
    await page.fill('id=emailInput', 'test@mitre.org')
    await page.fill('id=reporterInput', 'Roboto')
    // Incident date
    await page.click('[readonly="readonly"]')
    await page.click('li >> text=2021')
    await page.click('button >> text=OK')
    // Summary
    await page.fill('id=summaryInput', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')

    // Procedure

    // Select tactic
    await page.click('id=tactic_selection')
    await page.click('div :text("Reconnaissance")')
    // Select technique
    await page.click('id=technique_selection')
    await page.click('div :text("Search for Victim\'s Publicly Available Research Materials")')
    // Description
    await page.fill('id=procedure_description', 'One')
    // Save
    await page.click('button:has-text("Save")')

    // Click download button
    await page.click('id=download_case_study_button')

    await page.waitForTimeout(TIMEOUT_MS);
  })

  test('source widget', async ({ page }) => {
    // By default, there is 1 div here, the "Add Source" button
    const itemsBelowReferences = page.locator('.v-card__text:below(:has-text("References")) > div')
    await expect(itemsBelowReferences).toHaveCount(1) // the "Add Source div"

    // Add source
    await page.click('button >> text=Add New Source')
    await page.fill('input:below(:has-text("Add Source"))', 'Reference 1')
    await page.fill('text=URL', 'www.mitre.org')
    await page.click('button :text("Save"):below(:has-text("Add Source"))')
    await expect(itemsBelowReferences).toHaveCount(2) // Additional item
    await page.waitForTimeout(TIMEOUT_MS);

    // Edit source
    await page.click('.mdi-pencil:below(:has-text("References"))')
    await page.fill('input:below(:has-text("Source 1"))', 'Reference 1 (edited)')
    await page.click('button :text("Save"):below(:has-text("Source 1"))')
    await page.waitForTimeout(TIMEOUT_MS);

    await page.click('.mdi-delete:below(:has-text("References"))')
    await page.click('button:has-text("Delete"):below(:has-text("Delete reference?"))')
    await expect(itemsBelowReferences).toHaveCount(1) // Item has been deleted
    await page.waitForTimeout(TIMEOUT_MS)
  })
})
