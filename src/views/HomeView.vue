<script lang="ts" setup>
import PostCard from "@/components/PostCard.vue";
import { useQuery } from "@vue/apollo-composable";
import { GET_ALL_BLOGS } from "@/graphql";

const { result: blogs, onError } = useQuery(GET_ALL_BLOGS);
localStorage.setItem("currentTitle", "Pripo");
onError(() => {
  console.error("Some Error Occured! Try to refetch");
});
</script>
<template>
  <main v-if="blogs?.blogs">
    <PostCard
      v-for="blog in blogs.blogs"
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
  padding: 2rem 10vw;
  gap: 2rem;
  flex-direction: column;
}
@media (max-width: 600px) {
  main {
    padding: 1rem;
  }
}
</style>
