<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import AlertBox from "./components/AlertBox.vue";
import { useEmitter } from "./composables/EventEmitter";
import ConfirmBox from "./components/ConfirmBox.vue";
import SearchBar from "./components/SearchBar.vue";
import router from "./router";
const emitter = useEmitter();
const { isAuthenticated } = useAuth0();
const alertDescription = ref("");
const searchBarVisible = ref(false);

router.afterEach(() => {
  searchBarVisible.value = false;
});
onMounted(() => {
  setTimeout(() => {
    if (!isAuthenticated.value && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.location.reload();
    }
  }, 3000);

  emitter.on("alert", (d) => {
    alertDescription.value = d as string;
    setTimeout(() => {
      alertDescription.value = "";
    }, 3000);
  });
  //For Search Bar Toggle
  document.addEventListener("keydown", (e) => {
    if (!searchBarVisible.value && e.ctrlKey && e.key.toLowerCase() === "k") {
      e.preventDefault();
      searchBarVisible.value = true;
    }
    if (searchBarVisible.value && e.key === "Escape") {
      e.preventDefault();
      searchBarVisible.value = false;
    }
  });
});
</script>

<template>
  <AlertBox :description="alertDescription" v-show="alertDescription" />
  <ConfirmBox />
  <NavBar />
  <SearchBar v-if="searchBarVisible" />
  <RouterView />
</template>

<style>
::selection {
  background-color: rgba(91, 198, 77, 0.399);
}
</style>
