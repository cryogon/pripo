<script setup lang="ts">
import CommentInputBox from "./CommentInputBox.vue";
import { CommentBuilder } from "@/composables/CommentBuilder";
import { useQuery } from "@vue/apollo-composable";
import { GET_COMMENTS } from "@/graphql";
import { watch, ref } from "vue";
import { useEmitter } from "@/composables/EventEmitter";
import type { Blog } from "@/types";
import CommentCardv2 from "./CommentCardv2.vue";
import router from "@/router";
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
    <div class="comment-container" v-if="comments">
      <CommentInputBox :blog="blog" />
      <div class="comment-main" v-for="comment in comments" :key="comment.id">
        <CommentCardv2 :comment="comment" />
        <div class="reply-container">
          <div
            class="reply-main"
            v-for="reply in comment.children"
            :key="(reply.id as number)"
          >
            <CommentCardv2 :comment="reply" class="reply" />
            <div class="reply-container">
              <div
                class="reply-main"
                v-for="reply2 in reply.children"
                :key="(reply2.id as number)"
              >
                <CommentCardv2 :comment="reply2" class="reply" />

                <div class="reply-container">
                  <div
                    class="reply-main"
                    v-for="reply3 in reply2.children"
                    :key="(reply3.id as number)"
                  >
                    <CommentCardv2 :comment="reply3" class="reply" />
                    <div class="reply-container">
                      <div
                        class="reply-main"
                        v-for="reply4 in reply3.children"
                        :key="(reply4.id as number)"
                      >
                        <CommentCardv2 :comment="reply4" class="reply" />
                        <div class="reply-container">
                          <div
                            class="reply-main"
                            v-for="reply5 in reply4.children"
                            :key="(reply5.id as number)"
                          >
                            <CommentCardv2 :comment="reply5" class="reply" />
                            <div class="reply-container">
                              <div
                                class="reply-main"
                                v-for="reply6 in reply5.children"
                                :key="(reply6.id as number)"
                              >
                                <CommentCardv2
                                  :comment="reply6"
                                  class="reply"
                                />
                                <div class="reply-container">
                                  <div
                                    class="reply-main"
                                    v-for="reply7 in reply6.children"
                                    :key="(reply7.id as number)"
                                  >
                                    <CommentCardv2
                                      :comment="reply7"
                                      class="reply"
                                    />
                                    <div class="reply-container">
                                      <div
                                        class="reply-main"
                                        v-for="reply8 in reply7.children"
                                        :key="(reply8.id as number)"
                                      >
                                        <CommentCardv2
                                          :comment="reply8"
                                          class="reply"
                                        />
                                        <div class="reply-container">
                                          <div
                                            class="reply-main"
                                            v-for="reply7 in reply8.children"
                                            :key="(reply7.id as number)"
                                          >
                                            <CommentCardv2
                                              :comment="reply7"
                                              class="reply"
                                            />
                                            <div class="reply-container">
                                              <div
                                                class="reply-main"
                                                v-for="reply8 in reply7.children"
                                                :key="(reply8.id as number)"
                                              >
                                                <CommentCardv2
                                                  :comment="reply8"
                                                  class="reply"
                                                />
                                                <div
                                                  class="continue-thread"
                                                  v-if="reply8.children.length"
                                                  @click="
                                                    router.push(
                                                      `/comments/${reply8.id}`
                                                    )
                                                  "
                                                  role="button"
                                                >
                                                  Continue this Thread
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
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped lang="scss">
.comment-section {
  margin-block-start: 2rem;
  .comment-container {
    background-color: var(--comment-section-background);
    padding: 1rem 1.2rem;
    min-height: 10rem;
    .comment-main {
      background-color: var(--color-background);
      overflow-y: hidden;
    }
    .reply-container {
      overflow-y: hidden;
      .reply-main {
        padding-inline-start: 3em;
      }
      .continue-thread {
        font-size: 13px;
        background-color: var(--input-box-background);
        display: inline-flex;
        padding: 1rem;
        border-radius: 1rem;
        margin-inline-start: 4.2rem;
        cursor: pointer;
      }
    }
  }
}
</style>
