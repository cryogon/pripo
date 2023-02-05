<script setup lang="ts">
import ThumbsUp from "../components/Icons/ThumbsUp.vue";
import type { Comment } from "@/types";
import { getTimeDifference } from "@/helper";
import ReplyInputBoxv2 from "./ReplyInputBoxv2.vue";
import { useEmitter } from "@/composables/EventEmitter";
import { useAuth0 } from "@auth0/auth0-vue";
import { ref } from "vue";
import router from "@/router";
import { useMutation } from "@vue/apollo-composable";
import { SET_COMMENT_LIKE, REMOVE_COMMENT_LIKE } from "@/graphql";
import { useClipboard } from "@vueuse/core";
defineProps<{ comment: Comment }>();
const { user } = useAuth0();
const emitter = useEmitter();
const isReplyInputInactive = ref(true);
const commentReplyMode = ref<"reply" | "edit">("reply");
const { copy, copied } = useClipboard();

function toggle() {
  if (!user.value?.email) {
    emitter.emit("alert", "You need to login in order to reply");
    return;
  }
  isReplyInputInactive.value = !isReplyInputInactive.value;
}
function replyToggle() {
  commentReplyMode.value = "reply";
  toggle();
}
emitter.on("replyInactive", () => {
  isReplyInputInactive.value = true;
});

function redirctToProfilePage(username: string) {
  router.push(`/users/${username}`);
}

/**
 * @method setLikes
 * Set Likes on the comment
 * @param cmnt takes id of the comment to uniquely identify it
 */

function setLikes(cmnt: Comment) {
  if (!user.value?.email) {
    emitter.emit("alert", "You need to login in order to like");
    return;
  }
  const variable = {
    commentId: cmnt.id,
    userId: user.value?.uid,
  };
  const { mutate: setLikes } = useMutation(SET_COMMENT_LIKE);
  const { mutate: removeLikes } = useMutation(REMOVE_COMMENT_LIKE);
  for (let cUser of cmnt.liked_users || []) {
    if (cUser.user_id == user.value?.uid) {
      setLikes(variable);
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

function editComment() {
  commentReplyMode.value = "edit";
  toggle();
}
function deleteComment() {
  emitter.emit("alert", "Are you sure about that");
}

function toggleReply() {
  isReplyInputInactive.value = true;
}
function commentUrl(id: number) {
  return `${location.origin}/comments/${id}`;
}
</script>
<template>
  <div class="comment-item" :id="`c${comment.id}`">
    <div class="user-info-container">
      <div class="user-avatar-container">
        <i class="threadline"></i>
        <img
          :src="comment.user.profile_picture"
          alt="user-avatar"
          class="user-avatar"
          @click="redirctToProfilePage(comment.user.username)"
          v-if="comment.is_public"
        />
        <div class="anonymous-user" v-else></div>
      </div>
      <div class="user-info">
        <div class="username">
          {{ comment.is_public ? comment.user.username : "Anonymous" }}
        </div>
        <div class="content">{{ comment.content }}</div>
      </div>
    </div>
    <div class="options-container">
      <span class="date options-item">
        {{ getTimeDifference(new Date(comment.posted_on), new Date()) }}
      </span>
      <span class="reply options-item" @click="replyToggle"> reply </span>
      <span class="like options-item" @click="setLikes(comment)">
        <ThumbsUp
          class="like-icon"
          :class="{ active: hasUserLiked(comment) }"
        />
        <span class="count">{{ comment.likes }} </span>
      </span>
      <span
        class="edit options-item"
        @click="editComment"
        v-if="user?.uid === comment.user.id"
        >edit</span
      >
      <span
        class="delete options-item"
        @click="deleteComment"
        v-if="user?.uid === comment.user.id"
        >delete</span
      >
      <span
        class="copy options-item"
        @click="copy(commentUrl(comment.id as number))"
        v-if="!copied"
        >permalink</span
      >
      <span class="copy options-item" v-else>copied</span>
    </div>
    <ReplyInputBoxv2
      :is-reply-input-inactive="isReplyInputInactive"
      :comment="comment"
      :mode="commentReplyMode"
      v-if="commentReplyMode == 'reply'"
      :toggle-reply="toggleReply"
    />
    <ReplyInputBoxv2
      :comment="comment"
      :is-reply-input-inactive="isReplyInputInactive"
      :mode="commentReplyMode"
      v-if="commentReplyMode == 'edit'"
      :toggle-reply="toggleReply"
    />
  </div>
</template>
<style scoped lang="scss">
.comment-item {
  font-size: 14px;
  margin: 1rem 0.3rem;
  .user-info-container {
    min-height: 4rem;
    cursor: pointer;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-inline-end: 1rem;
    background-color: #161616;
    .user-avatar-container {
      position: relative;
      .threadline {
        height: 200rem;
        width: 0.1rem;
        background-color: var(--color-text);
        position: absolute;
        left: 50%;
        top: 3rem;
        // z-index: -1;
      }
      .user-avatar,
      .anonymous-user {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }
      .anonymous-user {
        background-color: grey;
        &:hover {
          cursor: default;
        }
      }
    }
    .user-info {
      .username {
        margin-block-end: 0.3rem;
        opacity: 0.6;
      }
    }
  }
  .options-container {
    padding-inline-start: 4.12rem;
    opacity: 0.6;
    display: flex;
    gap: 13px;
    align-items: center;
    .options-item {
      &.date {
        margin-inline-end: 0.6rem;
      }
      &:not(:first-child) {
        font-weight: bold;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .like {
      display: flex;
      align-items: center;
      gap: 2px;
      text-decoration: none !important;
      opacity: 1;
      .like-icon {
        height: 1rem;
        width: 1.3rem;
        stroke-width: 5;
        &.active {
          fill: var(--color-text);
        }
      }
    }
  }
}
</style>
