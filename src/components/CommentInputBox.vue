<script setup lang="ts">
import router from "@/router";
import { ref, inject } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useMutation } from "@vue/apollo-composable";
import { POST_COMMENT } from "@/graphql";

const commentInp = ref();
const { user } = useAuth0();
const blogId: number = inject("blog_id") as number;
const isPublic = ref(false);
const focusedOnCommentBox = ref(false);
function postComment(content: string, blogId: number): void {
  const { mutate: postComment } = useMutation(POST_COMMENT);
  postComment({
    blogId: blogId,
    content,
    name: user.value.preferred_username || user.value.nickname,
    isPublic: isPublic.value,
  });
  commentInp.value = "";
  focusedOnCommentBox.value = false;
}

function redirctToProfilePage(id: number) {
  router.push(`/users/${id}`);
}
function setRows(e: any): void {
  if ((e.target.value.match(/\n/gm) || []).length == 0) {
    e.target.rows = 2;
    return;
  }
  e.target.rows = (e.target.value.match(/\n/gm) || []).length + 4;
}

//Comment Input Toggle
document.addEventListener("click", (e: any) => {
  if (e.target) {
    if (e.target.className.includes("input-active-area")) {
      focusedOnCommentBox.value = true;
    } else {
      focusedOnCommentBox.value = false;
    }
  }
});
</script>
<template>
  <div class="comment-input-section" v-if="user?.nickname">
    <img
      :src="user.picture"
      alt="user"
      class="user-icon"
      @click="redirctToProfilePage(user.uid)"
      v-if="user"
    />
    <div class="anonymousUser" v-else></div>
    <div class="input-container">
      <textarea
        placeholder="Type you comment"
        class="comment_input input-active-area"
        :class="{ active: focusedOnCommentBox }"
        v-model="commentInp"
        @input="setRows"
        :rows="2"
        cols="100"
        required
      ></textarea>
      <div
        class="btn-tgle input-active-area"
        :class="{ active: focusedOnCommentBox }"
      >
        <button
          type="submit"
          class="post-button input-active-area"
          @click="postComment(commentInp, blogId)"
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
  align-items: center;
  gap: 10px;
  margin-block: 1rem 2rem;
}
.input-container {
  position: relative;
  background-color: var(--card-background);
  display: flex;
  flex-direction: column;
  .comment_input {
    background-color: var(--card-background);
    outline: none;
    border: none;
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
