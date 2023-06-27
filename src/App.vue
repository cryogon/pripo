<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue";
import { onMounted, ref } from "vue";
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import AlertBox from "./components/AlertBox.vue";
import { useEmitter } from "./composables/EventEmitter";
import ConfirmBox from "./components/ConfirmBox.vue";
import "highlight.js/styles/an-old-hope.css";
const emitter = useEmitter();
const { isAuthenticated } = useAuth0();
const alertDescription = ref("");

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
});
</script>

<template>
  <AlertBox :description="alertDescription" v-show="alertDescription" />
  <ConfirmBox />
  <NavBar />
  <RouterView />
</template>

<style>
::selection {
  background-color: rgba(91, 198, 77, 0.399);
}
</style>
