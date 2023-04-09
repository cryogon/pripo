<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-unused-vars */
import PostCardv2 from "@/components/PostCardv2.vue";
import { useQuery } from "@vue/apollo-composable";
import { GET_ALL_BLOGS } from "@/graphql";
import LoadingScreen from "../components/LoadingScreen.vue";
import { useOnline } from "@vueuse/core";
import { setMeta } from "@/utils";

setMeta({
  title: "Pripo",
  description: "A Platform where you can post anything anonymously",
});
const {
  result: posts,
  onError,
  fetchMore,
} = useQuery(GET_ALL_BLOGS, { offset: 0, limit: 6 });
const isOnline = useOnline();

onError((e) => {
  console.error(e);
  console.error("Some Error Occured! Try to refetch");
});

function fetchMoreBlogs() {
  fetchMore({
    variables: { offset: posts.value.blogs.length },
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
  <main v-if="posts?.blogs" class="main">
    <div class="container">
      <PostCardv2 v-for="post in posts.blogs" :key="post.id" :post="post" />
      <!-- <div v-if="loading" role="text" class="load-more fetching">Fetching...</div>
        <div @click="fetchMoreBlogs" class="load-more" role="button" v-else>
          Load More
        </div> -->
    </div>
  </main>
  <main v-else-if="!isOnline">You are currently Offline</main>
  <LoadingScreen v-else />
</template>
<style scoped lang="scss">
.main {
  padding: 1rem 12vw 2rem;
  transition: 400ms;
  .container {
    border-radius: 1rem;
    background-color: #252525;
    min-width: 100%;
    min-height: 100%;
    padding-inline: 4rem;
  }
}
@media (max-width: 600px) {
  .main {
    padding: 1rem;
  }
}
</style>
