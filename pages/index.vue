<template>
  <div>
    <page-title>{{ title }}</page-title>

    <v-row>
      <p class="mb-10">
      The {{ $config.name.short }} Threat Matrix is a knowledge base of adversarial tactics and techniques for machine learning (ML) security based on <a href="https://attack.mitre.org" style="text-decoration: none;">the ATT&CK framework</a>.
      Along with case studies demonstrating attacks on ML systems, this knowledge base enables machine learning and security communities to better understand ML threats.
      </p>

    </v-row>

  <!--Two-row list, horizontal bar, outlined -->
    <!-- <v-row justify="center">
          <v-card outlined class="mb-10 mt-2 pa-3">
            <v-chip color="transparent" nuxt=true class="ma-1"><NuxtLink to="/page/adversarial-ml-101" style="text-decoration: none;">Adversarial ML 101</NuxtLink></v-chip>
            <v-chip color="transparent" nuxt=true class="ma-1"><NuxtLink to="/resources/contribute" style="text-decoration: none;">Contribute</NuxtLink></v-chip>
            <hr>
            <v-chip color="transparent" nuxt=true class="ma-1"><NuxtLink to="/resources/feedback" style="text-decoration: none;">Contact Us</NuxtLink></v-chip>
            <v-chip color="transparent" class="ma-1" :href="`${$config.navigator_url}`"><span>View on ATT&CK Navigator</span></v-chip>
          </v-card>
    </v-row> -->

  <!--Vertical list, outlined-->
    <!-- <v-row justify="center">
        <v-card outlined rounded="xl" class="mb-10 link-box">
          <v-list class="link-box">
            <v-list-item-group class="pa-3">
                <v-list-item nuxt to="/page/adversarial-ml-101"><span class="link-box">Adversarial ML 101</span></v-list-item>
                <v-list-item nuxt to="/resources/contribute"><span class="link-box">Contribute</span></v-list-item>
                <v-list-item nuxt to="/resources/feedback"><span class="link-box">Contact Us</span></v-list-item>
                <v-list-item class="ma-1" :href="`${$config.navigator_url}`"><span class="link-box">View on<span class="attack-style"> ATT&CK </span>Navigator</span></v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
    </v-row> -->

  <!--Horizonal list, chip items-->
    <v-row justify="center">
        <v-card rounded="lg" outlined class="mb-10 mt-3 link-box">
          <v-list class="link-box">
            <v-list-item-group class="pa-3">
                <v-chip outlined nuxt=true class="ma-1" to="/page/adversarial-ml-101">Adversarial ML 101</v-chip>
                <v-chip outlined nuxt=true class="ma-1" to="/resources/contribute">Contribute</v-chip>
                <v-chip outlined nuxt=true class="ma-1" to="/resources/feedback">Contact Us</v-chip>
                <v-chip outlined class="ma-1" :href="`${$config.navigator_url}`"><span>View on ATT&CK Navigator</span></v-chip>
            </v-list-item-group>
          </v-list>
        </v-card>
    </v-row>

    <v-row>
      <matrix-attack-style :matrix="this.$store.getters.getMatrix" />
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    title: 'Adversarial Machine Learning Threat Matrix'
  })
}
</script>

<style>

.row {
  overflow: auto;
}

.attack-style {
  color: #c63f1f;
  white-space: pre;
}

span.link-box {
  background-color: transparent;
}

.link-box {
  background-color: black;
}

</style>
