Merge requests into ATALAS Vue 3 require the following. Submitter and reviewer should ✅ all boxes when done. For items that are not-applicable, note it's not-applicable by typing "N/A" next to the box or ~~striking it through~~ and ✅ it.

Prepend your MR title like ATLAS-<Jira number>: <title>, and include all tickets if the MR covers more than one, e.g. ATLAS-1, ATLAS-2: <title>. If the MR is not related to a Jira task, just give it a descriptive title.

When assigning a reviewer, add them to the assignee and reviewer lists below and tag them in one of the reviewer checklists below. As soon as your MR is ready for review, post about it in the Slack channel.

# Description
Jira Ticket: [ATlAS-###](https://tracker.codev.mitre.org/browse/ATLAS-###)

Write out a concise summary and/or list of this merge request and what it addresses.

## Important Changes

Please list important files (meaning substantial or integral to the MR) along with a list of the general changes that should be highlighted for reviewers.

`example_file.js`
- Example change (ex: refactored import function)

## Testing Recommendations

Please list any recommendations regarding what the reviewer should test and if there is any specific guidance on how to test certain aspects of the MR. Be sure to mention edge cases that should be tried and provide some sample data and/or values to test with that you want the reviewer to use.

# Checklists

**Submitter:**
- [ ] This MR is into the correct branch.
- [ ] Comment added to the relevant Jira ticket(s) with a link to this MR.
- [ ] The relevant Jira ticket has been moved to 'In Review'.
- [ ] Post on Slack that the MR is open for review, tagging the reviewer.
- [ ] Code diff has been reviewed (it **does not** contain: additional white space, not applicable code changes, debug statements, etc.).

@ <reviewer_username> :
- [ ] Code is maintainable and reusable, reuses existing code and infrastructure where appropriate, and accomplishes the task’s purpose.
- [ ] You have tried to break the code.
- [ ] Tested all recommendations listed in the "Testing Recommendations" section. The application behaves as expected with this MR.


**Final Merger**
- [ ] At least one review/approval have been received on this MR and all checklists have been completed.
- [ ] The relevant Jira ticket has been moved to 'Done.'
