<script setup lang="ts">
import router from "@/router";
import { useQuery } from "@vue/apollo-composable";
import SearchPostItem from "../components/SearchPostItem.vue";
import SearchUserItem from "../components/SearchUserItem.vue";
import { GET_FILTERED_POSTS } from "@/graphql";
import { ref } from "vue";
const results = ref();
const filter = ref("posts");
const { onResult, loading } = useQuery(GET_FILTERED_POSTS, {
  query: `%${router.currentRoute.value.query.q}%`,
});
onResult((r) => {
  results.value = r.data;
});
</script>
<template>
  <main>
    <h1>Search</h1>
    <section class="search-card">
      <div class="filters">
        <div role="button" class="filter-option" @click="filter = 'posts'">
          Posts
        </div>
        <div role="button" class="filter-option" @click="filter = 'users'">
          Users
        </div>
      </div>
      <div class="search-item-container">
        <div v-if="filter === 'posts'">
          <SearchPostItem
            v-for="(post, index) in results?.blogs"
            :key="index"
            :post="post"
            @click="router.push(`/posts/${post.id}`)"
          />
          <div class="loading" v-if="loading">Loading....</div>
          <div class="not-found" v-if="!results?.blogs.length && !loading">
            Post not found
          </div>
        </div>
        <div v-if="filter === 'users'">
          <SearchUserItem
            v-for="(user, index) in results?.users"
            :key="index"
            :user="user"
            @click="router.push(`/users/${user.id}`)"
          />
          <div class="loading" v-if="loading">Loading....</div>
          <div class="not-found" v-if="!results?.users.length && !loading">
            User not found
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<style scoped lang="scss">
main {
  padding: 1rem 10rem;
  .search-card {
    background-color: var(--nav-background);
    padding: 0.2rem 1.2rem;
    .filters {
      display: flex;
      gap: 10px;
      .filter-option {
        margin-block: 0.4rem;
        padding: 0.4rem 1.4rem;
        border-radius: 2rem;
        background-color: var(--color-background);
        cursor: pointer;
        &.selected {
          background-color: #00000000;
        }
      }
    }
    .not-found {
      margin-block-start: 1rem;
    }
  }
}
</style>
