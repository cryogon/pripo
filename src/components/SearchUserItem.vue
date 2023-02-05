<script setup lang="ts">
import { useEmitter } from "@/composables/EventEmitter";
import type { User } from "@/types";

defineProps<{
  user: User | any;
}>();
const emitter = useEmitter();
function warning() {
  emitter.emit("alert", "This feature is not available yet");
}
</script>
<template>
  <div class="user-item">
    <router-link :to="`users/${user.username}`">
      <img
        :src="user.profile_picture"
        alt="user-avatar"
        referrerpolicy="no-referrer"
        class="user-avatar"
      />
    </router-link>
    <router-link :to="`users/${user.username}`">
      <div class="user-info">
        <span class="name">{{ user.name }}</span>
        <span class="username">{{ "@" + user.username }}</span>
      </div>
    </router-link>
    <div class="options">
      <button class="follow" @click="warning">Follow</button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.user-item {
  margin-block: 0.7rem 1.5rem;
  min-height: 4rem;

  background-color: var(--color-background);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding-inline-end: 1rem;
  a {
    padding: 0;
    .user-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      cursor: pointer;
    }
    color: var(--color-text);
    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      .name {
        font-weight: 600;
      }
      .username {
        color: var(--accent-color);
        font-size: 14px;
      }
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
