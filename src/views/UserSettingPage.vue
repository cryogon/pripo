<script setup lang="ts"></script>
<template>
  <main class="settings-container">
    <section class="profile-section">
      <h3 id="profile">Profile</h3>
      <label for="username">Username: </label>
      <span class="username" id="username">cryogon</span>
      <button type="button" class="username-change-button">Change</button>
      <hr />
      <label for="name">Name:</label>
      <input type="text" id="name" class="profile-name" />
    </section>
  </main>
</template>
<style scoped lang="scss">
.settings-container {
  padding: 1rem 20rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
