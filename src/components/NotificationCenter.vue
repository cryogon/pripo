<script setup lang="ts">
import { MARK_ALL_NOTIFICATION_READ } from "@/graphql";
import router from "@/router";
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import NotificationItem from "./NotificationItem.vue";
import { usePripoStore } from "@/stores";
const store = usePripoStore();

const notifications = ref<any[]>([]);
store.notification.onResult((n) => {
  notifications.value = n.data.user_notifications || [];
});

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
        :comment="notification?.comment"
        :type="notification.type"
        :user="notification.sender"
        :created_at="notification.created_at"
        :blog_id="notification?.blog && notification.blog?.id"
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
  min-width: 21rem;
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
