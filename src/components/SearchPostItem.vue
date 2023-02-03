<script setup lang="ts">
import type { Blog } from "@/types";
import PostIcon from "./Icons/PostIcon.vue";
import StarIcon from "./Icons/StarIcon.vue";
defineProps<{
  post: Blog;
}>();
</script>
<template>
  <div class="post-item">
    <PostIcon />
    <div class="post-info">
      <span class="title">{{ post.title }}</span>
      <span class="content">{{
        JSON.parse(post.content).substring(0, 100) + "..."
      }}</span>
    </div>
    <div class="options">
      <div class="likes">
        <StarIcon class="icon" />
        <span class="count">{{ post.likes }}</span>
      </div>
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
  column-gap: 20px;
  padding-inline: 1rem;
  .user-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  .post-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
      font-weight: 600;
    }
    .content {
      color: var(--accent-color);
      font-size: 14px;
    }
  }
  .options {
    margin-inline-start: auto;
    .likes {
      display: flex;
      align-items: center;
      gap: 5px;
      .icon {
        height: 1.5rem;
        width: 2rem;
        stroke-width: 2;
      }
    }
  }
}
</style>
