<script setup lang="ts">
import { useTimeAgo } from "@vueuse/core";
import HeartIcon from "./Icons/HeartIcon.vue";
defineProps<{
  id: number;
  title: string;
  posted_at: string;
  favorites: number;
  visibility: boolean;
}>();
</script>
<template>
  <div class="post-item">
    <router-link :to="`/posts/${id}`">
      <div>
        <p class="title">{{ title }}</p>
        <div class="info">
          <span class="posted-on info-item">{{
            useTimeAgo(posted_at).value
          }}</span>
          <span class="like-count info-item">
            <HeartIcon />
            {{ favorites }}</span
          >
          <span class="visibility-status info-item">{{
            visibility ? "public" : "private"
          }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>
<style scoped lang="scss">
.post-item {
  background-color: #ffffff10;
  padding: 0.3rem 1rem;
  padding-inline-end: 0;
  border-radius: 0.6rem;
  display: flex;
  margin-block: 0.8rem;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 400ms;
  &:hover {
    cursor: pointer;
    // box-shadow: inset 0.2rem 0 var(--accent-color);
    background-color: #00000020;
  }
  .info {
    display: flex;
    align-items: center;
    gap: 1rem;
    opacity: 0.6;

    .info-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
  a {
    padding: 0;
    color: var(--color-text);
  }
}
</style>
