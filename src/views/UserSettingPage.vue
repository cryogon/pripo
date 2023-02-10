<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue";
const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>
<template>
  <main v-if="offlineReady || needRefresh" class="pwa-toast" role="alert">
    <div class="message">
      <span v-if="offlineReady"> App ready to work offline </span>
      <span v-else>
        New content available, click on reload button to update.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">Reload</button>
    <button @click="close">Close</button>
  </main>
  <main role="alert" v-else>Nothing Here</main>
</template>
<style scoped lang="scss"></style>
