<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import CheckIcon from "../components/Icons/CheckIcon.vue";
import { GET_NOTIFICATIONS, MARK_NOTIFICATION_READ } from "@/graphql";
import { useAuth0 } from "@auth0/auth0-vue";
import { ref } from "vue";
import LoadingScreen from "../components/LoadingScreen.vue";
import { useTimeAgo } from "@vueuse/core";

const { user } = useAuth0();
const { onResult, loading } = useQuery(GET_NOTIFICATIONS, {
  user: user.value.nickname,
});

const notifications = ref();
const { mutate } = useMutation(MARK_NOTIFICATION_READ);
const filter = ref("all");
document.title = `${user.value.nickname} ● Notifications`;
onResult((r) => {
  notifications.value = r.data?.user_notifications;
});

function dateFormatter(notification: any) {
  return useTimeAgo(new Date(notification.created_at)).value;
}
function markRead(id: number) {
  mutate({ id });
}

function getFilteredComments(): any {
  if (filter.value === "all") {
    return notifications.value;
  }
  if (filter.value === "read") {
    return notifications.value.filter((n: any) => n.has_read === true);
  }
  return notifications.value.filter((n: any) => n.has_read === false);
}
function getDesc(type: string) {
  switch (type) {
    case "comment":
      return "commented on your post";
    case "reply":
      return "replied to your comment";
    case "follow":
      return "followed you";
    default:
      return "Notification";
  }
}
</script>
<template>
  <main v-if="notifications && !loading">
    <h1>Notifications</h1>
    <section class="notification-card">
      <div class="filters">
        <div
          role="button"
          class="filter-option"
          @click="filter = 'all'"
          :class="{ selected: filter === 'all' }"
        >
          All
        </div>
        <div
          role="button"
          class="filter-option"
          @click="filter = 'unread'"
          :class="{ selected: filter === 'unread' }"
        >
          Unread
        </div>
        <div
          role="button"
          class="filter-option"
          @click="filter = 'read'"
          :class="{ selected: filter === 'read' }"
        >
          Read
        </div>
      </div>
      <div class="notifications-container" v-if="getFilteredComments()?.length">
        <div
          v-for="(notification, index) in getFilteredComments()"
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
          <router-link
            v-if="notification.blog_id"
            :to="`/posts/${notification.blog_id}#c${notification.comment.id}`"
          >
            <div class="notification-info">
              <div class="user-info">
                <span class="user"
                  >{{ notification.sender.username + " " }}
                </span>
                <span class="action">{{ getDesc(notification.type) }}</span>
              </div>
              <div class="content">
                {{ notification.comment.content }}
              </div>
            </div>
          </router-link>
          <router-link
            v-else
            :to="`/users/${notification.sender.username}`"
            class="user-info"
          >
            <span class="user">{{ notification.sender.username + " " }}</span>
            <span class="description"> {{ getDesc(notification.type) }}</span>
          </router-link>
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
      <div v-else>No Notification Found</div>
    </section>
  </main>
  <LoadingScreen v-else />
</template>
<style scoped lang="scss">
main {
  padding: 1rem 10rem;
  .notification-card {
    background-color: var(--nav-background);
    padding: 0.2rem 1rem;
    .filters {
      display: flex;
      .filter-option {
        margin: 0.4rem;
        padding: 0.4rem 1.4rem;
        border-radius: 2rem;
        background-color: var(--color-background);
        cursor: pointer;
        &.selected {
          background-color: #00000000;
        }
      }
    }
    .notifications-container {
      .notification-item {
        margin-block: 0.7rem 1.5rem;
        min-height: 4rem;
        cursor: pointer;
        &.read {
          opacity: 0.8;
        }
        background-color: var(--color-background);
        padding: 0.5rem;
        display: flex;
        column-gap: 10px;
        align-items: center;
        .user-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
        }
        a {
          color: var(--text-color);
        }
        .notification-info {
          .user-info {
            margin-block-start: 0.2rem;
          }
          .content {
            margin-block: 0.4rem;
            color: #dae937;
            font-size: 13px;
          }
        }
        .markread-and-date {
          margin-inline-start: auto;
          display: flex;
          align-self: flex-end;
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
  @media (max-width: 700px) {
    padding: 1rem 0.3rem;
  }
}
</style>
