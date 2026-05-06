<template>
    <v-autocomplete prepend-inner-icon="mdi-magnify" v-model="autocompleteModel" v-model:menu="menu"
        :label="requiredLabelIf(selectorLabel, props.required)" :required="props.required"
        :error="showRequiredError" @update:focused="handleFocused"
        :items="existingDataObjects" chips
        :item-title="itemTitle" item-value="id" :multiple="props.multiple" clearable persistent-hint
        :hint="selectorHint" autocomplete="off">

        <template v-if="props.allowNew" #prepend-item>
            <v-list-item
                style="color: rgb(var(--v-theme-darkInfo)); border-bottom: 2px solid rgb(var(--v-theme-darkInfo)); font-weight: 900;"
                :title="`Add New ${typeWord}`" @mousedown.stop.prevent @click.stop.prevent="clickNewItem" />
        </template>
        <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps">
                <template #title>
                    <template v-if="shouldSplitTechniqueTitle(item)">
                        <span class="text-medium-emphasis font-italic">{{ techniqueTitleParent(item) }}:</span>
                        <span class="ms-1">{{ techniqueTitleChild(item) }}</span>
                    </template>
                    <template v-else>{{ item.title }}</template>
                </template>
            </v-list-item>
        </template>
        <template #chip="{ props: chipProps, item }">
            <v-chip v-bind="chipProps">
                <template v-if="isDraftItem(item.raw)">
                    <span class="font-weight-medium">New</span>
                    <span v-if="draftChipTitle(item)">: {{ draftChipTitle(item) }}</span>
                </template>
                <template v-else-if="shouldSplitTechniqueTitle(item)">
                    <span class="text-medium-emphasis font-italic">{{ techniqueTitleParent(item) }}:</span>
                    <span class="ms-1">{{ techniqueTitleChild(item) }}</span>
                </template>
                <template v-else>{{ chipTitle(item) }}</template>
            </v-chip>
        </template>
        <template #details>
            <div class="text-right flex-shrink-0 ms-4 me-n4">
                <router-link :to="atlasTypeRoute" target="_blank" class="text-info">
                    View ATLAS {{ typeWordPlural }}
                    <v-icon icon="mdi-open-in-new" size="small"></v-icon>
                </router-link>
            </div>
        </template>
    </v-autocomplete>

    <div v-if="props.allowNew && showNewItemForm" class="pl-6 mt-4">
        <h3 class="form-title mb-6">New Associated {{ typeWord }}</h3>

        <v-text-field v-model.trim="newDraftItem.name" required
            :error="showNewItemFieldError('name')"
            :label="requiredLabel(`New Associated ${typeWord} Name`)"
            @update:focused="handleNewItemFieldFocused('name', $event)"
            persistent-hint
            class="mb-5"></v-text-field>

        <v-textarea v-model.trim="newDraftItem.summary" required
            :error="showNewItemFieldError('summary')"
            :label="requiredLabel(`New Associated ${typeWord} Summary`)"
            :hint="`Description of the ${typeWordLower}`"
            @update:focused="handleNewItemFieldFocused('summary', $event)"
            persistent-hint
            class="mb-5"></v-textarea>
        <v-textarea v-if="showTechniqueUseField" v-model.trim="newDraftItem.use" required
            :error="showNewItemFieldError('use')"
            :label="requiredLabel('Associated Technique Use')"
            hint="How this mitigation applies to the associated technique"
            @update:focused="handleNewItemFieldFocused('use', $event)"
            persistent-hint
            class="mb-5"></v-textarea>
        <ReferenceFields
            v-model:description="newDraftItem.referenceDescription"
            v-model:link="newDraftItem.referenceLink"
            :description-label="`New Associated ${typeWord} Reference Description`"
            :description-hint="`Brief description of the reference and its relevance to the ${typeWordLower} (optional)`"
            description-class="mb-5"
            :link-label="`New Associated ${typeWord} Reference Link`"
            link-class="mb-5"
            :link-error="showNewItemFieldError('referenceLink')"
            @link-focused="handleNewItemFieldFocused('referenceLink', $event)"
        />
    </div>
</template>

<script setup>
import { contributionTypeWordFromKey } from '@/assets/contributionTools'
import { useMain } from '@/stores/main'
import { computed, ref, watch } from 'vue'
import ReferenceFields from '@/components/ReferenceFields.vue'

