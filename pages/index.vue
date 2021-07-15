<template>
  <div>
    <v-alert
      color="blue"
      dismissible
      text
      type="info"
    >
      MITRE & Microsoft are hosting the 6th Annual Security Data Science Colloquium on Adversarial Machine Learning on June 29th.
      Learn more under <nuxt-link to='/resources/info'>general information</nuxt-link>!
    </v-alert>

    <!-- <div class="text-h2 my-5 text-center">{{ $config.name.short }}</div>
    <div class="text-h4 mb-5 text-center">{{ $config.name.long }}</div> -->
    <!-- <page-title>{{ $config.name.short }}</page-title> -->

    <v-row>
      <v-col cols="12">
        <div class="my-10">
        <!-- <p>
        MITRE {{ $config.name.short }} is a knowledge base of adversarial tactics and techniques for machine learning (ML) security based on the
        <a href="https://attack.mitre.org" style="text-decoration: none;">MITRE ATT&CK<sup>&reg;</sup> framework</a>.
        Along with case studies demonstrating attacks on ML systems, this knowledge base enables machine learning and security communities to better understand ML threats.
        </p> -->
        <p>
        MITRE {{ $config.name.short }}, {{ $config.name.long }}, is a knowledge base of adversary tactics, techniques, and case studies for machine learning (ML) systems based on real-world observations, demonstrations from ML red teams and security groups, and the state of the possible from academic research. ATLAS is modeled after the <a href="https://attack.mitre.org" >MITRE ATT&CK<sup>&reg;</sup> framework</a> and its tactics and techniques are complementary to those in ATT&CK.
        </p>
        <!-- <v-expand-transition> -->
        <v-fade-transition>
        <!-- <v-scroll-y-reverse-transition> -->
        <hover-preview
          @keep-preview="keepPreviewEnabled => { this.keepPreviewEnabled = this.enablePreview = keepPreviewEnabled }"
          v-if="enablePreview || keepPreviewEnabled"
          :x="hoverPosition.x"
          :y="hoverPosition.y"
          :targetID="hoverTargetID"
          :delay="hoverDelay"
        ></hover-preview>
        <!-- </v-scroll-y-reverse-transition> -->
        </v-fade-transition>
        <!-- </v-expand-transition> -->
        <div @mousemove="setPreview" @mouseenter="setPreview" @mouseleave="setPreview" @wheel="setPreview">HELLO WORLD</div>
        <p>
        ATLAS enables <span @mousemove="setPreview" @mouseenter="setPreview" @mouseleave="setPreview" @wheel="setPreview">researchers</span> to navigate the landscape of <NuxtLink to="resources/adversarial-ml-101">threats to machine learning systems</NuxtLink>. ML is increasingly used across a variety of industries. There are a growing number of vulnerabilities in ML, and its use increases the attack surface of existing systems. We developed ATLAS to raise awareness of these threats and present them in a way familiar to security researchers.
        </p>
        <!-- <homepage-links /> -->
         <!-- <page-title class="mt-10 text-center">{{ $config.name.short }}</page-title> -->
        <img src="~/assets/ATLAS_black.png" height="40" class="d-block mx-auto" />
      </div>
      <div>
        <p>
          The ATLAS Matrix below shows the progression of tactics used in attacks as columns from left to right,
          with ML techniques belonging to each tactic below. Click on links to learn more about each item, or view
           ATLAS tactics and techniques using the links at the top navigation bar.
        </p>

        </div>
      </v-col>
    </v-row>

    <v-row>
      <matrix-attack-style :matrix="this.$store.getters.getMatrix" />
    </v-row>
  </div>
</template>

<script>
// import HoverPreview from './HoverPreview.vue' components: { HoverPreview },
export default {
  data: ({ $config: { name } }) => ({
    title: `${name.long}`,

    enablePreview: false,
    keepPreviewEnabled: false,
    hoverPosition: { x: 0, y: 0 },
    mousePosition: { x: 0, y: 0 },
    isHovering: false,
    hoverDelay: 500,
    lastElementHTML: null, // change to diff by targetID
    hoverTargetID: 'AML.T0010.000'
  }),
  methods: {
    setPreview (event) {
      const eventName = event.type
      const element = event.target
      const elementPos = element.getBoundingClientRect()
      const elementHTML = element.innerHTML
      const disablePreviewEvents = ['mouseleave', 'wheel']
      const enablePreview = !disablePreviewEvents.includes(eventName)
      if (eventName === 'mousemove') { this.mousePosition = { x: event.pageX, y: event.pageY }; return }
      this.isHovering = enablePreview
      this.lastElementHTML = element.innerHTML
      console.log(`${eventName} set hover status to ${this.isHovering}`)
      setTimeout(function (that, event) {
        console.log(`${eventName} wants to set ${enablePreview}, hover status at ${that.isHovering}`)
        if ((this.lastElementHTML === elementHTML) && enablePreview !== that.isHovering) { return }
        if (enablePreview) {
          const x = that.mousePosition.x // + window.scrollX
          const y = elementPos.top + window.scrollY
          const gmm = that.enablePreview
          that.enablePreview = true
          if (gmm) { return }
          that.hoverPosition = { x, y }
        } else {
          that.enablePreview = false
        }
      }, this.hoverDelay, this, event)
    }
  }
}
</script>

<style scoped>

.row {
  overflow: auto;
}
/* .attack-style {
  color: #c63f1f;
  white-space: pre;
}

span.link-box {
  background-color: transparent;
}

.link-box {
  background-color: black;
} */
</style>
