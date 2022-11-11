<script lang="ts" setup>
import AppIcon from "./AppIcon.vue";
import router from "@/router";
import { RouterLink } from "vue-router";
import { ref } from "vue";
const user = ref(false);
</script>
<template>
  <nav>
    <div class="icon" @click="router.push('/')">
      <AppIcon class="iconImage" />
      <h2>pripo</h2>
    </div>
    <ul class="options">
      <li><router-link to="/contact">Contact</router-link></li>
    </ul>
    <div class="buttons">
      <button class="login" v-if="!user" type="submit" @click="user = true">
        Login
      </button>
      <div class="userBar" v-else>
        <button class="postButton" type="submit" @click="router.push('/post')">
          Post
        </button>
        <img src="/mypfp.jpg" alt="userImg" class="userpfp" />
        <div class="dropDownMenu">
          <span class="hoverItem">Theme</span>
          <span class="hoverItem" @click="user = false" role="button"
            >Logout</span
          >
        </div>
      </div>
    </div>
  </nav>
</template>
<style scoped lang="scss">
nav {
  display: flex;
  background-color: var(--nav-background);
  justify-content: space-between;
  padding-inline: min(7.5rem, 10vw);
  align-items: center;
  height: 6rem;
  position: sticky;
  top: 0;
  & ul {
    list-style: none;
  }
  .icon {
    display: flex;
    cursor: pointer;
    align-items: center;
    gap: 0.8rem;
    &:hover .iconImage {
      rotate: -30deg;
    }
  }
  .iconImage {
    transition: 300ms;
    scale: 1.3;
  }
  & button {
    max-width: 5rem;
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    background-color: transparent;
    transition: 200ms;
    color: var(--color-text);
    border-color: var(--button-hover-color);
    &:hover {
      border: 2px solid var(--color-text);
      box-shadow: inset 5rem 0 var(--button-hover-color);
    }
  }
  .userBar {
    display: flex;
    align-items: center;
    gap: 3rem;
    position: relative;
    .postButton {
      scale: 1.2;
    }
    .userpfp {
      border-radius: 50%;
      width: 60px;
      height: 60px;
      &:hover ~ .dropDownMenu {
        display: flex;
      }
    }
    .dropDownMenu {
      background-color: #202020;
      box-shadow: 0.6rem 0.6rem 2rem #303030;
      position: absolute;
      display: none;
      flex-direction: column;
      align-items: center;
      padding: 0.3rem;
      top: 3rem;
      right: -2rem;
      min-width: 6rem;
      min-height: 7rem;
      margin: 1rem;
      &:hover {
        display: flex;
      }
      .hoverItem {
        padding: 0.3rem 1rem;
        &:hover {
          background: var(--nav-background);
        }
      }
    }
  }
}
</style>
