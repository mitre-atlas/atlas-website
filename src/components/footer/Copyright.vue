<template>
  <v-container>
    <div class="my-5">
      <div>&copy; 2021-2025 The MITRE Corporation. All Rights Reserved.</div>
      <div>Approved for Public Release; Distribution Unlimited. Case Number 21-2363.</div>
      <div>
        MITRE ATLAS&trade; and MITRE ATT&CK<sup>&reg;</sup> are a trademark and registered trademark
        of The MITRE Corporation.
      </div>

      <div class="mt-2">
        <a href="https://www.mitre.org/privacy-policy">Privacy Policy</a>
        |
        <router-link to="/terms">Terms of Use</router-link>

        <span v-if="VITE_OSANO_SCRIPT">
          |
          <a href="#" onclick="Osano.cm.showDrawer('osano-cm-dom-info-dialog-open')"
            >Manage Cookies</a
          >
        </span>
      </div>
      <!-- <v-btn
        v-if="VITE_OSANO_SCRIPT"
        class="mt-6"
        variant="outlined"
        onclick="Osano.cm.showDrawer('osano-cm-dom-info-dialog-open')"
      >
        Manage Cookies
      </v-btn> -->
      <!-- <v-btn
        to="/resources/contact"
        color="navy"
        flat
      >Contact Us</v-btn> -->
    </div>
  </v-container>
</template>

<script setup>
const { VITE_OSANO_SCRIPT } = import.meta.env
</script>

<style>
.osano-cm-widget {
  display: none;
}
</style>
