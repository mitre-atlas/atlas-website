<template>
  <div>
        <v-btn
            class="ma-2 white--text pa-6"
            :color= "colorProp"
            light
            :href = "linkProp"
            target = "_blank"
        >
        <v-icon light size="35" class="ma-2 ml-0">
            {{icon}}
        </v-icon>
            {{buttonText}}
        </v-btn>
    </div>
</template>

<script>
export default {
  name: 'ContactButton',
  props: ['color', 'icon', 'buttonText', 'link'],
  computed: {
    colorProp () {
      return this.color
    },
    linkProp () {
      return this.link
    }
  }
}
</script>
