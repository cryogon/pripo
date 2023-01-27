<script setup lang="ts">
import { LISTEN_NOTIFICATION } from "@/graphql";
import router from "@/router";
import { useSubscription } from "@vue/apollo-composable";
import { watch, ref } from "vue";
import NotificationItem from "./NotificationItem.vue";
const { result } = useSubscription(LISTEN_NOTIFICATION);
const notifications = ref<any[]>([]);
watch(result, (data) => {
  notifications.value = data.user_notifications;
});
function redirectTo(address: string, notification: any) {
  switch (address) {
    case "comment":
      router.push(
        `/posts/${notification.blog.id}#c${notification.sender?.comments[0].id}`
      );
      break;
    case "reply":
      router.push(`/posts/${notification.blog.id}#c${notification.comment_id}`);
      break;
  }
}
</script>
<template>
  <section>
    <div class="notification-group">
      <span class="notification-count">{{ notifications.length }}</span>
      <NotificationItem
        v-for="(notification, index) in notifications"
        :key="index"
        :content="notification.sender?.comments[0].content"
        :desc="
          notification.type === 'comment'
            ? 'commented on your post'
            : 'replied to your comment'
        "
        :user="notification.sender?.username"
        @click="redirectTo(notification.type, notification)"
      />
    </div>
    <div class="options-group">
      <button class="read-all">Read All</button>
    </div>
  </section>
</template>
<style scoped lang="scss">
section {
  padding: 0.5rem;
  position: absolute;
  top: 4rem;
  left: -11rem;
  min-width: 20rem;
  min-height: 10rem;
  background-color: var(--nav-background);
  z-index: 99;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .notification-group {
    .notification-count {
      display: flex;
      justify-content: center;
      background-color: var(--dropdown-background);
      padding: 0.1rem 1.2rem;
      border-radius: 2rem;
      width: 2rem;
      margin-block-end: 0.5rem;
    }
  }
  .options-group {
    .read-all {
      background-color: var(--accent-color);
      padding: 0.3rem 0.9rem;
      border-radius: 2rem;
    }
  }
}
</style>
