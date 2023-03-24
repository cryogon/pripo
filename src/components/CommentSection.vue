<script setup lang="ts">
import CommentInputBox from "./CommentInputBox.vue";
import { CommentBuilder } from "@/composables/CommentBuilder";
import { useQuery } from "@vue/apollo-composable";
import { GET_COMMENTS } from "@/graphql";
import { ref, watchEffect } from "vue";
import { useEmitter } from "@/composables/EventEmitter";
import type { Blog, Comment } from "@/types";
import CommentCardv2 from "./CommentCardv2.vue";
import router from "@/router";
/**
 * Using blog and comment id seprately because this component
 * is used by two pages one is blog page and another one is comment
 * Thread. So when it is in comment thread it will fetch based on
 * comment id
 */
const props = defineProps<{
  /**
   * Blog object which contains all blogs info i.e title,content etc.
   */
  blog?: Blog;
  commentId?: number;
}>();
const { result, refetch, onError } = useQuery(GET_COMMENTS(props.commentId), {
  blogId: props.blog?.id,
});
onError((e) => {
  console.error("Some problem on our side.", e);
});
const builder = ref(new CommentBuilder());
const comments = ref<Comment[]>([]);
type CommentSortOptions = "recent" | "old" | "top";
const sortingOption: CommentSortOptions[] = ["recent", "old", "top"];
const sortOption = ref<CommentSortOptions>("recent");

watchEffect(() => {
  if (
    (props.blog &&
      props.blog.comments_allowed &&
      result.value?.comments.length) ||
    (props?.commentId && result.value?.comments.length)
  ) {
    builder.value.clear();
    builder.value.addMultiple(result.value.comments);
    comments.value = builder.value.root?.children;
    console.log(comments.value);
    if (sortOption.value === "recent") {
      comments.value.reverse();
    } else if (sortOption.value === "old") {
      comments.value.sort();
    } else {
      comments.value.sort((a, b) => b.likes - a.likes);
    }
  }
});

const emitter = useEmitter();
emitter.on("refetchComments", () => {
  refetch();
});
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<template>
  <section class="comment-section">
    <div class="disabled-comments" v-if="blog && !blog.comments_allowed">
      <h4>Comments are Disabled by author</h4>
    </div>
    <div class="comment-container" v-else>
      <CommentInputBox :blog="blog" v-if="blog" />
      <div class="comments-options-bar" v-if="blog">
        <div class="comments-option__sort">
          <label for="sorting-options">Sort By</label>
          <ul id="sorting-options" class="sorting-options">
            <li
              v-for="(sort, index) in sortingOption"
              :key="index"
              :class="{ active: sortOption === sort }"
              @click="sortOption = sort"
            >
              {{ capitalize(sort) }}
            </li>
          </ul>
        </div>
      </div>
      <span class="no-comments" v-if="!comments.length">Nothing Here</span>
      <div
        class="comment-main"
        v-for="comment in comments"
        :key="comment.id"
        v-else
      >
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
                                                  v-if="reply8.children?.length"
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
  margin-block: 2rem 4rem;
  padding: 1rem;
  background-color: #303030;
  border-radius: 1rem;
  .disabled-comments {
    padding-block-start: 2rem;
  }
  .no-comments {
    display: block;
    margin: 1rem 0 0 1rem;
  }
  .comment-container {
    background-color: var(--comment-section-background);
    min-height: 10rem;
    .comments-options-bar {
      background-color: #252525;
      padding: 1rem;
      border-radius: 1rem;
      .comments-option__sort {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        .sorting-options {
          display: flex;
          gap: 10px;
          list-style: none;
          li {
            padding: 0.2rem;
            border-radius: 0.3rem;
            cursor: pointer;
            &.active {
              background-color: #505050;
            }
          }
        }
      }
    }
    .comment-main {
      // background-color: var(--color-background);
      // background-color: red;
      overflow-y: hidden;
    }
    .reply-container {
      overflow-y: hidden;
      .reply-main {
        padding-inline-start: min(3em, 4vw);
      }
      .continue-thread {
        font-size: 13px;
        background-color: var(--input-box-background);
        display: inline-flex;
        padding: 1rem;
        border-radius: 1rem;
        margin-inline-start: 4.2rem;
        cursor: pointer;
        @media screen and (max-width: 700px) {
          margin-inline-start: 2rem;
        }
      }
    }
  }
}
</style>
