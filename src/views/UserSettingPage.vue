<script setup lang="ts">
import { useFileSystemAccess } from "@vueuse/core";
import { watch } from "vue";
const { open, data, file, fileMIME } = useFileSystemAccess({});
watch(data, () => {
  fetch("http://localhost:5550/file", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      data: data.value,
      name: file.value?.name,
    }),
  });
});
</script>
<template>
  <main class="settings-container">
    <button @click="open()">Upload Image</button>
  </main>
</template>
<style scoped lang="scss">
.settings-container {
  padding: 1rem 20rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
