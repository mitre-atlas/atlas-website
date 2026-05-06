<template>
    <v-defaults-provider :defaults="formFieldDefaults">
    <div class="contribution-form-page ma-3 ma-md-0">
        <v-container class="pt-sm-16 mt-sm-16">
            <div class="text-h4 my-3 text-mediumNavy" style="line-height: 44px;">
                Contribute to
                <v-img src="@/assets/graphics/MITRE_ATLAS_dark.svg" width="240px" inline></v-img>
            </div>
            <p>Thank you for your interest in contributing to MITRE ATLAS™! We highly value the collaboration of the AI
                community and want to learn more about your experiences and insights.</p>
            <p>Once a contribution is submitted, the MITRE ATLAS™ team will conduct a review and reach out with any
                follow-on actions. For any questions or issues, please contact <a
                    href='mailto:atlas@mitre.org'>atlas@mitre.org</a>.</p>
        </v-container>
        <v-container>
            <v-tabs
                slider-color="info"
                :model-value="action"
                class="add-edit-tabs"
                @update:model-value="requestContributionSwitch({ action: $event, type: null, editTarget: null })"
            >
                <v-tab value="add" class="text-none">Add New Contribution</v-tab>
                <v-tab value="edit" class="text-none">Suggest ATLAS Matrix Edit</v-tab>
            </v-tabs>
            <v-tabs-window :model-value="action">
                <v-tabs-window-item value="add">
                    <div class="mt-6">
                        <p>Select a contribution type from the options below to submit a new tactic, technique,
                            mitigation, and/or case study for potential incorporation into the ATLAS Matrix. You may
                            also select the “General Contribution” option to send us general thoughts, comments, or
                            information for our awareness.
                        </p>
                        <v-select
                            :model-value="type"
                            :items="types"
                            variant="outlined"
                            label="Primary Contribution Type *"
                            persistent-hint
                            hint="While additional types may be associated with the submission, select the primary type you would like to contribute"
                            @update:model-value="requestContributionSwitch({ type: $event, editTarget: null })"
                        ></v-select>
                        <div v-if="type && type !== 'other'">
                            <p class="mt-12">Already have an ATLAS {{ typeWordLower }} file? To view or edit
                                your existing {{ typeWordLower }}, upload your .yaml file using the “Upload
                                File” button.</p>
                            <p><b>Please note, uploading a file will overwrite all current field entries.</b></p>
                            <VAtlasBtnSecondary class="mt-2 mb-8"
                                @click="showUploadDialog = true">Upload File</VAtlasBtnSecondary>
                        </div>
                    </div>
                </v-tabs-window-item>
                <v-tabs-window-item value="edit" class="pt-6">
                    <p>Using the form below, indicate which ATLAS Matrix component you would like to submit for editing
                        and the edits you recommend. Please note, edits will not automatically update the ATLAS Matrix
                        upon submission. The MITRE ATLAS™ team will review the edit suggestion and reach out with any
                        follow-on actions if the suggestion is approved.</p>
                    <v-select
                        :model-value="type"
                        :items="editTypes"
                        variant="outlined"
                        label="ATLAS Matrix Component *"
                        :multiple="false"
                        persistent-hint
                        hint="Select the component type for which you would like to suggest an edit"
                        @update:model-value="requestContributionSwitch({ type: $event, editTarget: null })"
                    ></v-select>
                    <v-autocomplete
                        v-if="type"
                        prepend-inner-icon="mdi-magnify"
                        class="mt-8"
                        persistent-hint
                        variant="outlined"
                        :label="`ATLAS ${typeWord} *`"
                        :model-value="editTarget"
                        item-title="name"
                        item-value="id"
                        :items="editTargets"
                        :multiple="false"
                        :hint="`Select the ${typeWordLower} for which you would like to suggest an edit`"
                        @update:model-value="requestContributionSwitch({ editTarget: $event })"
                    />
                    <div v-if="type">
                        <p class="mt-12">Already have an ATLAS {{ typeWordLower }} file? To view or edit
                            your existing {{ typeWordLower }}, upload your .yaml file using the “Upload
                            File” button.</p>
                        <p><b>Please note, uploading a file will overwrite all current field entries.</b></p>
                        <VAtlasBtnSecondary class="mt-2 mb-8"
                            @click="showUploadDialog = true">Upload File</VAtlasBtnSecondary>
                    </div>
                </v-tabs-window-item>
            </v-tabs-window>
            <UploadContributionDialog v-if="type && type !== 'other'" v-model="showUploadDialog" :type-key="type"
                @submit="handleContributionUpload" />
            <v-dialog
                v-model="showContributionSwitchDialog"
                max-width="520"
                persistent
            >
                <v-card class="pa-6 text-mediumNavy">
                    <div class="d-flex justify-end mb-2">
                        <v-btn
                            aria-label="Return to form"
                            color="mediumNavy"
                            density="comfortable"
                            icon="mdi-close"
                            variant="text"
                            @click="cancelContributionSwitch"
                        />
                    </div>
                    <v-card-text class="text-center text-body-1 pa-0 mb-8">
                        <p class="mb-6">Navigating away from the form will clear all data.</p>
                        <p class="mb-0">Are you sure you want to continue?</p>
                    </v-card-text>
                    <v-card-actions class="justify-center flex-wrap ga-8 pa-0">
                        <VAtlasBtnSecondary size="large" width="195" @click="cancelContributionSwitch">
                            Cancel
                        </VAtlasBtnSecondary>
                        <VAtlasBtnPrimary size="large" width="195" @click="confirmContributionSwitch">
                            Continue
                        </VAtlasBtnPrimary>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
        <v-container v-if="showSubComponentEditForm && type !== 'other'">
            <h2 class="w-100 form-title">{{ formTitle }}</h2>
            <div class="pt-5 instructions">
                <div v-if="type !== 'other'">
                    {{ considerationIntro }}
                    <ul>
                        <li v-for="rule in considerationRules" :key="rule">{{ rule }}</li>
                    </ul>
                </div>
            </div>
        </v-container>
        <v-container :class="{ 'mt-8': type !== 'other', 'pt-0': type === 'other' }">
            <!-- todo: Sticky Side-bar Nav with links to each of the main expandable sections, e.g. for techniques: Contact Details, Technique Details, Associated Tactics, Associated Mitigations, Technique References, Submit-->
            <v-row v-if="showSubComponentEditForm" align="stretch" class="ma-0">
                <v-col cols="12" sm="3" class="pa-0 pr-0 pr-sm-6" v-if="type && type !== 'other'">
                    <div class="sticky-nav">
                        <v-list>
                            <v-list-item v-for="section in visibleSections" :key="section.id" :title="section.title"
                                :active="activeSectionId === section.id" @click="scrollToSection(section.id)" />
                        </v-list>
                    </div>
                </v-col>
                <v-col cols="12" :sm="type === 'other' ? 12 : 9" class="pb-14">
                    <form-structure ref="formStructureRef" :key="type" :type="type" :action="action"
                        :sections="sectionsForForm" :edit-target="selectedEditTarget" />
                </v-col>
            </v-row>
            <div v-else class="contribution-form-placeholder"></div>
        </v-container>
    </div>
    </v-defaults-provider>
