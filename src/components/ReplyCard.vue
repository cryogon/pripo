<script setup lang="ts">
import ReplyInputBox from "./ReplyInputBox.vue";

import { ref } from "vue";
import router from "@/router";

defineProps<{
  reply: any;
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
function redirctToProfilePage(id: number) {
  router.push(`/users/${id}`);
}

// emitter.on("replyInactive", () => {
//   isReplyInputInactive.value = true;
// });

/**
 * @method setLikes
 * Set Likes on the comment
 * @param id takes id of the comment to uniquely identify it
 */

function setLikes(like: any) {
  /*This Login is Broken And is needed to be fixed 
  since the flag always initilize with false and even if I take it outside it won't work properly for multiple comments */
  like.count++;
}
</script>

<template>
  <div class="reply">
    <img
      :src="reply.user.profile_picture"
      alt="user"
      class="userIcon"
      @click="redirctToProfilePage(reply.user.id)"
    />
    <div class="reply-container">
      <div class="reply-main">
        <span class="currentUser">
          {{ reply.user.username }}
          <span class="time-commented">{{
            showFormatedDate(reply.posted_on)
          }}</span>
        </span>

        <span class="content">
          {{ reply.content }}
        </span>
        <div class="replyOptions">
          <span
            class="replyToggle reply-options-icon"
            title="reply"
            @click="replyToggle"
          >
            <fa-icon icon="reply" />
            <span class="replyCount"></span>
          </span>
          <span class="likes reply-options-icon" @click="setLikes(reply.likes)">
            <fa-icon :icon="['regular', 'thumbs-up']" class="likeIcon" />
            <span class="likeCount">{{ reply.likes }}</span>
          </span>
          <fa-icon icon="ellipsis-vertical" class="reply-options-icon" />
        </div>
        <ReplyInputBox
          :comment="reply"
          :is-reply-input-inactive="isReplyInputInactive"
        />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.reply {
  display: flex;
  gap: 10px;
  margin-inline-start: 2em;
  margin-block: 0.5rem;
  .userIcon {
    align-self: flex-start;
    grid-row: 1 / span 2;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    opacity: 1;
    cursor: pointer;
  }
  .reply-container {
    background: var(--card-background);
    min-height: 6rem;
    width: 49rem;
    padding: 0.5rem 1rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    .replyOptions {
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

      .reply-options-icon {
        padding: 0.3rem;
        &:hover {
          background: var(--button-hover-color);
        }
      }
    }
    .currentUser {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      opacity: 0.6;
      margin-block-end: 0.4rem;
    }
  }
}
</style>
