<template>
  <div>
    <PageSectionTitle :pageTitle="title" />
    <div class="text-h5">License</div>
    <p>
      Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
      except in compliance with the License. You may obtain a copy of the License at
      <a href="http://www.apache.org/licenses/LICENSE-2.0"
        >http://www.apache.org/licenses/LICENSE-2.0</a
      >.
    </p>
    <p>
      Unless required by applicable law or agreed to in writing, software distributed under the
      License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
      either express or implied. See the License for the specific language governing permissions and
      limitations under the License.
    </p>
    <p>
      This project makes use of MITRE ATT&CK<sup>&reg;</sup>.
      <br />
      ATT&CK<sup>&reg;</sup> Terms of Use -
      <a href="https://attack.mitre.org/resources/terms-of-use/"
        >https://attack.mitre.org/resources/terms-of-use/</a
      >
    </p>
  </div>
</template>

<script setup>
import PageSectionTitle from '@//components/PageSectionTitle.vue'
import { ref } from 'vue'
const title = ref('Terms of Use')
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
