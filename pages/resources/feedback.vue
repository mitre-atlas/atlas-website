<template>
  <div>
    <page-title>{{ title }}</page-title>

    <!-- <page-section-title>Contact Us</page-section-title> -->

    For private comments/discussions and how organizations can get involved in the effort, please email <a :href="contactEmailLink"> {{ contactEmail }} </a>.
    <br><br>
    For {{ mitreTitle }} matrix and website feedback, please see the <NuxtLink to="/resources/contribute">
      Contribute
    </NuxtLink> page.

    <page-section-title>Mailing List</page-section-title>

    <p>
      For discussions around {{ shortName }}, we invite everyone to <a href="https://groups.google.com/forum/#!forum/advmlthreatmatrix/join">join our Google Group</a>.
    </p>

    For general questions/comments/discussion, our public email group is <a href="mailto:advmlthreatmatrix-core@googlegroups.com">advmlthreatmatrix-core@googlegroups.com</a>. This emails all the members of the distribution group.
    <br><br>

    <v-alert text type="info">
      Google Groups generally defaults to your personal email. If you would rather access this forum using your corporate email (as opposed to your gmail), you can create a Google account using your corporate email before joining the group.
      Also most email clients route emails from Google Groups into "Other"/"Spam"/"Forums" folder. So, you may want to create a rule in your email client to have these emails go into your inbox instead.
    </v-alert>
  </div>
</template>
<script>
export default {
  data: ({ $config: { name } }) => ({
    shortName: name.short,
    title: 'Contact Us',
    mitreTitle: name.mitre
  }),
  head () {
    return {
      title: `${this.title} | ${this.mitreTitle}`
    }
  },
  computed: {
    contactEmail () {
      return this.$config.contact_email
    },
    contactEmailLink () {
      return 'mailto:' + this.$config.contact_email
    }
  }

}
</script>
