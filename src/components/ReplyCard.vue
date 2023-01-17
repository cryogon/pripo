<script setup lang="ts">
import ReplyInputBox from "./ReplyInputBox.vue";
import ThumbsUp from "./Icons/ThumbsUp.vue";
import { ref } from "vue";
import router from "@/router";
import { useAuth0 } from "@auth0/auth0-vue";
import { useMutation } from "@vue/apollo-composable";
import { SET_COMMENT_LIKE, REMOVE_COMMENT_LIKE } from "@/graphql";
defineProps<{
  reply: any;
}>();

const { user } = useAuth0();
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
    } else {
      removeLikes(variable);
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
            <ThumbsUp
              class="likeIcon"
              :class="{ active: hasUserLiked(reply) }"
            />
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
      .likeIcon {
        width: 1.3rem;
        height: 1rem;
      }
      .active {
        fill: var(--color-text);
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
