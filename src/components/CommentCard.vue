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
import ReplyIcon from "./Icons/ReplyIcon.vue";
import OptionsIcon from "./Icons/OptionsIcon.vue";
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

function toggle() {
  if (!user.value?.email) {
    emitter.emit("alert", "You need to login in order to reply");
    return;
  }

  if (isReplyInputInactive.value) {
    setTimeout(() => {
      document.addEventListener(
        "click",
        (e: any) => {
          if (!e.target.className.includes("input-active"))
            isReplyInputInactive.value = true;
        },
        { once: true }
      );
    }, 10);
  }
  isReplyInputInactive.value = false;
}
function replyToggle() {
  commentReplyMode.value = "reply";
  toggle();
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

function toggleCommentOptions() {
  if (!commentOptionToggle.value) {
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
  commentOptionToggle.value = true;
}

function editComment() {
  commentReplyMode.value = "edit";
  toggle();
}
function deleteComment() {
  emitter.emit("alert", "Are you sure about that");
}
const editedComment = ref("");
function commentContentChange(data: string) {
  editedComment.value = data;
  isReplyInputInactive.value = true;
}
</script>
<template>
  <div class="comment">
    <img
      :src="comment.user.profile_picture"
      alt="user"
      class="user-icon"
      @click="redirctToProfilePage(comment.user.id)"
      referrerpolicy="no-referrer"
      v-if="comment.is_public"
    />
    <div class="anonymous-user" v-else></div>
    <div class="comment-container">
      <div class="comment-main">
        <span class="comment-header">
          <span class="current-user">
            <span class="user-name">
              {{ comment.is_public ? comment.user.username : "Anonymous" }}
            </span>
          </span>
          <span class="time-commented">{{
            showFormatedDate(comment.posted_on)
          }}</span>
        </span>
        <span class="content" :id="`c${comment.id}`">
          {{ editedComment || comment.content }}
        </span>
        <div class="comment-options">
          <span
            class="reply-toggle comment-options-icon"
            title="reply"
            @click="replyToggle"
          >
            <!-- <fa-icon icon="reply" /> -->
            <ReplyIcon class="reply-icon" />
            <span class="reply-count"></span>
          </span>
          <span class="likes comment-options-icon" @click="setLikes(comment)">
            <ThumbsUp
              class="like-icon"
              :class="{ active: hasUserLiked(comment) }"
            />
            <span class="likeCount">{{ comment.likes }}</span>
          </span>
          <OptionsIcon
            class="comment-options-icon comment-options-tray-toggle"
            @click="toggleCommentOptions"
          />
          <ul
            class="comment-options-tray"
            :class="{ active: commentOptionToggle }"
          >
            <li @click="editComment" v-if="user?.uid === comment.user.id">
              Edit
            </li>
            <li @click="deleteComment" v-if="user?.uid === comment.user.id">
              Delete
            </li>
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
          @edit="commentContentChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment {
  display: flex;
  gap: 10px;
  .user-icon {
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

    .comment-options {
      display: flex;
      justify-content: flex-end;
      position: relative;
      gap: 15px;
      cursor: pointer;
      .likes,
      .reply-toggle {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .like-icon {
        width: 1.3rem;
        height: 1rem;
      }
      .reply-icon {
        height: 1rem;
        width: 1.3rem;
        stroke-width: 5;
      }
      .active {
        fill: var(--color-text);
      }
      .comment-options-icon {
        padding: 0.3rem;
        stroke-width: 3;
        height: 2rem;
        &:hover {
          background: var(--button-hover-color);
        }
      }
      .comment-options-tray {
        position: absolute;
        right: -1rem;
        top: 2rem;
        display: none;
        // align-items: center;
        flex-direction: column;
        background-color: var(--color-background);
        box-shadow: 2px 0 4px grey;
        min-width: 5rem;
        min-height: auto;
        list-style: none;
        z-index: 2;
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
  .anonymous-user {
    aspect-ratio: 1/1;
    width: 53px;
    height: 53px;
    border-radius: 50%;
    background-color: grey;
  }
}
</style>
