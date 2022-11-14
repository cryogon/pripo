<script setup lang="ts">
import router from "@/router";

defineProps<{
  id: number;
  user: {
    id: number;
    name: string;
    pfp: string;
  };
  tags?: string[];
  title: string;
  content: string;
  isPublic: boolean;
  date_posted: string | Date;
  comment?: {
    user: {
      id: number;
      pfp: string;
      name: string;
    };
    content: string;
    postedOn: Date | string;
  }[];
}>();

function showFormatedDate(date: Date | string | number) {
  return Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function navigateTo(url: string) {
  router.push(url);
}
</script>

<template>
  <div class="container">
    <h4 class="header">
      <img
        :src="user.pfp"
        alt="userProfile"
        class="user-profile-picture"
        v-if="isPublic"
      />
      <div class="user-profile-picture" v-else></div>
      <span class="username">{{ isPublic ? user.name : "Anonymous" }}</span>
      <span class="tags">
        about
        <span class="tag" v-for="tag in tags" :key="tag">
          {{ tag + " " }}</span
        ></span
      >
      <span class="post-date"
        >posted
        <span class="date"> {{ showFormatedDate(date_posted) }}</span></span
      >
    </h4>
    <p class="content" @click="navigateTo(`/blogs/${id}`)">
      <span class="title">{{ title }}</span>
      {{ content }}
    </p>
    <div class="recent-comment" v-if="comment">
      <img
        :src="comment[0].user.pfp"
        class="comment-user-profile"
        alt="user"
        v-if="isPublic && comment[0].user.pfp"
      />
      <div class="comment-user-profile" v-else></div>
      <span class="comment">{{ comment[0]?.content }}</span>
    </div>
  </div>
</template>
<style scoped>
.header {
  display: flex;
  align-items: center;
}
.user-profile-picture {
  width: 53px;
  height: 53px;
  border-radius: 50%;
  background-color: white;
}
.username {
  padding-inline: 0.3rem;
}

.tags {
  font-size: 14px;
  font-weight: normal;
}
.tag {
  cursor: pointer;
  color: var(--link-color);
}
.post-date {
  font-weight: normal;
  margin-inline-end: 0.8rem;
  opacity: 0.7;
  margin-left: auto;
}
.content {
  cursor: pointer;
  background-color: var(--card-background);
  margin-block-start: 0.5rem;
  max-width: 80rem;
  max-height: 15rem;
  overflow: hidden;
  padding: 1rem;
  line-height: 1.3rem;
}
.title {
  display: block;
  font-weight: bold;
  font-size: 25px;
  margin-block-end: 0.7rem;
}

.recent-comment {
  display: flex;
  align-items: center;
}
.comment-user-profile {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  margin: 0.5rem;
  margin-inline-start: 5rem;
  background-color: white;
}
.comment {
  background-color: var(--card-background);
  padding: 0.5rem 1rem;
}
</style>
