<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import CheckIcon from "../components/Icons/CheckIcon.vue";
import { GET_NOTIFICATIONS, MARK_NOTIFICATION_READ } from "@/graphql";
import { useAuth0 } from "@auth0/auth0-vue";
import { ref } from "vue";
import { getTimeDifference } from "@/helper";
const { user } = useAuth0();
const { onResult } = useQuery(GET_NOTIFICATIONS, {
  user: user.value.nickname,
});
const notifications = ref();
const { mutate } = useMutation(MARK_NOTIFICATION_READ);

onResult((r) => {
  notifications.value = r.data?.user_notifications;
  console.log(notifications.value);
});

function dateFormatter(notification: any) {
  return getTimeDifference(new Date(notification.created_at), new Date());
}
function markRead(id: number) {
  mutate({ id });
}
</script>
<template>
  <main>
    <h1>Notifications</h1>
    <section class="notification-card">
      <div class="filters">
        <div role="button" class="all">All</div>
      </div>
      <div class="notifications-container">
        <div
          v-for="(notification, index) in notifications"
          :key="index"
          class="notification-item"
          :class="{ read: notification.has_read }"
        >
          <img
            :src="notification.sender.profile_picture"
            alt="user avatar"
            class="user-avatar"
            referrerpolicy="no-referrer"
          />
          <div class="notification-info">
            <div class="user-info">
              <span class="user"
                >{{ notification.sender.username + " " }}
              </span>
              <span class="action">commented on your post</span>
            </div>
            <div class="content">
              {{ notification.sender?.comments[0].content }}
            </div>
          </div>
          <div class="markread-and-date">
            <span
              class="check-icon-background"
              v-if="!notification.has_read"
              @click="markRead(notification.id)"
            >
              <CheckIcon class="checkicon" />
            </span>
            <span class="date">
              {{ dateFormatter(notification) }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<style scoped lang="scss">
main {
  padding: 1rem 10rem;
  .notification-card {
    background-color: var(--nav-background);
    padding: 0.2rem 1rem;
    .filters {
      display: flex;
      .all {
        margin: 0.4rem;
        padding: 0.4rem 1.4rem;
        border-radius: 2rem;
        background-color: var(--color-background);
      }
    }
    .notifications-container {
      .notification-item {
        margin-block: 0.2rem 1rem;
        &.read {
          opacity: 0.5;
        }
        background-color: var(--color-background);
        padding: 0.5rem;
        display: flex;
        column-gap: 10px;
        .user-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
        }
        .notification-info {
          .content {
            color: #dae937;
          }
        }
        .markread-and-date {
          margin-inline-start: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;

          .check-icon-background {
            padding: 0.3rem;
            background-color: var(--accent-color);
            border-radius: 1rem;
            .checkicon {
              width: 1.5rem;
              height: 1.2rem;
              padding-block-start: 0.2rem;
            }
          }
          .date {
            opacity: 0.7;
          }
        }
      }
    }
  }
}
</style>
