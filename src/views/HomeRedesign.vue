<template>
  <div>
    <v-container
    fluid
    class="hero-image">

    <v-row align="center" justify="center" style="height: 100%">
      <!-- <v-spacer></v-spacer> -->
      <v-col cols="2" class="ml-5">
        <v-img src="@/assets/atlas-graphic-white.png"></v-img>
      </v-col>

      <v-col cols="7" class="text-white">

        <div class="text-h1 font-weight-medium">
          MITRE ATLAS™
        </div>

        <div class="text-h4 text-uppercase mt-3">
          <span class="text-lightBlue">
            Navigating
          </span>
          the landscape of threats to machine learning systems
        </div>
      </v-col>

      <v-spacer></v-spacer>
    </v-row>

  </v-container>

  <v-container class="panel">
    <v-row align="center" justify="center" style="height: 100%">
      <v-col>
        <v-card flat>
          <v-card-title>
            <div class="text-h4">
            About  MITRE ATLAS™
            </div>
          </v-card-title>
          <v-card-text>
                 <div class="text-body-1 my-5">
        ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems) is a globally accessible, living knowledge base of adversary tactics and techniques against Al-enabled svstems based on real-world attack observations and realistic demonstrations from Al red teams and security groups.
      </div>
          </v-card-text>
          <v-card-actions>
            <v-btn class="" variant="outlined" href="https://atlas.mitre.org/pdf-files/MITRE_ATLAS_Fact_Sheet.pdf"  append-icon="mdi-chevron-right">Get the fact sheet</v-btn>

          </v-card-actions>
        </v-card>

    </v-col>

       <v-col cols="1"></v-col>

