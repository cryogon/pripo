<script setup lang="ts">
import alogolia from "algoliasearch";
import { ref, watchEffect, onMounted } from "vue";
const emit = defineEmits(["close"]);
const client = alogolia(
  import.meta.env.VITE_ALGOLIA_APP_ID,
  import.meta.env.VITE_ALGOLIA_API_KEY
);
const query = ref("");
const postsIndex = client.initIndex("posts");
const usersIndex = client.initIndex("users");
const posts = ref();
const users = ref();
const userSearchMore = ref(false);
const postSearchMore = ref(false);
const searchBar = ref();

watchEffect(() => {
  postsIndex
    .search(query.value, {
      hitsPerPage: 5,
    })
    .then((res) => {
      if (res.nbHits > 5) {
        postSearchMore.value = true;
      } else {
        postSearchMore.value = false;
      }
      posts.value = res.hits;
    })
    .catch((err) => {
      console.error(err);
    });

  usersIndex
    .search(query.value, {
      hitsPerPage: 5,
    })
    .then((res) => {
      if (res.nbHits > 5) {
        userSearchMore.value = true;
      } else {
        userSearchMore.value = false;
      }
      users.value = res.hits;
    })
    .catch((err) => {
      console.error(err);
    });
});
onMounted(() => {
  searchBar.value.focus();
});
</script>
<template>
  <div class="search-bar">
    <div class="search-bar__input-container">
      <input
        type="text"
        v-model="query"
        ref="searchBar"
        class="search-bar__input"
        placeholder="Search"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
      />

      <button type="button" @click="emit('close')" class="close-button">
        Close
      </button>
    </div>
    <div v-if="query.length" class="search-bar__results">
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
          <router-link
            :to="`/search?f=users&q=${query}`"
            class="search-bar__options"
            v-show="userSearchMore"
          >
            Search More
          </router-link>
        </div>
        <div v-else>User not found</div>
      </section>
      <section class="search-bar__results-posts">
        <h3>Posts</h3>
        <div class="posts-list" v-if="posts?.length">
          <router-link
            :to="`/posts/${post.id}`"
            v-for="(post, index) in posts"
            :key="index"
            class="posts-list__item"
          >
            {{ post.title }}
          </router-link>
          <router-link
            :to="`/search?f=posts&q=${query}`"
            class="search-bar__options"
            v-show="postSearchMore"
          >
            Search More
          </router-link>
        </div>
        <div v-else>Posts not found</div>
      </section>
    </div>
  </div>
</template>
<style scoped lang="scss">
.search-bar {
  position: fixed;
  left: 50%;
  width: 40rem;
  display: flex;
  flex-direction: column;
  background-color: #202020;
  transform: translateX(-50%);
  z-index: 9999;
  .close-button {
    display: none;
  }
  .search-bar__input {
    padding: 1rem 0.5rem;
    border: 0;
    color: var(--color-text);
    border-radius: 0.3rem 0% 0 0.3rem;
    width: 100%;
    background-color: #303030;
  }
  .search-bar__results {
    margin-block-start: 0.5rem;
    .search-bar__options {
      margin-inline-start: 1rem;
      padding: 0.5rem;
      padding-inline-start: 1.5rem;
    }
    .users-list__item,
    .search-bar__options {
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
    .posts-list {
      .posts-list__item {
        display: flex;
        padding: 1rem;
        &:hover {
          cursor: pointer;
          background-color: #303030;
        }
      }
    }
  }
  @media screen and (max-width: 700px) {
    width: 28rem;
    .search-bar__input-container {
      display: flex;
      .close-button {
        all: unset;
        padding: 0.2rem;
        border-inline-start: 1px solid grey;
        border-radius: 0% 0.3rem 0.3rem 0;
        background-color: #303030;
        display: block;
      }
    }
  }
  @media screen and (max-width: 500px) {
    width: 23rem;
  }
}
</style>
