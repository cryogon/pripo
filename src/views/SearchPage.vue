<script setup lang="ts">
import router from "@/router";
import { useQuery } from "@vue/apollo-composable";
import SearchPostItem from "../components/SearchPostItem.vue";
import SearchUserItem from "../components/SearchUserItem.vue";
import { GET_FILTERED_POSTS, FILTER_BY_TAGS } from "@/graphql";
import { ref, onMounted } from "vue";
import type { LocationQueryValue } from "vue-router";
const results = ref();
const filter = ref("posts");
const params = router.currentRoute.value.query;
const { onResult, loading } =
  params.f === "tags"
    ? useQuery(FILTER_BY_TAGS, {
        tags: (params.q as LocationQueryValue)?.toLowerCase(),
      })
    : useQuery(GET_FILTERED_POSTS, {
        query: `%${params.q}%`,
      });

function changeFilter(_filter: string) {
  filter.value = _filter;
  router.replace({
    query: { q: params.q, f: _filter },
  });
}

function changeFilterOnMount() {
  if (params.f === "posts") {
    filter.value = "posts";
  }
  if (params.f === "users") {
    filter.value = "users";
  }
}
onResult((r) => {
  results.value = r.data;
});
onMounted(() => {
  changeFilterOnMount();
});
</script>
<template>
  <main>
    <h1>Search</h1>
    <section class="search-card">
      <div class="filters">
        <div role="button" class="filter-option" @click="changeFilter('posts')">
          Posts
        </div>
        <div role="button" class="filter-option" @click="changeFilter('users')">
          Users
        </div>
      </div>
      <div class="search-item-container">
        <div v-if="filter === 'posts'">
          <SearchPostItem
            v-for="(post, index) in results?.blogs"
            :key="index"
            :post="post"
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
