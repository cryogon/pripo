<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import BellIcon from "./Icons/BellIcon.vue";
import CheckIcon from "./Icons/CheckIcon.vue";
import { MARK_NOTIFICATION_READ } from "@/graphql";
import { useTimeAgo } from "@vueuse/core";

defineProps<{
  user: {
    username: string;
    profile_picture: string;
  };
  type: string;
  comment?: {
    content: string;
    id: number;
  };
  id: number;
  created_at: string;
  blog_id?: number;
}>();

function markRead(id: number) {
  const { mutate } = useMutation(MARK_NOTIFICATION_READ);
  mutate({ id });
}
function getDesc(type: string) {
  switch (type) {
    case "comment":
      return "ommented on your post";
    case "reply":
      return "replied to you comment";
    case "follow":
      return "followed you";
    default:
      return "Notification";
  }
}
</script>
<template>
  <div class="link container">
    <BellIcon class="bell" v-if="blog_id" />
    <img :src="user.profile_picture" alt="" class="avatar" v-else />
    <div class="info">
      <router-link
        v-if="blog_id"
        :to="`/posts/${blog_id}#c${comment?.id}`"
        class="user-info"
      >
        <span class="user">{{ user.username + " " }}</span>
        <span class="description"> {{ getDesc(type) }}</span>
        <p class="content" v-if="comment">
          {{
            comment.content.length < 20
              ? comment.content.substring(0, 20)
              : comment.content.substring(0, 20) + "..."
          }}
        </p>
      </router-link>
      <router-link v-else :to="`/users/${user.username}`" class="user-info">
        <span class="user">{{ user.username + " " }}</span>
        <span class="description"> {{ getDesc(type) }}</span>
      </router-link>
      <span class="time">{{ useTimeAgo(created_at).value }}</span>
    </div>
    <div class="check">
      <CheckIcon class="mark-read" @click="markRead(id)" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  padding: 0.2rem;
  padding-block-end: 1.4rem;
  color: var(--color-text);
  background-color: var(--dropdown-background);
  margin-block-end: 0.5rem;
  display: flex;
  font-size: 14px;
  gap: 10px;
  position: relative;

  .bell {
    width: 1.2rem;
    height: 2rem;
    align-self: flex-start;
  }
  .avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
  .info {
    padding-top: 0.4rem;
    .user-info {
      color: var(--color-text);
      padding: 0;
    }
    .time {
      margin-inline-start: 9rem;
      opacity: 0.6;
      position: absolute;
      right: 5px;
      bottom: 5px;
    }
    .user {
      font-weight: bolder;
    }
    .content {
      color: #dbff00;
    }
  }
  .check {
    display: none;
    margin-block-start: 0.3rem;
    margin-inline-start: auto;
    height: 1.4rem;
    padding: 0.2rem 0.5rem;
    &:hover {
      background-color: var(--link-hover-background);
    }
  }
  &:hover .check {
    display: block;
  }
}
</style>