const props = defineProps({
    type: { type: String, required: true },
    multiple: { type: Boolean, required: false, default: true },
    required: { type: Boolean, required: false, default: false },
    showValidation: { type: Boolean, required: false, default: false },
    parentType: { type: String, required: false, default: '' },
    label: { type: String, required: false, default: '' },
    hint: { type: String, required: false, default: '' },
    allowNew: { type: Boolean, required: false, default: true },
    newItemErrors: { type: Object, required: false, default: null },

    // Optional override: if provided (even as []), it will be used instead of the store results
    items: { type: Array, required: false },
})

// Shared model with parent (can be: ids[], id, null, or the draft object)
const model = defineModel({ default: null })

const mainStore = useMain()
const typeWord = computed(() => contributionTypeWordFromKey(props.type))
const typeWordLower = computed(() => contributionTypeWordFromKey(props.type, true))
const typeWordPlural = computed(() => contributionTypeWordFromKey(props.type, false, true))
const atlasTypeRoute = computed(() => `/${props.type}`)
const associatedLabel = computed(() =>
    `Associated ATLAS ${props.multiple ? typeWordPlural.value : typeWord.value}`
)
const associatedHint = computed(() => {
    const subject = props.parentType ? `the ${contributionTypeWordFromKey(props.parentType, true)}` : 'this item'
    const selection = props.multiple
        ? `all ATLAS ${contributionTypeWordFromKey(props.type, true, true)}`
        : `the ATLAS ${contributionTypeWordFromKey(props.type, true)}`
    return `Select ${selection} associated with ${subject}`
})
const selectorLabel = computed(() => props.label || associatedLabel.value)
const selectorHint = computed(() => props.hint || associatedHint.value)
const showTechniqueUseField = computed(() =>
    props.parentType === 'mitigations' && props.type === 'techniques'
)

const existingDataObjects = computed(() => {
    const source =
        props.items !== undefined
            ? (props.items ?? [])
            : mainStore.getDataObjectsByType(props.type, 'ATLAS')

    if (props.type === 'techniques') {
        return source.map(techniqueOption).sort((a, b) =>
            techniqueSortLabel(a).localeCompare(techniqueSortLabel(b)) ||
            (a?.id ?? '').localeCompare(b?.id ?? '')
        )
    }

    return [...source].sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''))
})

function isSubtechnique(item) {
    return item && Object.prototype.hasOwnProperty.call(item, 'subtechnique-of')
}

function techniqueSortLabel(item) {
    if (isSubtechnique(item)) {
        return item.label
    }

    return `${item.label}:`
}

function techniqueOption(item) {
    if (!isSubtechnique(item)) return item

    return {
        ...item,
        props: {
            ...item.props,
            class: ['pl-8', item.props?.class],
        },
    }
}

const itemTitle = computed(() => props.type === 'techniques' ? 'label' : 'name')

function chipTitle(item) {
    return item.title
}

function draftChipTitle(item) {
    const draftItem = isDraftItem(item?.raw) ? getDraftItemFromModel(model.value) ?? item.raw : item?.raw
    return draftItem?.name?.trim() || ''
}

function shouldSplitTechniqueTitle(item) {
    return props.type === 'techniques' &&
        isSubtechnique(item.raw) &&
        item.title.includes(': ')
}

function techniqueTitleParent(item) {
    return item.title.split(': ')[0]
}

function techniqueTitleChild(item) {
    const title = item.title
    const separatorIndex = title.indexOf(': ')
    return separatorIndex === -1 ? title : title.slice(separatorIndex + 2)
}

function selectionId(value) {
    if (typeof value === 'string') return value
    if (value && typeof value === 'object' && typeof value.id === 'string') return value.id
    return ''
}

function techniqueSelectionSortLabel(value) {
    const id = selectionId(value)
    const item = existingDataObjects.value.find((option) => option?.id === id)
    return item ? techniqueSortLabel(item) : id
}

function sortAutocompleteValues(values) {
    if (props.type !== 'techniques') return values

    return [...values].sort((a, b) =>
        techniqueSelectionSortLabel(a).localeCompare(techniqueSelectionSortLabel(b)) ||
        selectionId(a).localeCompare(selectionId(b))
    )
}

