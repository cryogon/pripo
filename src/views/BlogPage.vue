<script setup lang="ts">
import router from "@/router";
import { usePripoStore } from "@/stores";
import CommentSection from "@/components/CommentSection.vue";

const params = router.currentRoute.value.params;
const blogId = parseInt(params?.id as string);
const store = usePripoStore();
const blog = store.blogs.filter((b) => b.id == blogId)[0];
localStorage.setItem("currentTitle", blog.title + " - Pripo");

function showFormatedDate(date: Date | string | number) {
  return Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
</script>

<template>
  <main class="container" v-if="blog.id !== undefined">
    <div class="author">
      <div class="authorPfp anonymous" v-if="!blog.isPublic"></div>
      <img
        :src="blog.user.pfp"
        alt="author"
        class="authorPfp"
        @click="router.push(`/user/${blog.user.id}`)"
        v-else
      />
      <span class="author_name"
        >Posted by {{ blog.isPublic ? blog.user.name : "Anonymous" }}</span
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
        >posted {{ showFormatedDate(blog.date_posted) }}</span
      >
    </div>
    <CommentSection />
  </main>
  <main v-else>Yoo</main>
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
