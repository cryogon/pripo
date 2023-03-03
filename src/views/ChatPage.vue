<script setup lang="ts"></script>
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
