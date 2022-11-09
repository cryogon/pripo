<script lang="ts" setup>
import { usePripoStore } from "@/stores";
import PostCard from "@/components/PostCard.vue";
const store = usePripoStore();
localStorage.setItem("currentTitle", "Pripo");
</script>
<template>
  <main>
    <PostCard
      v-for="blog in store.blogs"
      :key="blog.id"
      :id="blog.id"
      :title="blog.title"
      :content="blog.content"
      :user-pfp="blog.userPfp"
      :username="blog.user"
      :tags="blog.tags"
      :date_posted="blog.date_posted"
      :is-public="blog.isPublic"
      :comment="blog.comment"
    />
  </main>
</template>
<style scoped>
main {
  transition: 400ms;
  display: flex;
  padding: 2rem;
  gap: 2rem;
  flex-direction: column;
  align-items: center;
}
@media (max-width: 600px) {
  main {
    padding: 1rem;
  }
}
</style>
