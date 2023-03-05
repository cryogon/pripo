<script setup lang="ts">
import router from "@/router";
import { useQuery } from "@vue/apollo-composable";
import SearchPostItem from "../components/SearchPostItem.vue";
import SearchUserItem from "../components/SearchUserItem.vue";
import { GET_FILTERED_POSTS, FILTER_BY_TAGS } from "@/graphql";
import { ref, onMounted, watch } from "vue";
import LoadingScreen from "../components/LoadingScreen.vue";
import { useOnline } from "@vueuse/core";
const results = ref();
const filter = ref("posts");
const online = useOnline();
const { onResult, loading, refetch } =
  router.currentRoute.value.query.f === "tags"
    ? useQuery(FILTER_BY_TAGS, {
        tags: router.currentRoute.value.query.q,
      })
    : useQuery(GET_FILTERED_POSTS, {
        query: `%${router.currentRoute.value.query.q}%`,
      });

document.title = `${router.currentRoute.value.query.q} ● Search`;
//Refeching on route change
watch(router.currentRoute, (currValue, oldValue) => {
  console.log(router.currentRoute.value.query);
  if (
    currValue.query?.q !== oldValue.query?.q ||
    currValue.query?.f !== oldValue.query.f
  ) {
    refetch({
      query: `%${currValue.query.q}%`,
      tags: router.currentRoute.value.query.q,
    });
    changeFilterOnMount();
  }
});
function changeFilter(_filter: string) {
  filter.value = _filter;
  router.replace({
    query: { q: router.currentRoute.value.query.q, f: _filter },
  });
}

function changeFilterOnMount() {
  if (router.currentRoute.value.query.f === "posts") {
    filter.value = "posts";
  }
  if (router.currentRoute.value.query.f === "users") {
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
  <main v-if="!loading && results?.blogs" class="container">
    <h2>Results for: {{ router.currentRoute.value.query.q }}</h2>
    <section class="search-card">
      <div class="filters">
        <div
          role="button"
          class="filter-option"
          @click="changeFilter('posts')"
          :class="{ active: filter == 'posts' }"
        >
          Posts
        </div>
        <div
          role="button"
          class="filter-option"
          @click="changeFilter('users')"
          v-if="router.currentRoute.value.query.f !== 'tags'"
          :class="{ active: filter === 'users' }"
        >
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
          <div class="not-found" v-if="!results?.users.length && !loading">
            User not found
          </div>
        </div>
      </div>
    </section>
  </main>
  <main v-else-if="!online">You are currently offline</main>
  <LoadingScreen class="loading" v-else-if="loading && !results?.blogs" />
</template>
<style scoped lang="scss">
.container {
  padding: 2rem 10rem;
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
        &.active {
          background-color: #00000000;
        }
      }
    }
    .not-found {
      margin-block-start: 1rem;
    }
  }
  @media (max-width: 700px) {
    padding: 1rem 0.3rem;
  }
}
</style>
