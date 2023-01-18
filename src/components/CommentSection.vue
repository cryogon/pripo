<script setup lang="ts">
import CommentInputBox from "./CommentInputBox.vue";
import CommentCard from "./CommentCard.vue";
import ReplyCard from "./ReplyCard.vue";
import { CommentBuilder } from "@/composables/CommentBuilder";
import { useQuery } from "@vue/apollo-composable";
import { GET_COMMENTS } from "@/graphql";
import { watch, ref } from "vue";
const props = defineProps<{
  blogId: number;
}>();
const { result: comments } = useQuery(GET_COMMENTS, {
  blogId: props.blogId,
});
const builder = new CommentBuilder();
let currComments = ref();
watch(comments, () => {
  builder.addMultiple(comments.value.comments);
  currComments.value ||= builder.root?.children;
});
</script>

<template>
  <div class="comment-section">
    <CommentInputBox />

    <div
      class="comments"
      v-for="comment in currComments"
      :key="(comment.id as number)"
    >
      <div class="comment-reply-container">
        <CommentCard :comment="comment" />
        <div class="reply">
          <div class="reply--main">
            <div v-for="reply in comment.children" :key="(reply.id as number)">
              <ReplyCard :reply="reply" />
              <div
                class="reply--child"
                v-for="reply2 in reply.children"
                :key="(reply2.id as number)"
                :reply="reply2"
              >
                <ReplyCard :reply="reply2" />
                <div
                  class="reply--child"
                  v-for="reply3 in reply2.children"
                  :key="(reply3.id as number)"
                >
                  <ReplyCard :reply="reply3" />
                  <div
                    class="reply--child"
                    v-for="reply4 in reply3.children"
                    :key="(reply4.id as number)"
                  >
                    <ReplyCard :reply="reply4" />
                    <div
                      class="reply--child"
                      v-for="reply5 in reply4.children"
                      :key="(reply5.id as number)"
                    >
                      <ReplyCard :reply="reply5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.comment-section {
  .comment-reply-container {
    display: flex;
    flex-direction: column;
  }
  // .userIcon {
  //   align-self: flex-start;
  //   grid-row: 1 / span 2;
  //   width: 45px;
  //   height: 45px;
  //   border-radius: 50%;
  //   cursor: pointer;
  // }

  .comments {
    display: flex;
    align-items: center;
    margin-block: 1rem;
    gap: 10px;
  }

  .reply--child {
    margin-inline-start: 2vw;
  }
}
</style>
