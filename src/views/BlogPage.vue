<script setup lang="ts">
import router from "@/router";

import CommentSection from "@/components/CommentSection.vue";
import { useQuery } from "@vue/apollo-composable";
import { GET_BLOG } from "@/graphql";
import { ref, watch } from "vue";
const params = router.currentRoute.value.params;
const blogId = parseInt(params?.id as string);

const { result, loading, error, onError, stop } = useQuery(GET_BLOG, {
  id: blogId,
});

function showFormatedDate(date: Date | string | number) {
  return Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
let blog = ref<any>();
watch(result, () => {
  blog.value = result.value.blogs[0];
  // console.log(result.value.blogs[0]);
  localStorage.setItem(
    "currentTitle",
    result.value.blogs[0].title + " - Pripo"
  );
});
onError(() => {
  stop();
});
</script>

<template>
  <main class="container" v-if="blog">
    <div class="author">
      <div class="authorPfp anonymous" v-if="!blog.is_public"></div>
      <img
        :src="blog.user.profile_picture"
        alt="author"
        class="authorPfp"
        @click="router.push(`/user/${blog.user.id}`)"
        v-else
      />
      <span class="author_name"
        >Posted by {{ blog.is_public ? blog.user.username : "Anonymous" }}</span
      >
    </div>
    <h1 class="title">{{ blog.title }}</h1>
    <div class="content">
      <p>
        {{ blog.content }}
      </p>
      <div class="tags">
        <span v-for="tag in blog.tags" :key="tag" class="link">#{{ tag }}</span>
      </div>
      <span class="date-posted"
        >posted on {{ showFormatedDate(blog.date_posted) }}</span
      >
    </div>
    <CommentSection :comments="blog.comments" />
  </main>

  <main v-else-if="loading && !error">Loading...</main>
  <main v-else-if="error || !loading">Blog Not Found</main>
</template>
<style scoped lang="scss">
.container {
  padding-block-start: 3rem;
  padding-inline: min(10rem, 10vw);
  max-width: 80rem;
  .title,
  .content {
    p {
      margin-block-end: 0.8rem;
      line-height: 1.4rem;
      white-space: pre-wrap;
    }
  }

  .title {
    line-height: 2.4rem;
  }
  .date-posted {
    display: flex;
    justify-content: flex-end;
    opacity: 0.7;
  }

  .author {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 0.6rem;
  }
  .authorPfp {
    cursor: pointer;
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
  .anonymous {
    background-color: grey;
  }
}
</style>