</template>
<script setup>
import FormStructure from '@/components/contribute-form/FormStructure.vue';
import UploadContributionDialog from '@/components/contribute-form/UploadContributionDialog.vue';
import { ref, onMounted, onBeforeUnmount, nextTick, watch, computed } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { getReferenceDisplayText, truncateText } from '@/assets/tools';
import { REFERENCE_DISPLAY_MAX_CHARS } from '@/types/reference';
import {
    caseStudyConsiderations,
    getMatrixAssociations,
    getResponsibleDisclosureConsideration,
    contributionTypeWordFromKey,
    getContributionTypeKey,
    getContributionTypeOptions,
    isContributionTypeKey,
    mapContributionToDraft,
} from '@/assets/contributionTools.js';
import { useMain } from '@/stores/main';

const mainStore = useMain();
const route = useRoute();
const router = useRouter();
const CONTRIBUTION_SUMMARY_MAX_CHARS = 180;

const types = getContributionTypeOptions();
const routeAction = Array.isArray(route.query.action) ? route.query.action[0] : route.query.action;
const action = ref(routeAction === 'edit' ? 'edit' : 'add');
const routeType = Array.isArray(route.query.type) ? route.query.type[0] : route.query.type;
const type = ref(isContributionTypeKey(routeType) ? routeType : "");
const typeWord = computed(() => contributionTypeWordFromKey(type.value));
const typeWordLower = computed(() => contributionTypeWordFromKey(type.value, true));
const formTitle = computed(() => {
    if (action.value === 'edit' && selectedEditTarget.value?.name) {
        return `${selectedEditTarget.value.name} ${typeWord.value}`
    }

    return typeWord.value
})
const considerationIntro = computed(() => {
    if (action.value === 'edit') {
        return `Before submitting an edit to an existing ${typeWordLower.value}, please review the following considerations:`
    }

    return `Before contributing a new ${typeWordLower.value}, please review the following considerations:`
})
const showUploadDialog = ref(false)
const showContributionSwitchDialog = ref(false)
const pendingContributionSwitch = ref(null)
const formStructureRef = ref(null)
let pendingRouteLeave = null
const contributionFieldDefaults = { baseColor: 'lightNavy', color: 'lightNavy' }
const contributionDropdownFieldDefaults = {
    ...contributionFieldDefaults,
    menuProps: { stickToTarget: true, zIndex: 999 },
}
const contributionDialogDefaults = { scrim: 'lightSilver', opacity: 0.75 }
const formFieldDefaults = {
    VDialog: contributionDialogDefaults,
    VTextField: contributionFieldDefaults,
    VTextarea: contributionFieldDefaults,
    VSelect: contributionDropdownFieldDefaults,
    VAutocomplete: contributionDropdownFieldDefaults,
    VFileInput: contributionFieldDefaults,
}

