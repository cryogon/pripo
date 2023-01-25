<script setup lang="ts">
import CommentInputBox from "./CommentInputBox.vue";
import CommentCard from "./CommentCard.vue";
import { CommentBuilder } from "@/composables/CommentBuilder";
import { useQuery } from "@vue/apollo-composable";
import { GET_COMMENTS } from "@/graphql";
import { watch, ref } from "vue";
const props = defineProps<{
  blogId: number;
}>();
const { result: comments, refetch } = useQuery(GET_COMMENTS, {
  blogId: props.blogId,
});
const builder = ref(new CommentBuilder());
const currComments = ref();

watch(comments, () => {
  builder.value.clear();
  builder.value.addMultiple(comments.value.comments);
  currComments.value = builder.value.root?.children;
});
//I have a idea but I am just laze to implement it now
// I will just add new data in CommentBuilder in client side so that they can see it updating in realtime seamlessly
// and it will even save us refeching again from database but the problem is doing this I will not get any comment_id from db
// So For now I will just let it refetch

/**
 *
 * @param data it contains posted comment data
 */
function refetchComment() {
  refetch();
}
</script>

<template>
  <section class="comment-section">
    <CommentInputBox @push="refetchComment" />

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
              <CommentCard :comment="reply" class="r" />
              <div
                class="reply--child"
                v-for="reply2 in reply.children"
                :key="(reply2.id as number)"
                :reply="reply2"
              >
                <CommentCard :comment="reply2" class="r" />
                <div
                  class="reply--child"
                  v-for="reply3 in reply2.children"
                  :key="(reply3.id as number)"
                >
                  <CommentCard :comment="reply3" class="r" />
                  <div
                    class="reply--child"
                    v-for="reply4 in reply3.children"
                    :key="(reply4.id as number)"
                  >
                    <CommentCard :comment="reply4" class="r" />
                    <div
                      class="reply--child"
                      v-for="reply5 in reply4.children"
                      :key="(reply5.id as number)"
                    >
                      <CommentCard :comment="reply5" class="r" />
                      <div
                        class="reply--child"
                        v-for="reply6 in reply5.children"
                        :key="(reply6.id as number)"
                      >
                        <CommentCard :comment="reply6" class="r" />
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
  </section>
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
  .r {
    margin-inline-start: 1em;
    margin-block: 0.5rem;
  }
  .reply--child {
    margin-inline-start: 1.5vw;
  }
}
</style>
