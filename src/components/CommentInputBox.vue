<script setup lang="ts">
import router from "@/router";
import { ref, inject } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useMutation } from "@vue/apollo-composable";
import { POST_COMMENT } from "@/graphql";

const commentInp = ref();
const { user } = useAuth0();
const buttonActive = ref(false);
const blogId: number = inject("blog_id") as number;
const isPublic = ref(false);
function postComment(content: string, blogId: number): void {
  const { mutate: postComment } = useMutation(POST_COMMENT);
  postComment({
    blogId: blogId,
    content,
    name: user.value.preferred_username || user.value.nickname,
    isPublic: isPublic.value,
  });
  commentInp.value.value = "";
  buttonActive.value = false;
}

function redirctToProfilePage(id: number) {
  router.push(`/users/${id}`);
}
function setRows(e: any): void {
  e.target.rows = (e.target.value.match(/\n/gm) || []).length + 2;
}
</script>
<template>
  <div class="commentInputSection" v-if="user?.nickname">
    <img
      :src="user.picture"
      alt="user"
      class="userIcon"
      @click="redirctToProfilePage(user.uid)"
      v-if="user"
    />
    <div class="anonymousUser" v-else></div>
    <div class="inputContainer">
      <textarea
        placeholder="Type you comment"
        class="comment_input"
        ref="commentInp"
        @input="setRows"
        :rows="2"
        cols="100"
        @focusin="buttonActive = true"
        required
      ></textarea>
      <div class="btnTgle">
        <button
          type="submit"
          class="postButton"
          @click="postComment(commentInp.value, blogId)"
        >
          Post
        </button>
        <span class="anonymousToggle">
          <input
            type="checkbox"
            name="anonymous"
            id="anonymous"
            v-model="isPublic"
          />
          <label for="anonymous">Post Publicly</label>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.commentInputSection {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-block: 1rem 2rem;
}
.inputContainer {
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
    resize: vertical;
    &:focus ~ .btnTgle {
      display: flex;
    }
  }
  .btnTgle {
    display: none;
    gap: 3rem;
    accent-color: var(--accent-color);
    &:hover {
      display: flex;
    }
    .anonymousToggle {
      display: flex;
      gap: 7px;
      margin-inline-end: 0.3rem;
      align-items: center;
      label {
        opacity: 0.8;
      }
    }
    .postButton {
      margin-inline-start: 1rem;
      border-radius: 1rem;
      padding: 0.4rem 1rem;
      align-self: flex-start;
      background: var(--accent-color);
      color: var(--text-color);
      font-size: 18px;
      transition: 150ms;
    }
  }
}
.userIcon {
  align-self: flex-start;
  grid-row: 1 / span 2;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
}

.postButton:hover {
  border-color: var(--text-color);
  background: var(--button-hover-color);
}
</style>