const editTypes = getContributionTypeOptions(false);
const editTarget = ref(null);

function requestContributionSwitch(nextSelection) {
    if (isCurrentSelection(nextSelection)) {
        return
    }

    if (isContributionFormDirty()) {
        pendingContributionSwitch.value = nextSelection
        showContributionSwitchDialog.value = true
        return
    }

    applyContributionSwitch(nextSelection)
}

function isCurrentSelection(nextSelection) {
    if ('action' in nextSelection && nextSelection.action !== action.value) {
        return false
    }

    if ('type' in nextSelection && nextSelection.type !== type.value) {
        return false
    }

    if ('editTarget' in nextSelection && nextSelection.editTarget !== editTarget.value) {
        return false
    }

    return true
}

function isContributionFormDirty() {
    return Boolean(formStructureRef.value?.isFormDirty?.())
}

function applyContributionSwitch(nextSelection) {
    if ('action' in nextSelection) {
        action.value = nextSelection.action
    }

    if ('type' in nextSelection) {
        type.value = nextSelection.type
    }

    if ('editTarget' in nextSelection) {
        editTarget.value = nextSelection.editTarget
    }
}

function cancelContributionSwitch() {
    if (pendingRouteLeave) {
        pendingRouteLeave(false)
        pendingRouteLeave = null
    }

    pendingContributionSwitch.value = null
    showContributionSwitchDialog.value = false
}

function confirmContributionSwitch() {
    const nextSelection = pendingContributionSwitch.value
    const routeLeave = pendingRouteLeave
    pendingContributionSwitch.value = null
    pendingRouteLeave = null
    showContributionSwitchDialog.value = false

    if (routeLeave) {
        routeLeave()
        return
    }

    if (nextSelection) {
        applyContributionSwitch(nextSelection)
    }
}

