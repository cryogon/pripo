<script setup lang="ts">
import type { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-vue";
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { FOLLOW_USER, UNFOLLOW_USER, GET_FILTERED_POSTS } from "@/graphql";
import router from "@/router";
const query = router.currentRoute.value.query;
defineProps<{
  user: User | any;
}>();
const { user: u } = useAuth0();
const followed = ref(false);
function isFollowed(user: any) {
  for (let follower of user.followers || []) {
    if (follower.user.username === u.value.nickname) {
      return true;
    }
  }
  return false;
}
function isMe(user: User) {
  return user.username === u.value.nickname;
}

//TODO:Update Cache after following
function followUser(user: User) {
  const { mutate } = useMutation(FOLLOW_USER, {
    update(cache, { data: follow }) {
      let data = cache.readQuery({
        query: GET_FILTERED_POSTS,
        variables: {
          query: `%${query.q}%`,
        },
      }) as any;
      let u = structuredClone(
        data.users.filter(
          (user: any) =>
            user.id === follow.insert_follow_system.returning[0].followers.id
        )
      );
      let follower = {
        __typename: follow.insert_follow_system.returning[0].__typename,
        user: {
          __typename: "users",
          username:
            follow.insert_follow_system.returning[0].followings.username,
        },
      };
      u[0].followers.push(follower);
      data = {
        blogs: data.blogs,
        users: [
          ...data.users.filter(
            (user: any) =>
              user.id != follow.insert_follow_system.returning[0].followers.id
          ),
          u[0],
        ],
      };
      cache.writeQuery({ query: GET_FILTERED_POSTS, data });
    },
  });
  mutate({ me: u.value.nickname, user: user.username });
  followed.value = true;
}
function unfollowUser(user: User) {
  const { mutate } = useMutation(UNFOLLOW_USER);
  mutate({ me: u.value.nickname, user: user.username });
  followed.value = false;
}
</script>
<template>
  <div class="user-item">
    <router-link :to="`users/${user.username}`">
      <img
        :src="user.profile_picture"
        alt="user-avatar"
        referrerpolicy="no-referrer"
        class="user-avatar"
      />
    </router-link>
    <router-link :to="`users/${user.username}`">
      <div class="user-info">
        <span>
          <span class="name">{{ user.name }}</span>
          <span class="location">{{ user.location }}</span>
        </span>
        <span class="username">{{ "@" + user.username }}</span>
      </div>
    </router-link>
    <div class="options" v-if="!isMe(user)">
      <button class="follow" @click="followUser(user)" v-if="!isFollowed(user)">
        Follow
      </button>
      <button class="unfollow" @click="unfollowUser(user)" v-else>
        Unfollow
      </button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.user-item {
  margin-block: 0.7rem 1.5rem;
  min-height: 4rem;

  background-color: var(--color-background);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  column-gap: 10px;
  padding-inline-end: 1rem;
  a {
    padding: 0;
    .user-avatar {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      cursor: pointer;
    }
    color: var(--color-text);
    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      .name {
        font-weight: 600;
      }
      .location {
        margin-inline-start: 0.5rem;
        font-size: 14px;
        opacity: 0.8;
      }
      .username {
        color: var(--accent-color);
        font-size: 14px;
      }
    }
  }
  .options {
    margin-inline-start: auto;
    button {
      margin: 0.4rem;
      padding: 0.4rem 1.4rem;
      border-radius: 2rem;
      background-color: var(--accent-color);
      cursor: pointer;
      outline: none;
      border: none;
      color: var(--text-color);
      &.follow {
        background-color: var(--accent-color);
      }
      &.unfollow {
        background-color: grey;
      }
    }
  }
}
</style>