const menu = ref(false)
const showNewItemForm = ref(false)
const isTouched = ref(false)
const touchedNewItemFields = ref(new Set())

const newDraftItem = computed(() => getDraftItemFromModel(model.value) ?? createNewDraftItem())

function isBlank(value) {
    if (typeof value === 'string') return value.trim() === ''
    if (Array.isArray(value)) return value.length === 0
    return value === null || value === undefined || value === ''
}

function requiredLabel(label) {
    return `${label} *`
}

function requiredLabelIf(label, isRequired) {
    return isRequired ? requiredLabel(label) : label
}

function getNewItemErrors(field) {
    return props.newItemErrors?.[field] ?? []
}

function showNewItemFieldError(field) {
    return getNewItemErrors(field).length > 0 &&
        (props.showValidation || touchedNewItemFields.value.has(field))
}

const showRequiredError = computed(
    () => props.required && isBlank(model.value) && (isTouched.value || props.showValidation)
)

function handleFocused(focused) {
    if (!focused) isTouched.value = true
}

function handleNewItemFieldFocused(field, focused) {
    if (focused || touchedNewItemFields.value.has(field)) return
    touchedNewItemFields.value = new Set(touchedNewItemFields.value).add(field)
}

function isDraftItem(v) {
    return v && typeof v === 'object' && v.id === 'new'
}

function isDraftSelection(v) {
    return v === 'new' || isDraftItem(v)
}

function getDraftItemFromModel(value) {
    if (props.multiple) {
        return Array.isArray(value) ? value.find(isDraftItem) : null
    }

    return isDraftItem(value) ? value : null
}

function createNewDraftItem() {
    return {
        id: 'new',
        name: '',
        summary: '',
        referenceDescription: '',
        referenceLink: '',
    }
}

watch(
    model,
    (value) => {
        if (!props.allowNew) {
            showNewItemForm.value = false
            return
        }

        showNewItemForm.value = !!getDraftItemFromModel(value)
    },
    { immediate: true }
)

watch(showNewItemForm, (visible) => {
    if (!visible) touchedNewItemFields.value = new Set()
})

/**
 * v-autocomplete's model keeps the draft item only so Vuetify can render its chip,
 * while `model` (shared with parent) may include it.
 */
const autocompleteModel = computed({
    get() {
        if (props.multiple) {
            const current = Array.isArray(model.value) ? model.value : []
            const selected = sortAutocompleteValues(current.filter(v => !isDraftSelection(v)))
            const draftItem = getDraftItemFromModel(model.value)
            return draftItem ? [draftItem, ...selected] : selected
        }

        if (isBlank(model.value)) {
            return null
        }

        return model.value
    },
    set(val) {
        if (props.multiple) {
            const values = Array.isArray(val) ? val : []
            const selected = sortAutocompleteValues(values.filter(v => !isDraftSelection(v)))
            showNewItemForm.value = values.some(isDraftSelection)
            const draftItem = getDraftItemFromModel(model.value) ?? createNewDraftItem()
            model.value = showNewItemForm.value ? [draftItem, ...selected] : [...selected]
            return
        }

        // When single-select picks a normal option, close the new-item form and sync shared model
        if (val != null) {
            showNewItemForm.value = false
        }

        model.value = val
    },
})

function clickNewItem() {
    if (!props.allowNew) return

    menu.value = false

    const oldValue = showNewItemForm.value

    // In multiple mode toggles the new form on/off, in single mode only toggles it on
    if (props.multiple || !showNewItemForm.value) {
        showNewItemForm.value = !showNewItemForm.value
    }

    if (showNewItemForm.value !== oldValue) {
        toggleNewItemInclusion()
    }
}

function toggleNewItemInclusion() {
    if (props.multiple) {
        const current = Array.isArray(model.value) ? model.value : []
        const withoutDraft = current.filter(v => !isDraftSelection(v))
        const draftItem = getDraftItemFromModel(model.value) ?? createNewDraftItem()
        model.value = showNewItemForm.value ? [draftItem, ...withoutDraft] : withoutDraft
        return
    }

    // single mode: only clear if the current value is the draft
    if (showNewItemForm.value) {
        model.value = getDraftItemFromModel(model.value) ?? createNewDraftItem()
    } else if (isDraftItem(model.value)) {
        model.value = null
    }
}
</script>
