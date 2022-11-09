<script setup lang="ts">
import router from "@/router";
import { usePripoStore } from "@/stores";
import { ref } from "vue";

const params = router.currentRoute.value.params;
const blogId: unknown = params.id as string;
const store = usePripoStore();
const blog = store.blogs.filter((b) => b.id == (blogId as number))[0];
const user = {
  pfp: "/mypfp.jpg",
  name: "Jatin Thakur",
};
localStorage.setItem("currentTitle", blog.title + " - Pripo");

const commentInp = ref();
const comments = ref(blog.comment);

function setRows(): void {
  commentInp.value.rows =
    (commentInp.value.value.match(/\n/gm) || []).length + 2;
}

function postComment(userPfp: string, username: string, content: string): void {
  const postedOn = new Date().toString();
  if (content.length > 0) {
    comments.value.push({ userPfp, username, content, postedOn });
    commentInp.value.value = "";
  }
}
</script>

<template>
  <div class="container">
    <div class="author">
      <div class="authorPfp anonymous" v-if="!blog.isPublic"></div>
      <img :src="blog.userPfp" alt="author" class="authorPfp" v-else />
      <span class="author_name"
        >Posted by {{ blog.isPublic ? blog.user : "Anonymous" }}</span
      >
    </div>
    <h1 class="title">{{ blog.title }}</h1>
    <div class="content">
      <p>
        {{ blog.content }}
      </p>
      <div class="tags">
        <span v-for="tag in blog.tags" :key="tag" class="link">#{{ tag }}</span>
      </div>
      <span class="date-posted">posted {{ blog.date_posted }}</span>
    </div>
    <div class="comment_section">
      <div class="commentInputSection">
        <img src="/mypfp.jpg" alt="user" class="userIcon" />
        <textarea
          placeholder="Type you comment"
          class="comment_input"
          ref="commentInp"
          @input="setRows"
          :rows="0"
          cols="100"
          required
        ></textarea>
        <button
          type="submit"
          class="postButton"
          @click="postComment(user.pfp, user.name, commentInp.value)"
        >
          Post
        </button>
      </div>

      <div class="comments" v-for="comment in comments" :key="comment.content">
        <img :src="comment.userPfp" alt="user" class="userIcon" />
        <div class="currentUser">
          {{ comment.username }}
          <span class="time-commented">{{ comment.postedOn }}</span>
        </div>
        <div class="postedComment">
          {{ comment.content }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  padding-block-start: 3rem;
  padding-inline: min(10rem, 10vw);
  max-width: 80rem;
}
.title,
.content p {
  margin-block-end: 0.8rem;
  line-height: 1.4rem;
}
.content p {
  white-space: pre-wrap;
}
.title {
  line-height: 2.4rem;
}
.date-posted {
  display: flex;
  justify-content: flex-end;
  opacity: 0.7;
}

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
.author {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.6rem;
}
.userIcon,
.authorPfp {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
.anonymous {
  background-color: white;
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
.userIcon {
  align-self: flex-start;
  grid-row: 1 / span 2;
}

.comments {
  display: grid;
  grid-template-columns: 3rem 1fr;
  grid-template-rows: 1rem 1fr;
  align-items: center;
  margin-block: 1rem;
  gap: 10px;
}
.postedComment {
  background: var(--card-background);
  min-height: 4rem;
  width: 49rem;
  padding: 0.5rem 1rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.currentUser {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  opacity: 0.6;
}
</style>
