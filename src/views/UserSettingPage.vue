<script setup lang="ts">
import { useTimeAgo } from "@vueuse/core";
// const t = useTimeAgo("2021");
</script>
<template>
  <main>{{ useTimeAgo("2021").value }}</main>
</template>
<style scoped lang="scss"></style>
