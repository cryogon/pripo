<script setup lang="ts">
import router from "@/router";
import { ref, inject } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useMutation } from "@vue/apollo-composable";
import { POST_COMMENT } from "@/graphql";

const commentInp = ref();
const { user } = useAuth0();
const blogId: number = inject("blog_id") as number;
function postComment(content: string, blogId: number): void {
  const { mutate } = useMutation(POST_COMMENT);
  mutate({
    blogId: blogId,
    content,
    name: user.value.preferred_username || user.value.nickname,
  });
  commentInp.value.value = "";
}

function redirctToProfilePage(id: number) {
  router.push(`/users/${id}`);
}
function setRows(e: any): void {
  e.target.rows = (e.target.value.match(/\n/gm) || []).length + 2;
}
</script>
<template>
  <div class="commentInputSection" v-if="user">
    <img
      :src="user.picture"
      alt="user"
      class="userIcon"
      @click="redirctToProfilePage(user.uid)"
      v-if="user"
    />
    <div class="anonymousUser" v-else></div>
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
      @click="postComment(commentInp.value, blogId)"
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