onBeforeRouteLeave((to, from, next) => {
    if (!isContributionFormDirty()) {
        next()
        return
    }

    pendingContributionSwitch.value = null
    pendingRouteLeave = next
    showContributionSwitchDialog.value = true
})

// Keep dependent state and the refreshable route query aligned with the selected type.
watch(type, (newType) => {
    editTarget.value = null

    if (route.query.type !== newType) {
        router.replace({ query: { ...route.query, type: newType || undefined } })
    }
})

watch (action, () => {type.value = null; editTarget.value = null})

// Populate the list of possible values available in the editTarget dropdown based on the editType selected
const editTargets = computed(() => {
    const t = type.value == 'studies' ? 'case-studies' : type.value;
    const matrixId = type.value == 'studies' ? undefined : 'ATLAS';
    return (t && t !== 'other') ? 
        mainStore.getDataObjectsByType(t, matrixId).sort((a, b) => a.name.localeCompare(b.name)) 
        : []
});

const selectedEditTarget = computed(() => {
    if (action.value !== 'edit' || !editTarget.value) return null
    return editTargets.value.find((target) => target.id === editTarget.value) ?? null
})

const showSubComponentEditForm = computed(() => {
    if (!type.value) return false
    if (action.value !== 'edit') return true

    return Boolean(selectedEditTarget.value)
})

function associatedSections(typeKey) {
    return getMatrixAssociations(typeKey).map((associatedType) => ({
        id: `associated-${associatedType}`,
        title: `Associated ${contributionTypeWordFromKey(associatedType, false, true)}`,
        associatedType,
        transformer: associatedTransformer,
        removalTransformer: associationRemovalTransformer,
    }))
}


const sections = {
    techniques: [
        { id: 'contact-details', title: 'Contact Details' },
        { id: 'technique-details', title: 'Technique Details', transformer: detailsTransformer },
        ...associatedSections('techniques'),
        { id: 'references', title: 'Technique References', transformer: referenceTransformer },
        { id: 'save-send', title: 'Save & Send' },
    ],
    tactics: [
        { id: 'contact-details', title: 'Contact Details' },
        { id: 'tactic-details', title: 'Tactic Details', transformer: detailsTransformer },
        ...associatedSections('tactics'),
        { id: 'references', title: 'Tactic References', transformer: referenceTransformer },
        { id: 'save-send', title: 'Save & Send' },
    ],
    mitigations: [
        { id: 'contact-details', title: 'Contact Details' },
        { id: 'mitigation-details', title: 'Mitigation Details', transformer: detailsTransformer },
        ...associatedSections('mitigations'),
        { id: 'references', title: 'Mitigation References', transformer: referenceTransformer },
        { id: 'save-send', title: 'Save & Send' },
    ],
    studies: [
        { id: 'contact-details', title: 'Contact Details' },
        { id: 'study-details', title: 'Case Study Details', transformer: detailsTransformer },
        { id: 'procedure', title: 'Case Study Procedure', transformer: procedureTransformer },
        { id: 'references', title: 'Case Study References', transformer: referenceTransformer },
        { id: 'save-send', title: 'Save & Send' }
    ],
    other: [
        { id: 'other', title: null },
    ]
}

const rules = {
    techniques: [
        "Techniques describe how adversaries achieve tactical goals by performing an action.",
        "Techniques may also represent what an adversary gains by performing an action.",
        "As there are many ways to achieve tactical objectives, multiple techniques may fit into a single tactic category.",
    ],
    tactics: [
        "Tactics are tactical adversary goals during an attack on an artificial intelligence system. They represent the reason for performing an attack action.",
        "Tactics serve as useful contextual categories for individual techniques and cover standard notations for things adversaries do during an operation.",
    ],
    mitigations: [
        "Mitigations represent security concepts and classes of technologies that can be used to prevent a technique or sub-technique from being successfully executed."
    ],
    studies: caseStudyConsiderations,
}

const considerationRules = computed(() => {
    const typeRules = rules[type.value] ?? []
    if (!typeRules.length) return []

    return [
        ...typeRules,
        getResponsibleDisclosureConsideration(typeWordLower.value),
    ]
})

