<script lang="ts" setup>
import AppIcon from "./AppIcon.vue";
import router from "@/router";
import { RouterLink } from "vue-router";
import { ref, watch } from "vue";
import { usePripoStore } from "@/stores";
import { useDark, useWindowScroll, useToggle } from "@vueuse/core";

const store = usePripoStore();
const user = ref(true);
const isDropDownVisible = ref(false);
const isDark = useDark();
const toggleDark = useToggle(isDark);
const navbar = ref();
const compactNavbar = ref(false);
const { y } = useWindowScroll();
watch(y, () => {
  if (y.value > 5) {
    compactNavbar.value = true;
  } else {
    compactNavbar.value = false;
  }
});
router.afterEach(() => {
  isDropDownVisible.value = false;
});
</script>
<template>
  <header>
    <nav ref="navbar" :class="{ compact: compactNavbar }">
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
          <button
            class="postButton"
            type="submit"
            @click="router.push('/post')"
          >
            Post
          </button>
          <img
            src="/mypfp.jpg"
            alt="userImg"
            class="userpfp"
            @click="isDropDownVisible = !isDropDownVisible"
          />
          <div :class="{ visible: isDropDownVisible }" class="dropDownMenu">
            <router-link class="hoverItem" :to="`/user/${store.user.id}`"
              >Profile</router-link
            >
            <span class="hoverItem" @click="toggleDark()">{{
              isDark ? "Dark" : "Light"
            }}</span>
            <span class="hoverItem" @click="user = false" role="button"
              >Logout</span
            >
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
<style scoped lang="scss">
header:has(.compact) {
  position: sticky;
  top: 0;
  z-index: 9999;
}
nav {
  display: flex;
  background-color: var(--nav-background);
  justify-content: space-between;
  padding-inline: min(7.5rem, 10vw);
  align-items: center;
  height: 6rem;
  transition: height 300ms;
  & ul {
    list-style: none;
  }
  &.compact {
    height: 5rem;
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
    }
    .visible {
      display: flex;
    }
  }
}
.dropDownMenu {
  background-color: var(--dropdown-background);
  box-shadow: 0.6rem 0.6rem 2rem #303030;
  position: absolute;
  display: none;
  flex-direction: column;
  align-items: center;
  padding: 0.3rem;
  top: 4rem;
  right: -1rem;
  min-width: 6rem;
  min-height: 7rem;
  .hoverItem {
    color: var(--color-text);
    padding: 0.3rem 1rem;
    &:hover {
      background: var(--nav-background);
    }
  }
}
</style>
