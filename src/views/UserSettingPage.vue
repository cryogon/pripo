<script setup lang="ts">
import { ref, watch } from "vue";

const imgUrl = ref();
function handleImageUpload(e: any) {
  if (e.target.files) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      console.log("loaded");
      const base64_data = window.btoa(reader.result as string);
      console.log(base64_data);
      imgUrl.value = base64_data;
    };
    reader.readAsBinaryString(file);
  }
}

watch(imgUrl, () => {
  fetch("http://localhost:5550/", {
    method: "POST",
    mode: "no-cors",
    body: imgUrl.value,
  });
});
</script>
<template>
  <main class="settings-container">
    <input
      type="file"
      name=""
      id=""
      @change="handleImageUpload"
      accept="image/*"
    />
    <br />
    <img :src="(imgUrl as string)" alt="dude" />
  </main>
</template>
<style scoped lang="scss">
.settings-container {
  padding: 1rem 20rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
