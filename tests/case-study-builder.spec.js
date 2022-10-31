const { test, expect } = require('@playwright/test')
const { TIMEOUT_MS } = require('./config.js')
const { 
  fillFieldsMinimum, 
  addFirstProcedure,
  addProcedure, 
  editProcedure, 
  addSource,
  addSourceDescription,
  deleteProcedure,
  verifyError,
  verifyNoError,
  verifyUnsavedWarning,
  clickCancelButton,
  clickSaveButton,
  deleteSource,
  checkIsDisabled,
  checkText,
  checkProcedure
} = require('./test-helper-functions.js')

test.describe('Case study builder', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/studies/create')
    await page.waitForTimeout(TIMEOUT_MS);
  })

  test('minimal successful case study form', async ({ page }) => {
    // Details
    // add selection for case study type
    await page.fill('id=titleInput', 'Playwright Test')
    await page.fill('id=targetInput', 'target field test')
    await page.fill('id=actorInput', 'actor field test')

    await page.click(':text("Incident") >> nth=0')
    await page.fill('id=reporterInput', 'reporter field test')

    // Incident date
    await page.click('[readonly="readonly"]') // better date test.
    await page.click('li >> text=2021') //check date field in case study if clicked one level
    await clickSaveButton(page)

    // Summary
    await page.fill('id=summaryInput', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')

    // Add procedures
    await addFirstProcedure(page, 'Reconnaissance', 'Search for Victim\'s Publicly Available Research Materials', 'One')
    await addProcedure(page, 'Resource Development', 'Acquire Public ML Artifacts', 'Two')

    // Pick file name
    await page.fill(':text("Case study filename")', 'Playwright Test Filename')

    // Click download button
    await page.click('id=download_case_study_button')
  })

  test('case study type', async ({ page }) => {
    // Check if reporter is disabled before anything is selected
    await checkIsDisabled(page, 'reporterInput')

    // Select 'exercise' and check if reporter is disabled
    await page.click(':text("Exercise") >> nth=0')
    await checkIsDisabled(page, 'reporterInput')

    // Select 'incident' and check if reporter is disabled
    await page.click(':text("Incident") >> nth=0')
    // make sure reporter is available
    await page.fill('id=reporterInput', 'reporter field test')
  })

  test('incident date', async ({ page }) => {
    // Incident date
    // Year only
    await page.click('[readonly="readonly"]') // better date test.
    await page.click('li >> text=2021') //check date field in case study if clicked one level
    await clickSaveButton(page, 1)

    // Year & month
    await page.click('[readonly="readonly"]') // better date test.
    await page.click('li >> text=2020')
    await page.click('button >> text=NOV')
    await clickSaveButton(page, 1)

    // Year, month, & day
    await page.click('[readonly="readonly"]') // better date test.
    await page.click('li >> text=2019')
    await page.click('button >> text=DEC')
    await page.click('button >> text=17')
    await clickSaveButton(page, 1)
  })

  test('procedure features', async ({ page }) => {
    // Add procedures
    await addFirstProcedure(page, 'Reconnaissance', 'Search for Victim\'s Publicly Available Research Materials', 'One')
    await addProcedure(page, 'Resource Development', 'Acquire Public ML Artifacts', 'Two')
    await addProcedure(page, 'ML Model Access', 'Physical Environment Access', 'Three')

    // Reorder procedures
    await page.locator('.mdi-arrow-up-down >> nth=1').click()
    await page.dragAndDrop('.mdi-arrow-up-down >> nth=2', '.mdi-arrow-up-down >> nth=1')
    // second and third cards should be swapped now - verify this
    await expect(page.locator(':text("Resource Development"):below(:text("ML Model Access"))')).toHaveCount(1)
    await page.dragAndDrop('.mdi-arrow-up-down >> nth=0', '.mdi-arrow-up-down >> nth=1')
    // first and second cards should be swapped now - verify this
    await expect(page.locator(':text("Reconnaissance"):below(:text("ML Model Access"))')).toHaveCount(1)

    // Edit a procedure
    await editProcedure(page, 'Initial Access', 'Valid Accounts', 0)

    // When you edit, it doesn't let you change the tactic without changing the technique
    await page.click('.mdi-pencil >> nth=0')
    await page.click('id=tactic_selection')
    await page.click('div :text("Persistence")')
    await page.click('id=save_procedure_button')
    await verifyError(page, 'Please complete all fields')
    await clickCancelButton(page)

    // Delete a procedure
    await deleteProcedure(page, 1)
    await checkText(page, 'Reconnaissance', 0) // check if it's gone
  })

  test('reference source fill widget', async ({ page }) => {
    // ToggleableSource is the component rendering the source data
    const sources = page.locator('.toggleable_source')
    await expect(sources).toHaveCount(0) // Starts empty

    // Add source
    await page.click('button >> text=Add New Source')
    await page.fill('input:below(:has-text("Source 1"))', 'Reference 1')
    await page.fill('text=URL', 'https://www.mitre.org')
    await page.click('id=save_reference')
    await expect(sources).toHaveCount(1) // Additional item

    // Edit source
    await page.click('.mdi-pencil:below(:has-text("References"))')
    await page.fill('input:below(:has-text("Source 1"))', 'Reference 1 (edited)')
    await page.click('id=save_reference')

    // Deleted source
    await deleteSource(page)
    await expect(sources).toHaveCount(0) // Item has been deleted

    // Add, edit & delete multiple sources at once
    // Add source 1
    await page.click('button >> text=Add New Source')
    await page.fill('input:below(:has-text("Source 1"))', 'Reference 1')
    await page.fill('text=URL', 'https://www.mitre.org')
    await page.click('id=save_reference')
    await expect(sources).toHaveCount(1) // Additional item

    // Add source 2
    await page.click('button >> text=Add New Source')
    await page.fill('input:below(:has-text("Source 2"))', 'Reference 2')
    await page.fill('text=URL', 'https://www.mitre.org')
    await page.click('id=save_reference')
    await expect(sources).toHaveCount(2) // Additional item

    // Add source 3
    await page.click('button >> text=Add New Source')
    await page.fill('input:below(:has-text("Source 3"))', 'Reference 3')
    await page.fill('text=URL', 'https://www.mitre.org')
    await page.click('id=save_reference')
    await expect(sources).toHaveCount(3) // Additional item

    // Edit source 1
    await page.click('.mdi-pencil:below(:has-text("References"))')
    await page.fill('input:below(:has-text("Source 1"))', 'Reference 1 (edited)')
    await page.click('id=save_reference')

    // Deleted source
    await deleteSource(page)
    await expect(sources).toHaveCount(2) // Item has been deleted
  })

  test('save and cancel buttons', async({ page }) => {
    // PROCEDURE CARDS
    await addFirstProcedure(page, 'Reconnaissance', 'Search for Victim\'s Publicly Available Research Materials', 'original description')
    await checkProcedure(page, 'Reconnaissance', 'Search for Victim\'s Publicly Available Research Materials', 'original description')

    // Save overwrites old data
    await editProcedure(page, 'Initial Access', 'Valid Accounts', 0, 'description (edited)')
    await checkProcedure(page, 'Initial Access', 'Valid Accounts', 'description (edited)')
    await checkProcedure(page, 'Reconnaissance', 'Search for Victim\'s Publicly Available Research Materials', 'original description', 0)

    // Cancel doesn't overwrite old data
    await page.click('.mdi-pencil')
    await page.click('id=tactic_selection')
    await page.click('div :text("Resource Development")')
    await page.click('id=technique_selection')
    await page.click('div :text("Acquire Public ML Artifacts")')
    await page.fill('id=procedure_description', 'canceled edited description')
    await clickCancelButton(page)
    await checkProcedure(page, 'Initial Access', 'Valid Accounts', 'description (edited)')
    await checkProcedure(page, 'Resource Development', 'Acquire Public ML Artifacts', 'canceled edited description', 0)

    // REFERENCES
    // Initial data
    await page.click('button >> text=Add New Source')
    await page.fill('input:below(:has-text("Source 1"))', 'Reference 1')
    await page.fill('text=URL', 'https://www.mitre.org')
    await page.click('id=save_reference')
    await checkText(page, 'Reference 1')

    // Cancel doesn't overwrite old data
    await page.click('.mdi-pencil:below(:has-text("References"))')
    await page.fill('input:below(:has-text("Source 1"))', 'Reference 1 (edited)')
    await clickCancelButton(page)
    await checkText(page, 'Reference 1')
    await checkText(page, 'Reference 1 (edited)', 0)

    // Save overwrites old data
    await page.click('.mdi-pencil:below(:has-text("References"))')
    await page.fill('input:below(:has-text("Source 1"))', 'Reference 1 (edited)')
    await clickSaveButton(page)
    await checkText(page, 'Reference 1 (edited)')
  })

  test('unsaved changes warnings', async ({ page }) => {
    await fillFieldsMinimum(page)
    
    // UNSAVED PROCEDURES
    // Add one procedure, edit it, and don't save
    await addFirstProcedure(page, 'Reconnaissance', 'Search for Victim\'s Publicly Available Research Materials', 'One')    
    await page.click('.mdi-pencil')
    await page.click('id=tactic_selection')
    await page.click('div :text("Resource Development")')
    await page.click('id=technique_selection')
    await page.click('div :text("Acquire Public ML Artifacts")')
    await page.fill('id=procedure_description', 'two')
    await verifyUnsavedWarning(page)
    // save Changes
    await page.click('id=save_procedure_button')

    // Add several procdures, then add new one, don't select anything, and don't save
    await addProcedure(page, 'Initial Access', 'ML Supply Chain Compromise', 'three')
    await addProcedure(page, 'ML Model Access', 'Physical Environment Access', 'four')
    await addProcedure(page, 'Execution', 'User Execution', 'five')
    await page.click(':text("Add New Step")')
    await verifyUnsavedWarning(page)

    // Add several procedures, then add new one, fill it out, and don't save
    await page.click('id=tactic_selection')
    await page.click('div :text("Persistence")')
    await page.click('id=technique_selection')
    await page.click('div :text("Poison Training Data")')
    await page.fill('id=procedure_description', 'six')
    await verifyUnsavedWarning(page)
    await clickSaveButton(page)

    // Add several procedures, open one to edit, don't make changes, and don't save
    await page.click('.mdi-pencil >> nth=3')
    await verifyUnsavedWarning(page)

    // Add several procedures, then edit one, make changes and don't save
    await page.click('id=tactic_selection')
    await page.click('div :text("Reconnaissance")')
    await page.click('id=technique_selection')
    await page.click('div :text("Technical Blogs")')
    await verifyUnsavedWarning(page)

    // Add several procedures, then edit multiple ones and don't save
    await page.click('.mdi-pencil >> nth=1')
    await page.click('id=technique_selection')
    await page.click('div :text("GPU Hardware")')
    await verifyUnsavedWarning(page)
    // save changes
    await page.click('id=save_procedure_button >> nth=0')
    await page.click('id=save_procedure_button')

    // Add several procedures, open one for editing, and add a new one, and don't save either
    await page.click('.mdi-pencil >> nth=1')
    await page.click(':text("Add New Step")')
    await verifyUnsavedWarning(page)
    // save changes
    await page.click('id=save_procedure_button >> nth=0')
    await page.click('button:has-text("Cancel")') // close unedited add new box

    // UNSAVED SOURCES
    // first added source is unsaved
    await page.click('button >> text=Add New Source')
    await verifyUnsavedWarning(page)

    // Add one source, edit it, and don't save
    await addSourceDescription(page, 'source 1', 1)
    // await page.fill('input:below(:has-text("Source 1"))', 'source 1')
    await verifyUnsavedWarning(page)
    await clickSaveButton(page)

    // Add several sources, then add one, don't fill it out, and don't save
    await addSource(page, 'source 2', '', 2)
    await addSource(page, 'source 3', '', 3)
    await page.click('button >> text=Add New Source')
    await verifyUnsavedWarning(page)

    // Add several sources, then add one, fill it out, and don't save
    await page.fill('input:below(:has-text("Source 4"))', 'source 4')
    await verifyUnsavedWarning(page)
    await clickSaveButton(page)

    // Add several sources, then edit one and don't save
    await page.click('.mdi-pencil:below(:has-text("References"))')
    await page.fill('input:below(:has-text("Source 1"))', 'Source 1 (edited)')
    await verifyUnsavedWarning(page)

    // Add several sources, then edit multiple ones and don't save
    await page.click('.mdi-pencil:below(:has-text("References"))')
    await page.fill('input:below(:has-text("Source 2"))', 'Source 2 (edited)')
    await verifyUnsavedWarning(page)

    // Add several sources, then edit one, and a new one, and don't save either
    await clickSaveButton(page) // save one of open sources
    await page.click('button >> text=Add New Source')
    await page.fill('input:below(:has-text("Source 5"))', 'source 5')
    await verifyUnsavedWarning(page)
    await clickSaveButton(page)
    await clickSaveButton(page)

    // Incident date unsaved changes
    // Open picker, select something, and don't save
    await page.click('[readonly="readonly"]')
    await page.click('li >> text=2019')
    await page.click('button >> text=DEC')
    await page.click('button >> text=17')
    await verifyUnsavedWarning(page)

    // Open picker, save, then edit and don't save
    await clickSaveButton(page)
    await page.click('[readonly="readonly"]')
    await page.click('li >> text=2020')
    await page.click('button >> text=OCT')
    await page.click('button >> text=12')
    await verifyUnsavedWarning(page)
    await clickSaveButton(page)
    // download & verify no error
    await page.click('id=download_case_study_button')
  })

  test('missing fields errors', async({ page }) => {
    const requiredErrors = page.locator(':text("Required")')
    await expect(requiredErrors).toHaveCount(1)

    // Try to download without filling anything out; make sure all fields are flagged
    await page.click('id=download_case_study_button')

    // check for errors - there should be nine fields saying 'required', including the 
    // disabled reporter field and the word "required" in "All fields required" at the top of the page
    await expect(requiredErrors).toHaveCount(9)

    // Now fill out all the fields and make sure the errors disappear
    await page.fill('id=titleInput', 'Playwright Test')
    await expect(requiredErrors).toHaveCount(8)

    await page.fill('id=targetInput', 'Roboto')
    await expect(requiredErrors).toHaveCount(7)
    await page.fill('id=actorInput', 'Roboto')
    await expect(requiredErrors).toHaveCount(6)

    // Incident date
    await page.click('[readonly="readonly"]') // better date test.
    await page.click('li >> text=2021') //check date field in case study if clicked one level
    await clickSaveButton(page, 1)
    await expect(requiredErrors).toHaveCount(5)
    await expect(page.locator(':text("Date not selected")')).toHaveCount(0) // make sure date picker closed

    // Summary
    await page.fill('id=summaryInput', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
    await expect(requiredErrors).toHaveCount(4)

    // Try to save a procedure with incomplete data
    // All fields empty - procedure card is already open
    await clickSaveButton(page)
    await verifyError(page, 'Please complete all fields')
    // check for error

    // Select tactic
    await page.click('id=tactic_selection')
    await page.click('div :text("ML Model Access")')
    await clickSaveButton(page)
    await verifyError(page, 'Please complete all fields')
    // check for error

    // Select technique
    await page.click('id=technique_selection')
    await page.click('div :text("Physical Environment Access")')
    await clickSaveButton(page)
    await verifyNoError(page, 'Please complete all fields') // description isn't required
    await expect(requiredErrors).toHaveCount(3)

    // check if appropriate error behavior occurs with case study type & reporter interaction
    // Select 'exercise' - error styling for both fields should disappear, and reporter should be disabled
    await page.click(':text("Exercise") >> nth=0')
    await expect(requiredErrors).toHaveCount(2)
    await checkIsDisabled(page, 'reporterInput')

    // Now select 'incident' - error styling should disappear from case study type, 
    // but reappear on reporter until it's filled out
    await page.click(':text("Incident") >> nth=0')
    // make sure reporter is required again
    await expect(requiredErrors).toHaveCount(3)
    await page.fill('id=reporterInput', 'Roboto')
    await expect(requiredErrors).toHaveCount(2)

    // Sources
    // don't fill out any fields
    await page.click(':text("Add New Source")')
    await clickSaveButton(page)
    await verifyError(page, 'Please complete at least one field')

    // invalid URL
    await page.fill(':text("URL")', 'invalid url')
    await clickSaveButton(page)
    await verifyError(page, 'URL cannot be found or does not start with http(s)://')
    await clickCancelButton(page)
    await page.click(':text("Add New Source")')
    await page.fill(':text("URL")', 'https://www.mitre.org/')
    await clickSaveButton(page)
    await verifyNoError(page, 'URL cannot be found or does not start with http(s)://')

    // Filename
    await page.fill(':text("Case study filename")', 'Playwright Test')
    await expect(requiredErrors).toHaveCount(1)

    // Click download button
    await page.click('id=download_case_study_button')
  })
})

