<script lang="ts" setup>
import PostCard from "@/components/PostCard.vue";
import { usePripoStore } from "@/stores";
import { storeToRefs } from "pinia";
const { blogs } = storeToRefs(usePripoStore());

localStorage.setItem("currentTitle", "Pripo");
</script>
<template>
  <main v-if="blogs.result?.blogs">
    <PostCard
      v-for="blog in blogs.result.blogs"
      :key="blog.id"
      :id="blog.id"
      :title="blog.title"
      :content="blog.content"
      :user="blog.user"
      :tags="blog.tags"
      :date_posted="blog.date_posted"
      :is-public="blog.is_public"
      :comment="blog.comments || null"
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
