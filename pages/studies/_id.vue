<template>
  <div>
    <div class="text-h2 pt-10">{{ study.name }}</div>

    <v-row>
      <v-col cols="4">

        <page-section-title text="Summary" />

        <!--
        <div class="text-body-1 pt-5">{{ study.summary }}</div>

        <page-section-title text="Sources" />
        <p>{{ study.sources }}</p>

        <page-section-title text="Reported by" />
        <p>{{ study['reported-by'] }}</p>

        <page-section-title text="Verified by" />
        <p>{{ study['verified-by'] }}</p>
        -->
         <v-card flat>

          <v-card-text>
            <div class="text-body-1 text--primary font-weight-medium">
            {{ study.summary }}
            </div>
          </v-card-text>

          <v-subheader>Sources</v-subheader>
            <v-list-item>
              <v-list-item>
                <v-list-content>
                  <v-list-item-content>
                    {{ study.sources }}
                  </v-list-item-content>
                </v-list-content>
              </v-list-item>
            </v-list-item>

          <v-list subheader>
            <v-subheader>Date</v-subheader>
            <v-list-item>
              <v-list-item>
                <v-list-content>
                  <v-list-item-content>
                    {{ study['incident-date'].toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) }}
                  </v-list-item-content>
                </v-list-content>
              </v-list-item>
            </v-list-item>

            <v-subheader>Reported by</v-subheader>
            <v-list-item>
              <!-- <v-list-item-avatar color="secondary">
                <span class="white--text">M</span>
              </v-list-item-avatar> -->
              <v-list-content>
                <v-list-item-content>
                  {{ study['reported-by'] }}
                </v-list-item-content>
              </v-list-content>
            </v-list-item>

            <v-subheader>Verified by</v-subheader>
            <v-list-item>
              <!-- <v-list-item-avatar color="secondary">
                <span class="white--text">M</span>
              </v-list-item-avatar> -->
              <v-list-content>
                <v-list-item-content>
                  {{ study['verified-by'] }}
                </v-list-item-content>
              </v-list-content>
            </v-list-item>

          </v-list>
        </v-card>

      </v-col>
      <v-col cols="8">

        <page-section-title text="Procedure" />
        <procedure-timeline :study="study" class="mt-5" />

      </v-col>
    </v-row>

  </div>
</template>

<script>
export default {
  computed: {
    study () {
      return this.$store.getters.getStudyById(this.$route.params.id)
    }
  }
}
</script>
