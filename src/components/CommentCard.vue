<script setup lang="ts">
import type { Comment } from "@/types";
import ThumbsUp from "@/components/Icons/ThumbsUp.vue";
import ReplyInputBox from "./ReplyInputBox.vue";
import { useEmitter } from "@/composables/EventEmitter";
import { ref } from "vue";
import router from "@/router";
import { useMutation } from "@vue/apollo-composable";
import { SET_COMMENT_LIKE, REMOVE_COMMENT_LIKE } from "@/graphql";
import { useAuth0 } from "@auth0/auth0-vue";
defineProps<{
  comment: any;
}>();
const { user } = useAuth0();
const emitter = useEmitter();
const isReplyInputInactive = ref(true);
const commentOptionToggle = ref(false);
const commentReplyMode = ref<"reply" | "edit">("reply");

function showFormatedDate(date: Date | string | number): string {
  return Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
function replyToggle() {
  commentReplyMode.value = "reply";
  isReplyInputInactive.value = !isReplyInputInactive.value;
}

emitter.on("replyInactive", () => {
  isReplyInputInactive.value = true;
});

function redirctToProfilePage(id: number) {
  router.push(`/users/${id}`);
}

/**
 * @method setLikes
 * Set Likes on the comment
 * @param cmnt takes id of the comment to uniquely identify it
 */

function setLikes(cmnt: Comment) {
  const variable = {
    commentId: cmnt.id,
    userId: user.value.uid,
  };
  const { mutate: setLikes } = useMutation(SET_COMMENT_LIKE);
  const { mutate: removeLikes } = useMutation(REMOVE_COMMENT_LIKE);
  for (let cUser of cmnt.liked_users || []) {
    if (cUser.user_id == user.value?.uid) {
      setLikes(variable);
      // console.log("Set Like");
      return;
    } else {
      removeLikes(variable);
      return;
    }
  }
  if (!cmnt.liked_users.length) {
    setLikes(variable);
  }
}

function hasUserLiked(cmnt: Comment) {
  if (!cmnt.liked_users.length) {
    return false;
  }
  for (let cUser of cmnt.liked_users || []) {
    if (cUser.user_id == user.value?.uid) {
      return true;
    } else {
      return false;
    }
  }
}

function toggleCommentOptions() {
  commentOptionToggle.value = !commentOptionToggle.value;
  setTimeout(() => {
    document.addEventListener(
      "click",
      () => {
        commentOptionToggle.value = false;
      },
      { once: true }
    );
  }, 10);
}

function editComment() {
  commentReplyMode.value = "edit";
  isReplyInputInactive.value = !isReplyInputInactive.value;
}
</script>
<template>
  <div class="comment">
    <img
      :src="comment.user.profile_picture"
      alt="user"
      class="userIcon"
      @click="redirctToProfilePage(comment.user.id)"
      referrerpolicy="no-referrer"
      v-if="comment.is_public"
    />
    <div class="anonymousUser" v-else></div>
    <div class="comment-container">
      <div class="comment-main">
        <span class="comment-header">
          <span class="currentUser">
            <span class="user-name">
              {{ comment.is_public ? comment.user.username : "Anonymous" }}
            </span>
          </span>
          <span class="time-commented">{{
            showFormatedDate(comment.posted_on)
          }}</span>
        </span>
        <span class="content" :id="`c${comment.id}`">
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
            <ThumbsUp
              class="likeIcon"
              :class="{ active: hasUserLiked(comment) }"
            />
            <span class="likeCount">{{ comment.likes }}</span>
          </span>
          <fa-icon
            icon="ellipsis-vertical"
            class="comment-options-icon"
            @click="toggleCommentOptions"
          />
          <ul
            class="commentOptionsTray"
            :class="{ active: commentOptionToggle }"
          >
            <li @click="editComment">Edit</li>
          </ul>
        </div>
        <ReplyInputBox
          :comment="comment"
          :is-reply-input-inactive="isReplyInputInactive"
          :mode="commentReplyMode"
          v-if="commentReplyMode == 'reply'"
        />
        <ReplyInputBox
          :comment="comment"
          :is-reply-input-inactive="isReplyInputInactive"
          :mode="commentReplyMode"
          v-if="commentReplyMode == 'edit'"
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
    width: min(60vw, 49rem);
    padding: 0.5rem 1rem;
    white-space: pre-wrap;
    word-wrap: break-word;

    .commentOptions {
      display: flex;
      justify-content: flex-end;
      position: relative;
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
      .commentOptionsTray {
        position: absolute;
        right: -6rem;
        display: none;
        align-items: center;
        flex-direction: column;
        background-color: var(--color-background);
        box-shadow: 2px 0 4px grey;
        min-width: 5rem;
        min-height: auto;
        list-style: none;
        li {
          padding: 0.3rem 0.7rem;
          &:hover {
            background-color: var(--card-background);
          }
        }
        &.active {
          display: flex;
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
  .anonymousUser {
    aspect-ratio: 1/1;
    width: 53px;
    height: 53px;
    border-radius: 50%;
    background-color: grey;
  }
}
</style>
