<script setup lang="ts">
// import type { Comment, Likes } from "@/types";
import ThumbsUp from "@/components/Icons/ThumbsUp.vue";
import ReplyInputBox from "./ReplyInputBox.vue";
import { useEmitter } from "@/composables/EventEmitter";
import { ref } from "vue";
import router from "@/router";
import { useMutation } from "@vue/apollo-composable";
import { SET_COMMENT_LIKE, REMOVE_COMMENT_LIKE } from "@/graphql";
import { useAuth0 } from "@auth0/auth0-vue";
const props = defineProps<{
  comment: any;
}>();

const { user } = useAuth0();
const emitter = useEmitter();
const isReplyInputInactive = ref(true);

function showFormatedDate(date: Date | string | number): string {
  return Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
function replyToggle() {
  isReplyInputInactive.value = !isReplyInputInactive.value;
}

emitter.on("replyInactive", () => {
  isReplyInputInactive.value = true;
});

function redirctToProfilePage(id: number) {
  router.push(`/users/${id}`);
}

console.log(props.comment);
/**
 * @method setLikes
 * Set Likes on the comment
 * @param cmnt takes id of the comment to uniquely identify it
 */

function setLikes(cmnt: any) {
  const variable = {
    commentId: cmnt.id,
    userId: user.value.uid,
  };
  const { mutate: setLikes } = useMutation(SET_COMMENT_LIKE);
  const { mutate: removeLikes } = useMutation(REMOVE_COMMENT_LIKE);
  for (let cUser of cmnt.liked_users || []) {
    if (cUser.user_id == user.value.uid) {
      setLikes(variable);
      return;
    } else {
      removeLikes(variable);
      return;
    }
  }
  if (!cmnt.liked_users.length) {
    removeLikes(variable);
  }
}

function hasUserLiked(cmnt: any) {
  if (!cmnt.liked_users.length) {
    return false;
  }
  for (let cUser of cmnt.liked_users || []) {
    if (cUser.user_id == user.value.uid) {
      return true;
    } else {
      return false;
    }
  }
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
          <span class="likes comment-options-icon" @click="setLikes(comment)">
            <!-- <fa-icon :icon="['regular', 'thumbs-up']" class="likeIcon" /> -->
            <ThumbsUp
              class="likeIcon"
              :class="{ active: hasUserLiked(comment) }"
            />
            <span class="likeCount">{{ comment.likes }}</span>
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
      .likeIcon {
        width: 1.3rem;
        height: 1rem;
      }
      .active {
        fill: var(--color-text);
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
