<script setup lang="ts">
import { GET_USER_BY_USERNAME } from "@/graphql";
import { useAuth0 } from "@auth0/auth0-vue";
import { useQuery } from "@vue/apollo-composable";

const { user } = useAuth0();
// const { onResult } = useQuery(GET_USER_BY_USERNAME, {
//   username: user.value?.nickname || "",
// });
</script>
<template>
  <main>
    <section class="container">
      <aside class="user-list"></aside>
      <aside class="chat-main"></aside>
    </section>
  </main>
</template>
<style scoped lang="scss">
main {
  padding: 1rem 15vw;
  .container {
    display: grid;
    grid-template-columns: max(20vw, 10rem) 1fr;
    .user-list {
      background-color: red;
      width: 100%;
      min-height: 10rem;
    }
    .chat-main {
      background-color: aquamarine;
      width: 100%;
      min-height: 10rem;
    }
  }
}
</style>
