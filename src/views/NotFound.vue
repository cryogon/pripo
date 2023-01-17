<script setup lang="ts">
import router from "@/router";
</script>
<template>
  <main>
    <h1>Error 404</h1>
    <p>User Not Found</p>
    <span class="link" @click="router.push('/')"
      >Consider Going Back To Home Page</span
    >
  </main>
</template>
