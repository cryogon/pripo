<script setup lang="ts"></script>
<template>
  <div class="loading-screen"></div>
</template>
<style scoped lang="scss">
div.loading-screen {
  width: 10rem;
  height: 10rem;
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  background-color: var(--color-text);
  animation: anim infinite 2s;
  @keyframes anim {
    0% {
      border-radius: 0;
      rotate: 0;
    }
    50% {
      border-radius: 50%;
      rotate: 0.5turn;
    }
    100% {
      border-radius: 0;
      rotate: 0;
    }
  }
}
</style>