const visibleSections = computed(() => {
    return sections[type.value] ?? []
})

const sectionsForForm = computed(() => ({
    [type.value]: visibleSections.value,
}))

// Contribution List Transfomers - 
//  Functions to convert sections a string for the Contribution List

function detailsTransformer(section, draft, typeWord) {
    if (action.value === 'edit') {
        const itemName = selectedEditTarget.value?.name || draft.name

        return {
            title: `${truncateText(itemName, CONTRIBUTION_SUMMARY_MAX_CHARS)} ${typeWord} Edit Suggestion`,
            body: `Updated ${contributionTypeWordFromKey(type.value, true)} preview...`,
        }
    }

    if (draft.name) {
        return { body: truncateText(`${typeWord} ${draft.name}`, CONTRIBUTION_SUMMARY_MAX_CHARS) };
    } else return null
}

function associatedTransformer(section, draft, typeWord) {
    const associatedType = section.associatedType
    const associatedArray = draft[associatedType] ?? [];

    if (!associatedArray.length) return {};

    if (action.value === 'edit') {
        return {
            body: associatedArray
                .map((element) => `Add ${newAssociatedTransformer(element)} ${contributionTypeWordFromKey(associatedType)} Association`)
                .join("\n")
        }
    }

    return {
        title: section.title + ":",
        body: associatedArray.map((element, idx) => `${idx + 1}. ${newAssociatedTransformer(element)}`).join("\n")
    };
}

function associationRemovalTransformer(section, draft) {
    const removalArray = draft.associationRemovals?.[section.associatedType] ?? []

    if (!removalArray.length) return {}

    return {
        body: removalArray
            .map((element) => `Remove ${newAssociatedTransformer(element)} ${contributionTypeWordFromKey(section.associatedType)} Association`)
            .join("\n")
    }
}


function referenceTransformer(section, draft, typeWord) {
    if (!draft.references.length) return {};
    return {
        title: "References:",
        body: draft.references
            .map((element, idx) => `${idx + 1}. ${getReferenceDisplayText(element, REFERENCE_DISPLAY_MAX_CHARS)}`)
            .join("\n")
    };
}

function procedureTransformer(section, draft, typeWord) {
    if (!draft.csProcedures.length) return {};
    return {
        title: "Procedure Steps:",
        body: draft.csProcedures
            .map((element, idx) =>
                `${idx + 1}. Tactic: ${procedureItemTransformer(element.tactic)}\n   Technique: ${procedureItemTransformer(element.technique)}`
            )
            .join("\n")
    }
}

// Used across procedure & associated sections for outputting text for newly added types
function newAssociatedTransformer(newTypeDraft) {
    if (typeof newTypeDraft === 'string') {
        return truncateText(
            mainStore.getDataObjectById(newTypeDraft)?.name ?? newTypeDraft,
            CONTRIBUTION_SUMMARY_MAX_CHARS
        )
    }

    if (newTypeDraft && typeof newTypeDraft === 'object') {
        const name = newTypeDraft.name?.trim() || 'Unnamed associated item'
        return truncateText(name, CONTRIBUTION_SUMMARY_MAX_CHARS)
    }

    return 'Unknown associated item'
}

function procedureItemTransformer(value) {
    if (typeof value === 'string') {
        return truncateText(
            mainStore.getDataObjectById(value)?.name ?? value,
            CONTRIBUTION_SUMMARY_MAX_CHARS
        )
    }

    if (value && typeof value === 'object') {
        const name = value.name?.trim() || 'Unnamed associated item'
        return truncateText(name, CONTRIBUTION_SUMMARY_MAX_CHARS)
    }

    return 'Unknown associated item'
}

// Initializes the active section (used to highlight the current sidebar link).
const activeSectionId = ref(visibleSections.value[0]?.id ?? '')

let observer = null
const isAutoScrolling = ref(false)
let anchorEls = []
let rafId = 0

