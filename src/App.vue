<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
const { isAuthenticated } = useAuth0();

onMounted(() => {
  setTimeout(() => {
    if (!isAuthenticated) {
      localStorage.removeItem("token");
      window.location.reload();
    }
  }, 500);
});
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
