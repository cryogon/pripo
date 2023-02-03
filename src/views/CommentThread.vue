<script setup lang="ts">
import { ref, watch } from "vue";
import CommentCardv2 from "../components/CommentCardv2.vue";
import { CommentBuilder } from "@/composables/CommentBuilder";
import { useQuery } from "@vue/apollo-composable";
import { GET_THREAD_COMMENT } from "@/graphql";
import type { Comment } from "@/types";
const builder = ref(new CommentBuilder());
const { result } = useQuery(GET_THREAD_COMMENT, { id: 1 });
const comments = ref<Comment[]>();
watch(result, () => {
  builder.value.clear();
  builder.value.addMultiple(result.value.comments);
  comments.value = builder.value.root?.children;
});
</script>
<template>
  <main>
    <h1>Comments</h1>
    <section class="comment-container" v-if="comments">
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
    </section>
  </main>
</template>
<style scoped lang="scss">
main {
  padding: 2rem 10rem;
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
}
</style>