// Smooth-scrolls to a section and temporarily "locks" active-section updates until scrolling settles.
async function scrollToSection(id) {
    isAutoScrolling.value = true
    activeSectionId.value = id

    try {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

        // IMPORTANT: target must match whatever element actually scrolls
        await waitForScrollEnd({ target: window, idleMs: 140 })
    } finally {
        isAutoScrolling.value = false
        // Force a final sync now that the lock is lifted
        updateActiveFromScroll()
    }
}

// Resolves after scroll activity has stopped for 'idleMs' milliseconds.
function waitForScrollEnd({ target = window, idleMs = 140 } = {}) {
    return new Promise((resolve) => {
        let t

        const onScroll = () => {
            clearTimeout(t)
            t = setTimeout(() => {
                cleanup()
                resolve()
            }, idleMs)
        }

        const cleanup = () => {
            clearTimeout(t)
            target.removeEventListener('scroll', onScroll)
        }

        // Start listening; calling once also covers the case where scrolling doesn't fire events immediately.
        target.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
    })
}

// Re-collect the section header elements that act as anchors.
function collectAnchors() {
    anchorEls = Array.from(document.querySelectorAll('.section-anchor[id]'))
}

// Sets active section to the last anchor whose top is above the "activation line".
function updateActiveFromScroll() {
    if (isAutoScrolling.value) return
    if (!anchorEls.length) return

    const headerOffsetPx = 300 // Give ourselves a little buffer for switching how far from the top the anchor is before its 'active'
    const activationY = headerOffsetPx + 1

    let currentId = anchorEls[0].id

    for (const el of anchorEls) {
        const top = el.getBoundingClientRect().top
        if (top <= activationY) currentId = el.id
        else break
    }

    activeSectionId.value = currentId
}

// Throttles scroll handling to once per animation frame.
function onScroll() {
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(updateActiveFromScroll)
}

onMounted(async () => {
    await nextTick()
    collectAnchors()
    updateActiveFromScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(rafId)
})

watch(type, async () => {
    await nextTick()
    collectAnchors()
    activeSectionId.value = visibleSections.value[0]?.id ?? ''
    updateActiveFromScroll()
})

watch(visibleSections, async () => {
    await nextTick()
    collectAnchors()
    activeSectionId.value = visibleSections.value[0]?.id ?? ''
    updateActiveFromScroll()
})

async function handleContributionUpload(contributionObj, filename) {
    const uploadedType = getContributionTypeKey(contributionObj)
    const uploadedDraft = mapContributionToDraft(contributionObj)

    if (uploadedType && uploadedType !== type.value) {
        type.value = uploadedType
        await nextTick()
    }

    if (action.value === 'edit') {
        const uploadedEditTarget = editTargets.value.find((target) => target.id === uploadedDraft.id)
        editTarget.value = uploadedEditTarget?.id ?? null
        await nextTick()
    }

    await formStructureRef.value?.loadContributionDraft?.(contributionObj, filename)
}
</script>
<style>
.instructions ul {
    padding-left: 28px;
}

.contribution-form-page .v-input:not(.v-input--error) .v-messages__message {
    font-style: italic;
}

.contribution-form-page .v-text-field .v-input__details {
    padding-inline-start: 0;
}

.contribution-form-placeholder {
    min-height: 360px;
}

.sticky-nav {
    position: sticky;
    top: 64px;
}

.sticky-nav .v-list-item {
    border-left: 6px solid transparent;
}

.sticky-nav .v-list-item-title {
    color: rgb(var(--v-theme-mediumNavy));
}

.sticky-nav .v-list-item--active {
    border-left: 6px solid rgb(var(--v-theme-info));
    background: #edf6fa;

}

.sticky-nav .v-list-item--active .v-list-item-title {
    font-weight: bold !important;
}

.sticky-nav .v-list-item--active .v-list-item__overlay {
    background: transparent;
}

.add-edit-tabs .v-tab.v-tab--selected {
    font-weight: bold;
}

.add-edit-tabs .v-tab {
    font-size: large;
    font-weight: 400;
}
</style>
