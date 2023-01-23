<script lang="ts" setup>
import PostCard from "@/components/PostCard.vue";
import { useQuery } from "@vue/apollo-composable";
import { GET_ALL_BLOGS } from "@/graphql";

const blogs = useQuery(GET_ALL_BLOGS).result;
localStorage.setItem("currentTitle", "Pripo");
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
    <PostCard
      :id="100"
      :title="`title`"
      :content="JSON.stringify('Jatin')"
      :user="{ id: 10, username: 'unknown', profile_picture: 'n' }"
      :tags="[`blog.tags`]"
      :date_posted="new Date()"
      :is-public="false"
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
