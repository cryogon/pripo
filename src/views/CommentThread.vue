<script setup lang="ts">
import { ref } from "vue";
import type { Comment } from "@/types";
import router from "@/router";
import { setMeta } from "@/utils";
import CommentSection from "@/components/CommentSection.vue";

const params = router.currentRoute.value.params;
const commentId = parseInt(params?.id as string);
const comments = ref<Comment[]>();

setMeta({
  title: `Comments ${commentId}`,
});
</script>
<template>
  <main>
    <h2
      @click="router.push(`/posts/${comments && comments[0].blog_id}`)"
      class="title"
    >
      {{ comments && comments[0].blog.title }}
    </h2>
    <CommentSection :comment-id="commentId" />
    <!-- <section class="comment-container" v-if="comments">
      <div
        class="comment-main"
        v-for="comment in comments"
        :key="(comment.id as number)"
      >
        <CommentCardv2 :comment="comment" />
        <div
          class="reply-main"
          v-for="reply in comment.children"
          :key="(reply.id as number)"
        >
          <CommentCardv2 :comment="reply" />
          <div
            class="reply-main"
            v-for="reply2 in reply.children"
            :key="(reply2.id as number)"
          >
            <CommentCardv2 :comment="reply2" />
          </div>
        </div>
      </div>
    </section> -->
  </main>
</template>
<style scoped lang="scss">
main {
  padding: 2rem 10rem;
  .title {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .comment-container {
    background-color: rgb(8, 8, 8, 0.2);
    padding: 1rem 1.2rem;
    min-height: 10rem;
    .comment-main {
      background-color: #161616;
      overflow-y: hidden;
    }
    .reply-main {
      padding-inline-start: 3em;
    }
  }
  @media (max-width: 700px) {
    padding: 1rem 0.3rem;
  }
}
</style>
