<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <NavBar />
  <RouterView />
</template>

<style>
::selection {
  background-color: rgba(91, 198, 77, 0.399);
}
</style>