<v-col>
      <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/3FN9v-y-C-w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </v-col>
    </v-row>
  </v-container>

  <v-container class="panel" fluid style="background-color: #0D2F4F;">
    <v-row class="text-white" align="center" justify="center" style="height: 100%;">
      <v-col cols="1"></v-col>

      <v-col>
        <div class="text-h4">
          ATLAS is modeled after and complementary to <span class="text-lightBlue">MITRE ATT&CK®</span>, raising awareness of the rapidly evolving vulnerabilities of <span class="text-lightBlue">Al-enabled systems</span> as they extend beyond cyber.
        </div>
      </v-col>

      <v-col cols="1"></v-col>

      <v-col>
        <v-row class="mb-10">
          <v-col>
            <v-row justify="center">
              <div :class="metricValueClass">
                14
              </div>
            </v-row>
            <v-row justify="center">
              <div :class="metricTextClass">
                tactics
              </div>
            </v-row>
          </v-col>

          <v-col>
            <v-row justify="center">
              <div :class="metricValueClass">
                82
              </div>
            </v-row>
            <v-row justify="center">
              <div :class="metricTextClass">
                techniques
              </div>
            </v-row>
          </v-col>

          <v-col>
            <v-row justify="center">
              <div :class="metricValueClass">
                20
              </div>
            </v-row>
            <v-row justify="center">
              <div :class="metricTextClass">
                mitigations
              </div>
            </v-row>
          </v-col>

          <v-col>
            <v-row justify="center">
              <div :class="metricValueClass">
                22
              </div>
            </v-row>
            <v-row justify="center">
              <div :class="metricTextClass">
                case studies
              </div>
            </v-row>
          </v-col>

        </v-row>


        <v-row justify="center" class="mt-10">
          <v-btn class="" variant="tonal" to="/matrices/ATLAS" append-icon="mdi-chevron-right" size="x-large">See the full ATLAS Matrix</v-btn>
        </v-row>
      </v-col>

      <v-col cols="1"></v-col>
    </v-row>
  </v-container>

    <v-container class="panel">
    <v-row align="center" justify="center" style="height: 100%">
      <v-row>
           <div class="text-h3 my-10">News and Resources</div>
      </v-row>
      <v-row>
      <v-col>


        <v-card  width="400px">
          <v-img src="https://www.ncsi.com/wp-content/uploads/2023/09/CDAO-Advantage2024-1920x470-1-1.png" height="200px" cover></v-img>
          <v-card-title>
            <div class="text-h4">
            Advantage DoD 2024
            </div>
          </v-card-title>
          <v-card-subtitle>
            February 2024
          </v-card-subtitle>
          <v-card-text>
                 <!-- <div class="text-body-1 my-5">
        This event, hosted by the Chief Digital and AI Office (CDAO) invites key data leaders and developers from government, industry, and academia to join together and discuss and build the future of cutting-edge data, analytics, and AI - guiding the enablement of the U.S. military's enduring decision advantage.
      </div> -->
        Join the ATLAS team to discuss and build the future of cutting-edge data, analytics, and AI.
          </v-card-text>
          <v-card-actions>

            <v-btn class="" variant="text" href="https://www.ncsi.com/event/cdao/"  append-icon="mdi-chevron-right">Learn more</v-btn>
          </v-card-actions>
        </v-card>

       </v-col>


             <v-col>


        <v-card  max-width="400px">
          <v-img src="https://images.squarespace-cdn.com/content/v1/5a908c7daa49a1739621702c/1519530147447-UT25L4OSCJSHQQ39IZNC/P6230039.png?format=2500w" height="200px" cover></v-img>
          <v-card-title>
            <div class="text-h4">
            Days of Shecurity
            </div>
          </v-card-title>
          <v-card-subtitle>
            April 2024
          </v-card-subtitle>
          <v-card-text>
                 <!-- <div class="text-body-1 my-5">
        Day of Shecurity is a free-to-attend interactive one-day conference that originally launched in 2017 in San Francisco for women in technology interested in cybersecurity. Day of Shecurity launched in Boston in 2019 and held a virtual, location-agnostic conferences in 2021. The event is an effort by Secure Diversity, the Lookout Foundation, Day of Shecurity Core Team, and various organizations that believe that diversity & inclusion matter in our industry.
      </div> -->
            ATLAS will be hosting an introduction to AI red teaming for women in technology interested in cybersecurity!
          </v-card-text>
          <v-card-actions>
            <v-btn class="" variant="text" href="https://www.dayofshecurity.com" append-icon="mdi-chevron-right">Learn more</v-btn>

          </v-card-actions>
        </v-card>

       </v-col>

                    <v-col>

        <v-card  max-width="400px">
          <v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" height="200px" cover></v-img>
          <v-card-title>
            <div class="text-h4">
            LLM Content Update
            </div>
          </v-card-title>
          <v-card-subtitle>
            October 2023
          </v-card-subtitle>
          <v-card-text>
                 <!-- <div class="text-body-1 my-5">
        Day of Shecurity is a free-to-attend interactive one-day conference that originally launched in 2017 in San Francisco for women in technology interested in cybersecurity. Day of Shecurity launched in Boston in 2019 and held a virtual, location-agnostic conferences in 2021. The event is an effort by Secure Diversity, the Lookout Foundation, Day of Shecurity Core Team, and various organizations that believe that diversity & inclusion matter in our industry.
      </div> -->
            ATLAS now includes new large language model (LLM) tactics, techniques, case studies, and updated mitigations, including techniques such as <router-link to="/techniques/AML.T0051">prompt injections</router-link> and <router-link to="/techniques/AML.T0054">LLM jailbreaks</router-link>.
          </v-card-text>
          <v-card-actions>
            <v-btn class="" variant="text" to="/resources/updates" append-icon="mdi-chevron-right">Learn more</v-btn>

          </v-card-actions>
        </v-card>

</v-col>

       </v-row>

    </v-row>
  </v-container>


  </div>
</template>

<script setup>
import { ref } from 'vue'

const metricValueClass = 'text-h2 text-lightBlue'
const metricTextClass = 'text-subtitle-1 font-weight-bold text-uppercase'
</script>

<style scoped>
.panel {
  height: 50vh;
}
.hero-image {
  background:
    /* linear-gradient(
      rgba(53, 53, 53, 0.25) 0%,
      rgba(17, 4, 4, 0.5) 50%,
      rgba(61, 61, 61, 0.25) 100%
    ), */
    /* linear-gradient(#0D2F4F, #005B94), */
    linear-gradient(
      90deg, /*L to R*/
      rgba(13, 47, 79, 0.85) 40%, /* MITRE Navy */
      rgba(13, 47, 79, 0.05)
    ),
    linear-gradient(
      /*Top to Bottom, to align hero top color to app bar*/
      rgba(13, 47, 79, 0.9),
      rgba(13, 47, 79, 0.1) 15%
    ),
    url('@/assets/network.jpeg');
  background-repeat: no-repeat;
  background-size: cover;
  height: 50vh
}
</style>