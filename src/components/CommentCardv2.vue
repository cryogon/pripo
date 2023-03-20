<script setup lang="ts">
import ThumbsUp from "../components/Icons/ThumbsUp.vue";
import type { Comment } from "@/types";
import ReplyInputBoxv2 from "./ReplyInputBoxv2.vue";
import { useEmitter } from "@/composables/EventEmitter";
import { useAuth0 } from "@auth0/auth0-vue";
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import {
  SET_COMMENT_LIKE,
  REMOVE_COMMENT_LIKE,
  DELETE_COMMENT,
} from "@/graphql";
import { useClipboard, useTimeAgo } from "@vueuse/core";
import OptionsIcon from "./Icons/OptionsIcon.vue";
import { setImageQuality } from "@/helper/setImageQuality";
defineProps<{ comment: Comment }>();
const { user } = useAuth0();
const emitter = useEmitter();
const isReplyInputInactive = ref(true);
const commentReplyMode = ref<"reply" | "edit">("reply");
const { copy, copied } = useClipboard();
const isOptionToggleActive = ref(false);
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
  if (!hasUserLiked(cmnt)) {
    setLikes(variable);
  } else {
    removeLikes(variable);
  }
}

function hasUserLiked(cmnt: Comment) {
  if (!cmnt.liked_users.length) {
    return false;
  }
  for (let cUser of cmnt.liked_users || []) {
    if (cUser.user_id == user.value?.uid) {
      return true;
    }
  }
  return false;
}

function editComment() {
  commentReplyMode.value = "edit";
  toggle();
}
function deleteComment(id: number) {
  const { mutate } = useMutation(DELETE_COMMENT);
  //This event fire up custom confirm box which will call mutate function and pass id as variable if confirmed else it will skip it
  emitter.emit("confirm", { mutate, id });
}

function toggleReply() {
  isReplyInputInactive.value = true;
}
function toggleOption() {
  isOptionToggleActive.value = !isOptionToggleActive.value;
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
        <router-link
          v-if="comment.is_public"
          :to="`/users/${comment.user.username}`"
        >
          <img
            :src="
              setImageQuality(comment.user.profile_picture, {
                height: 96,
                width: 96,
                quality: 'q_50',
              })
            "
            alt="user-avatar"
            class="user-avatar"
          />
        </router-link>
        <div class="anonymous-user" v-else></div>
      </div>
      <div class="user-info">
        <router-link
          :to="`/users/${comment.user.username}`"
          class="username"
          v-if="comment.is_public"
        >
          {{ comment.user.username }}
        </router-link>
        <span class="username" v-else>Anonymous</span>
        <div class="content">{{ comment.content }}</div>
      </div>
    </div>
    <div class="options-container">
      <span class="date options-item">
        {{ useTimeAgo(new Date(comment.posted_on)).value }}
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
        @click="deleteComment(comment.id as number)"
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
      <div class="drop-down-container">
        <OptionsIcon class="drop-down options-item" @click="toggleOption" />
        <ul class="drop-down-tray" :class="{ active: isOptionToggleActive }">
          <li
            class="options-item"
            @click="editComment"
            v-if="user?.uid === comment.user.id"
          >
            edit
          </li>
          <li
            class="options-item"
            @click="deleteComment(comment.id as number)"
            v-if="user?.uid === comment.user.id"
          >
            delete
          </li>
          <li
            class="options-item"
            @click="copy(commentUrl(comment.id as number))"
            v-if="!copied"
          >
            permalink
          </li>
          <li class="options-item" v-else-if="copied">copied</li>
        </ul>
      </div>
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
  --threadline-top: 3rem;
  font-size: 14px;
  margin: 1rem 0.3rem;
  .user-info-container {
    min-height: 4rem;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-inline-end: 1rem;
    // background-color: var(--color-background);
    background-color: inherit;
    .user-avatar-container {
      position: relative;
      a {
        padding: 0;
      }
      .threadline {
        height: 200rem;
        width: 0.1rem;
        background-color: var(--color-text);
        position: absolute;
        left: 50%;
        top: var(--threadline-top);
        @media screen and (max-width: 700px) {
          background-color: rgb(109, 109, 109);
        }
      }
      .user-avatar,
      .anonymous-user {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        @media screen and (max-width: 700px) {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
        }
      }
      .user-avatar {
        cursor: pointer;
      }
      .anonymous-user {
        background-color: grey;
        &:hover {
          cursor: default;
        }
      }
    }
    .user-info {
      display: flex;
      flex-direction: column;
      .username {
        padding: 0;
        color: var(--color-text);
        margin-block-end: 0.3rem;
        opacity: 0.6;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .options-container {
    padding-inline-start: 4.12rem;
    opacity: 0.6;
    display: flex;
    gap: 13px;
    align-items: center;
    user-select: none;
    .options-item {
      &.date {
        margin-inline-end: 0.6rem;
      }

      &.drop-down {
        width: 1rem;
        height: 1.1rem;
        stroke-width: 4;
      }
      &:not(:first-child) {
        font-weight: bold;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    @media screen and (max-width: 700px) {
      padding-inline-start: 3rem;
      .options-item {
        font-weight: bold;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
        &.date,
        &.edit,
        &.delete,
        &.copy {
          display: none;
        }
      }
    }
    .drop-down-container {
      display: none;
    }
    @media screen and (max-width: 700px) {
      .drop-down-container {
        display: block;
        .drop-down-tray {
          display: none;
          background-color: #000;
          padding: 0.5rem;
          position: absolute;
          z-index: 9;
          list-style: none;
          &.active {
            display: block;
          }
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
  @media screen and (max-width: 700px) {
    --threadline-top: 2rem;
  }
}
</style>
