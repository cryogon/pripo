<script setup lang="ts"></script>
<template>
  <div class="post-item">
    <img
      src="https://avatars.githubusercontent.com/u/75153974?v=4"
      alt="user-avatar"
      referrerpolicy="no-referrer"
      class="user-avatar"
    />
    <div class="user-info">
      <span class="name">Jatin Thakur</span>
      <span class="username">@cryogon</span>
    </div>
    <div class="options">
      <button class="follow">Follow</button>
    </div>
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
  align-items: center;
  column-gap: 10px;
  padding-inline-end: 1rem;
  .user-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .name {
      font-weight: 600;
    }
    .username {
      color: var(--accent-color);
      font-size: 14px;
    }
  }
  .options {
    margin-inline-start: auto;
    .follow {
      margin: 0.4rem;
      padding: 0.4rem 1.4rem;
      border-radius: 2rem;
      background-color: var(--accent-color);
      cursor: pointer;
      outline: none;
      border: none;
      color: var(--text-color);
    }
  }
}
</style>
