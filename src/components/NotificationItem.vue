<script setup lang="ts">
import BellIcon from "./Icons/BellIcon.vue";
defineProps<{
  user: string;
  desc: string;
  content: string;
}>();
</script>
<template>
  <div class="link container">
    <BellIcon class="bell" />
    <div class="info">
      <span class="user">{{ user + " " }}</span>
      <span class="description"> {{ desc }}</span>
      <p class="content">{{ content }}</p>
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  padding: 0.1rem;
  color: var(--color-text);
  background-color: var(--dropdown-background);
  margin-block-end: 0.5rem;
  display: flex;
  gap: 10px;
  .user {
    font-weight: bolder;
  }
  .content {
    color: #dbff00;
  }
  .bell {
    width: 1.2rem;
    height: 2rem;
    align-self: flex-start;
  }
  .info {
    // line-height: 22px;
    padding-top: 0.4rem;
  }
}
</style>
