<script setup lang="ts">
import { LISTEN_NOTIFICATION, MARK_ALL_NOTIFICATION_READ } from "@/graphql";
import router from "@/router";
import { useSubscription, useMutation } from "@vue/apollo-composable";
import { watch, ref } from "vue";
import NotificationItem from "./NotificationItem.vue";
const { result } = useSubscription(LISTEN_NOTIFICATION);
const notifications = ref<any[]>([]);
watch(result, (data) => {
  notifications.value = data.user_notifications || [];
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

function markAllRead(username: string) {
  const { mutate } = useMutation(MARK_ALL_NOTIFICATION_READ);
  mutate({ username });
}
</script>
<template>
  <section>
    <div class="notification-group">
      <span class="notification-count">{{ notifications.length }}</span>
      <NotificationItem
        v-for="(notification, index) in notifications"
        :key="index"
        :id="notification.id"
        :content="notification.sender?.comments[0].content"
        :desc="
          notification.type === 'comment'
            ? 'commented on your post'
            : 'replied to your comment'
        "
        :user="notification.sender?.username"
        :created_at="notification.created_at"
        @click="redirectTo(notification.type, notification)"
      />
    </div>
    <div class="options-group">
      <button
        class="option-icon"
        @click="markAllRead(notifications[0].notification_for)"
        :disabled="!notifications.length"
      >
        Mark All
      </button>
      <!-- <span v-else>already read</span> -->
      <button class="option-icon" @click="router.push(`/notifications`)">
        See All
      </button>
    </div>
  </section>
</template>
<style scoped lang="scss">
section {
  padding: 0.5rem;
  position: absolute;
  top: 4rem;
  right: -5rem;
  min-width: 23rem;
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
    display: flex;
    justify-content: space-between;
    .option-icon {
      background-color: var(--accent-color);
      padding: 0.3rem 0.9rem;
      border-radius: 2rem;
    }
  }
}
</style>
