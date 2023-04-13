<template>
  <div>
    <page-title>{{ title }}</page-title>
    <nuxt-content :document="content" class="tw-prose" />
  </div>
</template>

<script>
export default {
  async asyncData ({ $content }) {
    const content = await $content('adversarial-ml-101').fetch()
    return {
      content
    }
  },
  data: ({ $config: { name } }) => ({
    title: 'Adversarial Machine Learning 101',
    shortName: name.short,
    mitreTitle: name.mitre
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  }
}
</script>
