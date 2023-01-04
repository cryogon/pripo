<script setup lang="ts">
// import type { Comment, Likes } from "@/types";
import ReplyInputBox from "./ReplyInputBox.vue";
import { useEmitter } from "@/composables/EventEmitter";
import { ref } from "vue";
import router from "@/router";
const emitter = useEmitter();
defineProps<{
  comment: any;
}>();

function showFormatedDate(date: Date | string | number): string {
  return Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
const isReplyInputInactive = ref(true);
function replyToggle() {
  isReplyInputInactive.value = !isReplyInputInactive.value;
}

emitter.on("replyInactive", () => {
  isReplyInputInactive.value = true;
});

function redirctToProfilePage(id: number) {
  router.push(`/user/${id}`);
}

/**
 * @method setLikes
 * Set Likes on the comment
 * @param id takes id of the comment to uniquely identify it
 */

function setLikes(like: any) {
  /*This Login is Broken And is needed to be fixed 
  since the flag always initilize with false and even if I take it outside it won't work properly for multiple comments */
}
</script>
<template>
  <div class="comment">
    <img
      :src="comment.user.profile_picture"
      alt="user"
      class="userIcon"
      @click="redirctToProfilePage(comment.user.id)"
    />
    <div class="comment-container">
      <div class="comment-main">
        <span class="comment-header">
          <span class="currentUser">
            <span class="user-name">
              {{ comment.user.username }}
            </span>
          </span>
          <span class="time-commented">{{
            showFormatedDate(comment.posted_on)
          }}</span>
        </span>

        <span class="content">
          {{ comment.content }}
        </span>
        <div class="commentOptions">
          <span
            class="replyToggle comment-options-icon"
            title="reply"
            @click="replyToggle"
          >
            <fa-icon icon="reply" />
            <span class="replyCount"></span>
          </span>
          <span
            class="likes comment-options-icon"
            @click="setLikes(comment.likes)"
          >
            <fa-icon :icon="['regular', 'thumbs-up']" class="likeIcon" />
            <span class="likeCount">{{ comment.likes?.count }}</span>
          </span>
          <fa-icon icon="ellipsis-vertical" class="comment-options-icon" />
        </div>
        <ReplyInputBox
          :comment="comment"
          :is-reply-input-inactive="isReplyInputInactive"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment {
  display: flex;
  gap: 10px;
  .userIcon {
    align-self: flex-start;
    grid-row: 1 / span 2;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    opacity: 1;
    cursor: pointer;
  }
  .comment-container {
    background: var(--card-background);
    min-height: 6rem;
    width: 49rem;
    padding: 0.5rem 1rem;
    white-space: pre-wrap;
    word-wrap: break-word;

    .commentOptions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      cursor: pointer;
      .likes,
      .replyToggle {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .comment-options-icon {
        padding: 0.3rem;
        &:hover {
          background: var(--button-hover-color);
        }
      }
    }
    .comment-header {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      opacity: 0.6;
      margin-block-end: 0.4rem;
    }
  }
}
</style>
