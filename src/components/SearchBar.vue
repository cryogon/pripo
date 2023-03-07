<script setup lang="ts">
import alogolia from "algoliasearch";
import { ref, watchEffect } from "vue";
const client = alogolia(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_API_KEY
);
const query = ref("");
const postsIndex = client.initIndex("posts");
const usersIndex = client.initIndex("users");
const posts = ref();
const users = ref();
watchEffect(() => {
  postsIndex
    .search(query.value, {
      hitsPerPage: 5,
    })
    .then(({ hits }) => {
      posts.value = hits;
    })
    .catch((err) => {
      console.error(err);
    });

  usersIndex
    .search(query.value, {
      hitsPerPage: 5,
    })
    .then(({ hits }) => {
      users.value = hits;
    })
    .catch((err) => {
      console.error(err);
    });
});
</script>
<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="query"
      class="search-bar__input"
      placeholder="Search"
    />
    <div v-show="query.length" class="search-bar__results">
      <section class="search-bar__results-users">
        <h3>Users</h3>
        <div class="users-list" v-if="users?.length">
          <router-link
            :to="`/users/${user.username}`"
            v-for="(user, index) in users"
            :key="index"
            class="users-list__item"
          >
            <img
              :src="user.profile_picture"
              alt="user"
              class="users-list__profile-picture"
            />
            <div class="search-bar__user-info">
              <span class="users-list__fullname">
                {{ user.name }}
              </span>
              <span class="users-list__username">
                {{ user.username }}
              </span>
            </div>
          </router-link>
        </div>
        <div v-else>User not found</div>
      </section>
      <section class="search-bar__results-posts">
        <h3>Posts</h3>
        <div class="posts-list" v-if="posts?.length">
          <div v-for="(post, index) in posts" :key="index">
            {{ post.title }}
          </div>
        </div>
        <div v-else>Posts not found</div>
      </section>
    </div>
  </div>
</template>
<style scoped lang="scss">
.search-bar {
  position: absolute;
  left: 50%;
  width: 40rem;
  display: flex;
  flex-direction: column;
  background-color: #202020;
  transform: translateX(-50%);

  .search-bar__input {
    padding: 1rem 0.5rem;
    border: 0;
    color: var(--color-text);
    border-radius: 0.3rem;
    width: 100%;
    background-color: #303030;
  }
  .search-bar__results {
    margin-block-start: 0.5rem;
    .users-list__item {
      display: flex;
      margin: 0.7rem 0.4rem;
      gap: 10px;
      align-items: center;
      &:hover {
        cursor: pointer;
        background-color: #303030;
      }
      .search-bar__user-info {
        display: flex;
        flex-direction: column;
      }
      .users-list__profile-picture {
        width: 3rem;
        aspect-ratio: 1/1;
        border-radius: 1rem;
      }
    }
  }
  @media screen and (max-width: 700px) {
    width: 28rem;
  }
  @media screen and (max-width: 500px) {
    width: 23rem;
  }
}
</style>
