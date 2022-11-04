<script lang="ts" setup>
const user = false;
</script>
<template>
  <nav>
    <div class="icon">
      <AppIcon class="iconImage" />
      <h2>pripo</h2>
    </div>
    <ul class="options">
      <li><NuxtLink to="/contact">Contact</NuxtLink></li>
    </ul>
    <div class="buttons">
      <button class="login" v-if="!user">Login</button>
      <button class="logout" v-else>Logout</button>
    </div>
  </nav>
</template>
<style>
nav {
  display: flex;
  background-color: var(--nav-background);
  justify-content: space-between;
  padding-inline: min(7.5rem, 10vw);
  align-items: center;
  height: 6rem;
  position: sticky;
  top: 0;
}
nav ul {
  list-style: none;
}
.icon {
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 0.8rem;
}
.iconImage {
  scale: 1.3;
}
nav button {
  max-width: 5rem;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background-color: transparent;
  transition: 200ms;
  color: var(--color-text);
  border-color: var(--button-hover-color);
}
nav button:hover {
  border: 2px solid var(--color-text);
  box-shadow: inset 5rem 0 var(--button-hover-color);
}
</style>
