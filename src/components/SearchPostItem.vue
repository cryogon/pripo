<script setup lang="ts"></script>
<template>
  <div class="post-item">
    <img
      src=""
      alt="user-avatar"
      referrerpolicy="no-referrer"
      class="user-avatar"
    />
  </div>
</template>
<style scoped lang="scss">
.post-item {
  margin-block: 0.7rem 1.5rem;
  min-height: 4rem;
  cursor: pointer;
  background-color: var(--color-background);
  padding: 0.5rem;
  display: flex;
  column-gap: 10px;
  .user-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
}
</style>
