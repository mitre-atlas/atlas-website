const { test, expect } = require('@playwright/test')
const { TIMEOUT_MS } = require('./config.js')

module.exports.fillFieldsMinimum =  async function(page) {
    // Details
    await page.fill('id=titleInput', 'Playwright Test')
    await page.fill('id=targetInput', 'Roboto')
    await page.fill('id=actorInput', 'Roboto')

    await page.click(':text("Incident") >> nth=0')
    await page.fill('id=reporterInput', 'Roboto')
  
    // Incident date
    await page.click('[readonly="readonly"]') // better date test.
    await page.click('li >> text=2021') //check date field in case study if clicked one level
    await module.exports.clickSaveButton(page, 1)
  
    // Summary
    await page.fill('id=summaryInput', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')

    // File name
    await page.fill(':text("Case study filename")', 'file name')
}

module.exports.addFirstProcedure = async function(page, tactic, technique, description) {
    // Add a procedure
    // const procedure = pickProcedure()
    // Select tactic
    await page.click('id=tactic_selection')
    await page.click('div :text("' + tactic + '")')
    // Select technique
    await page.click('id=technique_selection')
    await page.click('div :text("' + technique + '")')
    // Description
    await page.fill('id=procedure_description', description)
    // Save
    await module.exports.clickSaveButton(page)
}
module.exports.addProcedure = async function(page, tactic, technique, description) {
    await page.click(':text("Add New Step")')

    // const procedure = pickProcedure()
    // Select tactic
    await page.click('id=tactic_selection')
    await page.click('div :text("' + tactic + '")')
    // Select technique
    await page.click('id=technique_selection')
    await page.click('div :text("' + technique + '")')
    // Description
    await page.fill('id=procedure_description', description)
    // Save
    await module.exports.clickSaveButton(page)
}
  
module.exports.editProcedure = async function (page, tactic, technique, index, description=null) {
    await page.click('.mdi-pencil >> nth=' + index)
    await page.click('id=tactic_selection')
    await page.click('div :text("' + tactic + '")')
    await page.click('id=technique_selection')
    await page.click('div :text("' + technique + '")')
    if (description) {
        await page.fill('id=procedure_description', description)
    }
    await page.click('id=save_procedure_button')
}

module.exports.deleteProcedure = async function (page, index) {
    await page.click('.mdi-delete >> nth=' + index)
    await page.locator(':nth-match(:text("Delete"), 2)').click()
}

module.exports.addSource = async function (page, description, url, index) {
    await page.click(':text("Add New Source")')
    await page.fill('input:below(:has-text("Source ' + index + '"))', description)
    await page.fill('text=URL', url)
    await module.exports.clickSaveButton(page)
}

module.exports.addSourceDescription = async function (page, description, index) {
    await page.fill('input:below(:has-text("Source ' + index + '"))', description)
}

module.exports.deleteSource = async function (page, index = 0) {
    await page.click('.mdi-delete:below(:has-text("References")) >> nth=' + index)
    await page.click(':text("Delete") >> nth=1')
}

module.exports.clickText = async function (page, text) {
    await page.click(':text("' + text + '")')
}

module.exports.clickCancelButton = async function (page, index = 0) {
    await page.click('button:has-text("Cancel") >> nth=' + index)
}

module.exports.clickSaveButton = async function (page, index = 0) {
    await page.click('button:has-text("Save") >> nth=' + index)
}

module.exports.verifyError = async function (page, error) {
    await page.locator(':text("' + error + '")')
}

module.exports.verifyNoError = async function (page, error) {
    await expect(page.locator(':text("' + error + '")')).toHaveCount(0)
}

module.exports.verifyUnsavedWarning = async function (page) {
    await page.click('id=download_case_study_button')
    await module.exports.verifyError(page, 'You have unsaved changes.')
    await page.click('button >> text=Return')
}

module.exports.checkProcedure = async function (page, tactic, technique, description, count=1) {
    await module.exports.checkText(page, tactic, count)
    await module.exports.checkText(page, technique, count)
    await module.exports.checkText(page, description, count)
}

module.exports.checkText = async function (page, text, count=1) {
    await expect(page.locator(':text("' + text + '")')).toHaveCount(count)
}

module.exports.checkIsDisabled = async function (page, id) {
    // await expect(page.locator('id=' + id, { has: page.locator('[disabled="disabled"]') })).toHaveCount(0)
    await expect(page.locator('id=' + id)).toBeDisabled()
}
