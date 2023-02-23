<script setup lang="ts">
defineProps<{
  description: string;
}>();
function isFailed(error: string) {
  return error.endsWith("!!!");
}
</script>
<template>
  <main
    class="alert-box"
    :class="{ failed: isFailed(description) }"
    role="alert"
  >
    <span>{{
      isFailed(description) ? description.replace("!!!", "") : description
    }}</span>
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
  &.failed {
    background-color: rgb(227, 123, 123);
  }
}
</style>
