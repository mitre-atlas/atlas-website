<template>
  <v-navigation-drawer
    v-model="doShowNavDrawer"
    :width="325"
    class="pl-3"
    mobile-breakpoint="md"
  >
    <v-list-item-title class="mt-10 text-h5 text-capitalize">
      {{ title }}
    </v-list-item-title>

    <v-list
      v-if="title === 'techniques' || title === 'tactics'"
      v-model:opened="open"
      open-strategy="multiple"
      density="compact"
      style="width: 310px"
    >
      <v-list-group
        v-for="(tacticObjects, matrixID, i) in data"
        :key="i"
        :value="title"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
          >
            <span @click="$router.push(`/matrices/${matrixID}`)" class="link">
              {{ matrixID }}
            </span>
          </v-list-item>
        </template>
        <div v-if="title === 'tactics'">
          <v-list-item
            v-for="(tactic, i) in tacticObjects"
            :key="i"
            :to="tactic.route"
            :title="tactic.name"
            class="ml-3 text-body-2 link"
          />
        </div>
        <v-list
          v-if="title === 'techniques'"
          :opened="expandedTactics"
          open-strategy="multiple"
          density="compact"
        >
          <v-list-group
            v-for="(tactic, j) in tacticObjects"
            :key="j"
            subgroup
            class="text-body-2"
            :value="tactic.name"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
              >
                <span @click="$router.push(tactic.route)" class="link">
                  {{ tactic.name }}
                </span>
              </v-list-item>
            </template>
            <div
              v-for="(technique, i) in tactic.techniques"
              :key="i"
            >
              <v-list-item :to="technique.route">
                <div class="ml-13">
                  {{ technique.name }}
                </div>
              </v-list-item>
              <v-list-item
                v-for="(subtechnique, subIndex) in technique.subtechniques"
                :key="subIndex"
                :to="subtechnique.route"
              >
                <div class="ml-16">
                  {{ subtechnique.name }}
                </div>
              </v-list-item>
            </div>
          </v-list-group>
        </v-list>
      </v-list-group>
    </v-list>
    <v-list v-else class="text-body-2">
      <v-list-item v-for="(item, i) in data" :key="i" :to="item.route" class="link">
        {{ item.name }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
  import { useMain } from "@/stores/main"
  import { computed, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useDisplay } from 'vuetify'

  const { mdAndDown } = useDisplay()

  const route = useRoute()

  const mainStore = useMain()

  const title = computed(() => {
    const parts = route.path.split('/')
    return parts.filter(part => part.length > 0)[0]
  })

  const data = computed(() => {
    if(title.value === 'tactics' || title.value === 'techniques') {
      return mainStore.$state.data.objects.tactics
    }
    if(title.value === 'studies') {
      return mainStore.$state.data.objects['case-studies']
    }
    if(title.value === 'mitigations') {
      return mainStore.$state.data.objects.mitigations.ATLAS
    }
    return mainStore.$state.data.matrices
  })

  const open = ref([title.value])

  watch(title, (newVal) => {
    open.value = [newVal]
  })

  if(mdAndDown.value) {
    // initially hide drawer on smaller screens
    mainStore.$state.doShowNavDrawer = false
  }

  const doShowNavDrawer = computed({
    // getter
    get() {
      return mainStore.$state.doShowNavDrawer
    },
    // setter
    set(value) {
      mainStore.TOGGLE_NAV_DRAWER(value)
    }
  })

  const expandedTactics = ref([])

  const techniqueID = computed(() => {
    if(route.params.objectTypePlural === 'techniques' && route.params.id) {
      return route.params.id
    }
    return null
  })

  watch(techniqueID, (newVal) => {
    if(title.value === 'techniques') {
      expandedTactics.value = []
      data.value.ATLAS.forEach((tactic) => {
        tactic.techniques.forEach((technique) => {
          if(newVal === technique.id) {
            expandedTactics.value.push(tactic.name)
          }
          if(technique.subtechniques) {
            technique.subtechniques.forEach((subtechnique) => {
              if(subtechnique.id === newVal) {
                expandedTactics.value.push(tactic.name)
              }
            })
          }
        })
      })
    }
  })

</script>

<style>
  .v-list-group__items {
      --indent-padding: 0px !important;
  }

  .link {
    color: #1976d2 !important;
  }
</style>