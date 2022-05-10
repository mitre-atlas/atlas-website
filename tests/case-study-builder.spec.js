const { test, expect } = require('@playwright/test')
const { TIMEOUT_MS } = require('./config.js')

test.describe('Case study builder', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/studies/create')
    await page.waitForTimeout(TIMEOUT_MS);
  })

  test('minimal successful case study form', async ({ page }) => {
    // Details
    await page.fill('id=titleInput', 'Playwright Test')
    await page.fill('id=reporterInput', 'Roboto')
    // Incident date
    await page.click('[readonly="readonly"]') // better date test.
    await page.click('li >> text=2021') //check date field in case study if clicked one level
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

  test('reference source fill widget', async ({ page }) => {
    // ToggleableSource is the component rendering the source data
    const sources = page.locator('.toggleable_source')
    await expect(sources).toHaveCount(0) // Starts empty

    // Add source
    await page.click('button >> text=Add New Source')
    await page.fill('input:below(:has-text("Source"))', 'Reference 1')
    await page.fill('text=URL', 'https://www.mitre.org')
    await page.click('id=save_reference')
    await expect(sources).toHaveCount(1) // Additional item
    await page.waitForTimeout(TIMEOUT_MS);

    // Edit source
    await page.click('.mdi-pencil:below(:has-text("References"))')
    await page.fill('input:below(:has-text("Source"))', 'Reference 1 (edited)')
    await page.click('id=save_reference')
    await page.waitForTimeout(TIMEOUT_MS);

    // Deleted source
    await page.click('.mdi-delete:below(:has-text("References"))')
    await page.click('button:has-text("Delete"):below(:has-text("Delete reference?"))')
    await expect(sources).toHaveCount(0) // Item has been deleted
    await page.waitForTimeout(TIMEOUT_MS)
  })
})
