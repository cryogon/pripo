<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import BellIcon from "./Icons/BellIcon.vue";
import CheckIcon from "./Icons/CheckIcon.vue";
import { MARK_NOTIFICATION_READ } from "@/graphql";
import { useTimeAgo } from "@vueuse/core";

const props = defineProps<{
  user: string;
  desc: string;
  content: string;
  id: number;
  created_at: string;
  blog_id: number;
}>();
const date = new Date(props.created_at);
const timeDifference = useTimeAgo(date);

function markRead(id: number) {
  const { mutate } = useMutation(MARK_NOTIFICATION_READ);
  mutate({ id });
}
</script>
<template>
  <div class="link container">
    <BellIcon class="bell" />
    <div class="info">
      <router-link :to="`/posts/${blog_id}#c${id}`" class="user-info">
        <span class="user">{{ user + " " }}</span>
        <span class="description"> {{ desc }}</span>
        <p class="content">
          {{
            content.length < 20
              ? content.substring(0, 20)
              : content.substring(0, 20) + "..."
          }}
        </p>
      </router-link>
      <span class="time">{{ timeDifference }}</span>
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
