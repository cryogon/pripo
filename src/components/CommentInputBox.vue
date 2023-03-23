<script setup lang="ts">
import { ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useMutation } from "@vue/apollo-composable";
import { POST_COMMENT, INSERT_NOTIFICATION } from "@/graphql";
import { useEmitter } from "@/composables/EventEmitter";
import { setImageQuality } from "@/utils/setImageQuality";
import type { Blog } from "@/types";

defineProps<{
  blog: Blog;
}>();
const emitter = useEmitter();
const commentInp = ref();
const { user } = useAuth0();
const isPublic = ref(false);
const focusedOnCommentBox = ref(false);

function postComment(content: string, blogId: number, author: string) {
  if (!content) {
    emitter.emit("alert", "Can't post empty comment");
    return;
  }
  const { mutate: postComment } = useMutation(POST_COMMENT);
  const variables = {
    blog_id: blogId,
    content,
    username: user.value.nickname,
    is_public: isPublic.value,
  };
  const commentId = postComment(variables).then(
    (data) => data?.data.insert_comments.returning[0].id
  );
  //Means if sender and reciver is same person then don't send notification
  if (user.value.nickname !== author) {
    const { mutate: sendNotification } = useMutation(INSERT_NOTIFICATION);
    sendNotification({
      sender: user.value.nickname,
      receiver: author,
      blog_id: blogId,
      comment_id: commentId,
    });
  }
  emitter.emit("refetchComments");
  commentInp.value = "";
  focusedOnCommentBox.value = false;
}

function setRows(e: any): void {
  if ((e.target.value.match(/\n/gm) || []).length == 0) {
    e.target.rows = 2;
    return;
  }
  e.target.rows = (e.target.value.match(/\n/gm) || []).length + 4;
}

//Comment Input Toggle
function toggleInputBox() {
  setTimeout(() => {
    document.addEventListener(
      "click",
      (e: any) => {
        if (e.target && focusedOnCommentBox.value) {
          if (!e.target.className.includes("input-active-area")) {
            focusedOnCommentBox.value = false;
          }
        }
      },
      { once: true }
    );
  }, 10);
  focusedOnCommentBox.value = true;
}
</script>
<template>
  <div class="comment-input-section" v-if="user?.nickname">
    <router-link :to="`/users/${user.nickname}`">
      <img
        :src="setImageQuality(user.picture, { width: 196, height: 196 })"
        alt="user"
        class="user-icon"
      />
    </router-link>
    <div class="input-container">
      <textarea
        placeholder="Type you comment"
        class="comment_input input-active-area"
        :class="{ active: focusedOnCommentBox }"
        v-model="commentInp"
        @input="setRows"
        :rows="2"
        cols="100"
        @click="toggleInputBox"
        autocomplete="off"
        required
      ></textarea>
      <div
        class="btn-tgle input-active-area"
        :class="{ active: focusedOnCommentBox }"
      >
        <button
          type="submit"
          class="post-button input-active-area"
          @click="postComment(commentInp, blog.id, blog?.user.username)"
        >
          Post
        </button>
        <span class="anonymous-toggle">
          <input
            type="checkbox"
            name="anonymous"
            id="anonymous"
            class="private-toggle input-active-area"
            v-model="isPublic"
          />
          <label for="anonymous" class="private-toggle-text input-active-area"
            >Post Publicly</label
          >
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment-input-section {
  display: flex;
  gap: 10px;
  margin-block: 1rem 2rem;
  align-items: center;
  a {
    padding: 0;
  }
}
.input-container {
  position: relative;
  background-color: var(--input-box-background);
  display: flex;
  border-radius: 2rem;
  flex-direction: column;
  .comment_input {
    border-radius: 1rem;
    background-color: var(--input-box-background);
    font-family: inherit;
    outline: none;
    border: none;
    width: 100%;
    color: var(--text-color);
    padding: 0.6rem 1rem;
    min-height: 3rem;
    resize: none;

    &.active {
      // resize: vertical;
      min-height: 5rem;
    }
  }
  .btn-tgle {
    display: none;
    gap: 3rem;
    accent-color: var(--accent-color);
    margin-block-end: 0.6rem;
    &:hover {
      display: flex;
    }
    &.active {
      display: flex;
    }
    .anonymous-toggle {
      display: flex;
      gap: 7px;
      margin-inline-end: 0.3rem;
      align-items: center;
      label {
        opacity: 0.8;
      }
    }
    .post-button {
      margin-inline-start: 1rem;
      border-radius: 1rem;
      padding: 0.35rem 1.2rem;
      align-self: flex-start;
      background: var(--accent-color);
      color: var(--text-color);
      font-size: 18px;
      transition: 150ms;
      outline-color: transparent;
    }
  }
}
.user-icon {
  align-self: flex-start;
  grid-row: 1 / span 2;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
}

.post-button:hover {
  border-color: var(--text-color);
  background: var(--button-hover-color);
}
</style>
