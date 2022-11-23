<script setup lang="ts">
import { usePripoStore } from "@/stores";
import type { User } from "@/types";
import { storeToRefs } from "pinia";
import router from "@/router";
import { ref } from "vue";

const commentInp = ref();
const { user } = storeToRefs(usePripoStore());

const emit = defineEmits(["postComment"]);
function postComment(user: User, content: string): void {
  if (content.trim().length > 0) {
    const data = {
      id: 0,
      user,
      content,
      postedOn: new Date(),
      likes: {
        count: 0,
        users: [],
      },
    };
    emit("postComment", data);
  }
  commentInp.value.value = "";
}

function redirctToProfilePage(id: number) {
  router.push(`/user/${id}`);
}
function setRows(e: any): void {
  e.target.rows = (e.target.value.match(/\n/gm) || []).length + 2;
}
</script>
<template>
  <div class="commentInputSection">
    <img
      src="/mypfp.jpg"
      alt="user"
      class="userIcon"
      @click="redirctToProfilePage(user.id)"
    />
    <textarea
      placeholder="Type you comment"
      class="comment_input"
      ref="commentInp"
      @input="setRows"
      :rows="2"
      cols="100"
      required
    ></textarea>
    <button
      type="submit"
      class="postButton"
      @click="postComment(user, commentInp.value)"
    >
      Post
    </button>
  </div>
</template>

<style scoped lang="scss">
.commentInputSection {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-block: 1rem 2rem;
}
.comment_input {
  background-color: var(--card-background);
  outline: none;
  border: none;
  color: var(--text-color);
  padding: 0.6rem 1rem;
  resize: none;
}
.userIcon {
  align-self: flex-start;
  grid-row: 1 / span 2;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
}
.postButton {
  margin-inline-start: 1rem;
  border-radius: 1rem;
  padding: 0.6rem 1.6rem;
  align-self: flex-start;
  background: transparent;
  color: var(--text-color);
  font-size: 20px;
  transition: 150ms;
}
.postButton:hover {
  border-color: var(--text-color);
  background: var(--button-hover-color);
}
</style>
