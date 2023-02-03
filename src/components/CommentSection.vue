<script setup lang="ts">
import CommentInputBox from "./CommentInputBox.vue";
import CommentCard from "./CommentCard.vue";
import { CommentBuilder } from "@/composables/CommentBuilder";
import { useQuery } from "@vue/apollo-composable";
import { GET_COMMENTS } from "@/graphql";
import { watch, ref } from "vue";
import { useEmitter } from "@/composables/EventEmitter";
import type { Blog } from "@/types";
import CommentCardv2 from "./CommentCardv2.vue";
const props = defineProps<{
  blog: Blog;
}>();
const { result, refetch } = useQuery(GET_COMMENTS, {
  blogId: props.blog?.id,
});
const builder = ref(new CommentBuilder());
const comments = ref();
watch(result, () => {
  builder.value.clear();
  builder.value.addMultiple(result.value.comments);
  comments.value = builder.value.root?.children;
});
//I have a idea but I am just laze to implement it now
// I will just add new data in CommentBuilder in client side so that they can see it updating in realtime seamlessly
// and it will even save us refeching again from database but the problem is doing this I will not get any comment_id from db
// So For now I will just let it refetch

/**
 *
 * @param data it contains posted comment data
 */

const emitter = useEmitter();
emitter.on("refetchComments", () => {
  refetch();
});
</script>

<template>
  <section class="comment-section">
    <CommentInputBox :blog="blog" />
    <div class="comment-container" v-if="comments">
      <div class="comment-main" v-for="comment in comments" :key="comment.id">
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
            <div
              class="reply-main"
              v-for="reply3 in reply2.children"
              :key="(reply3.id as number)"
            >
              <CommentCardv2 :comment="reply3" />
              <div
                class="reply-main"
                v-for="reply4 in reply3.children"
                :key="(reply4.id as number)"
              >
                <CommentCardv2 :comment="reply4" />
                <div
                  class="reply-main"
                  v-for="reply5 in reply4.children"
                  :key="(reply5.id as number)"
                >
                  <CommentCardv2 :comment="reply5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.comment-section {
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
      &:nth-last-child(2) {
        overflow-y: hidden;
      }
    }
  }
}
</style>
