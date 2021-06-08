<template>
<div>
  <v-card flat color="light-blue lighten-5">
    <v-card-title>{{ title }} </v-card-title>
    <v-card-text>
      <p>
        {{ description }}
      </p>
      <p>
        For more information, contact <a href="contactEmail">{{ contactEmail }}</a>
      </p>
    </v-card-text>
  </v-card>
</div>
</template>
<script>
export default {
  name: 'Annoucement',
  data: () => ({
    title: 'MITRE & Microsoft Host the 6th Annual Security Data Science Colloquium on Adversarial Machine Learning',
    description: 'On June 29, 2021, MITRE and Microsoft will continuing growing this critical focus on AI security by co-hosting the 6th annual Security Data Science Colloquium, bringing attention to the threats, vulnerabilities, and challenges of securing machine learning systems and benefiting industry, academia, and government alike. The Colloquium will feature presentations from a wide variety of organizations and leaders across the field of AI security, including recent data and research results on AI threats, vulnerabilities, and mitigation techniques.',
    contactEmail: 'atlas@mitre.org'
  })
}
</script>
