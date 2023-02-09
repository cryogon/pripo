<script lang="ts" setup>
import PostCard from "@/components/PostCard.vue";
import { useQuery } from "@vue/apollo-composable";
import { GET_ALL_BLOGS } from "@/graphql";
import LoadingScreen from "../components/LoadingScreen.vue";
const {
  result: blogs,
  onError,
  loading,
  fetchMore,
} = useQuery(GET_ALL_BLOGS, { offset: 0, limit: 6 });
const isOnline = navigator.onLine;
localStorage.setItem("currentTitle", "Pripo");
onError((e) => {
  console.error(e);
  console.error("Some Error Occured! Try to refetch");
});

function fetchMoreBlogs() {
  fetchMore({
    variables: { offset: blogs.value.blogs.length },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      // No new feed posts
      if (!fetchMoreResult) return previousResult;

      // Concat previous feed with new feed posts
      return {
        ...previousResult,
        blogs: [...previousResult.blogs, ...fetchMoreResult.blogs],
      };
    },
  });
}
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

    <!-- <div v-if="loading" role="text" class="load-more fetching">Fetching...</div>
    <div @click="fetchMoreBlogs" class="load-more" role="button" v-else>
      Load More
    </div> -->
  </main>
  <main v-else-if="!isOnline">You are currently Offline</main>
  <LoadingScreen v-else />
</template>
<style scoped lang="scss">
main {
  transition: 400ms;
  display: flex;
  padding: 2rem 10vw;
  gap: 2rem;
  flex-direction: column;
  .load-more {
    place-self: center;
    background-color: var(--input-box-background);
    padding: 0.5rem;
    border-radius: 1rem;
    cursor: pointer;
    &.fetching {
      cursor: wait;
    }
  }
}
@media (max-width: 600px) {
  main {
    padding: 1rem;
  }
}
</style>
