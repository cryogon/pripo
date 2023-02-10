<script setup lang="ts">
defineProps<{
  description: string;
}>();
</script>
<template>
  <main class="alert-box" role="alert">
    <span>{{ description }}</span>
  </main>
</template>
<style scoped lang="scss">
.alert-box {
  position: fixed;
  max-width: 50rem;
  background-color: var(--accent-color);
  padding: 1rem;
  animation: fadein 300ms linear;
  border-radius: 2rem;
  top: 4rem;
  left: 50%;
  z-index: 100000;
  opacity: 1;
  transform: translateX(-50%);
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style>
