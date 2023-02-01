<script setup lang="ts">
import SearchUserItem from "../components/SearchUserItem.vue";
</script>
<template>
  <main>
    <h1>Search</h1>
    <section class="search-card">
      <div class="filters">
        <div role="button" class="filter-option">Posts</div>
        <div role="button" class="filter-option">Users</div>
      </div>
      <div class="search-item-container">
        <SearchUserItem />
      </div>
    </section>
  </main>
</template>
<style scoped lang="scss">
main {
  padding: 1rem 10rem;
  .search-card {
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
  }
}
</style>
