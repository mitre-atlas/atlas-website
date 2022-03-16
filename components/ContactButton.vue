<template>
  <div>
        <v-btn
            :color= "colorProp"
            dark
            large
            :href = "linkProp"
            target = "_blank"
        >
        <v-icon left>
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
