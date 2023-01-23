<script setup lang="ts">
import router from "@/router";
defineProps<{
  id: number;
  user: {
    id: number;
    username: string;
    profile_picture: string;
  };
  tags?: string[];
  title: string;
  content: string;
  isPublic: boolean;
  date_posted: string | Date;
  comment?: {
    id: number;
    content: string;
    user: {
      id: number;
      username: string;
      profile_picture: string;
    };
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
        :src="user?.profile_picture"
        alt="userProfile"
        class="user-profile-picture"
        @click="navigateTo(`/users/${user?.id}`)"
        style="cursor: pointer"
        v-if="isPublic"
      />
      <div class="user-profile-picture" v-else></div>
      <span class="username">{{
        isPublic ? user?.username : "Anonymous"
      }}</span>
      <span class="tags">
        posted about
        <span class="tag" v-for="tag in tags" :key="tag"> {{ tag + " " }}</span>
      </span>
      <span class="post-date">
        posted
        <span class="date"> {{ showFormatedDate(date_posted) }}</span>
      </span>
    </h4>
    <div v-if="title && content">
      <p class="content" @click="navigateTo(`/posts/${id}`)">
        <span class="title">{{ title }}</span>
        {{ JSON.parse(content) }}
      </p>
    </div>

    <div class="recent-comment" v-if="comment && comment[0]?.id">
      <img
        :src="comment[0].user?.profile_picture"
        class="comment-user-profile"
        alt="user"
        v-if="isPublic && comment[0].user?.profile_picture"
      />
      <div class="comment-user-profile" v-else></div>
      <span class="comment">{{ comment[0].content }}</span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  .header {
    display: flex;
    align-items: center;
  }
  .user-profile-picture {
    aspect-ratio: 1/1;
    width: 53px;
    height: 53px;
    border-radius: 50%;
    background-color: grey;
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
    position: relative;
  }
  .tag:hover {
    background-color: var(--link-hover-background);
  }
  .tag:not(:last-child):after {
    content: ", ";
    position: absolute;
    right: 0;
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
    min-height: 5rem;
    overflow: hidden;
    padding: 1rem 1rem 0 1rem;
    line-height: 1.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
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
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    margin: 0.5rem;
    margin-inline-start: 7%;
    background-color: white;
  }
  .comment {
    background-color: var(--card-background);
    padding: 0.5em 1rem;
  }
}
</style>
