<template>
  <v-alert

  />
</template>
<script>
export default {
  name: 'CaseStudyBuilderAlert',
  props: {
    initialDoShow: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      doShow: false
    }
  }
}
</script>
