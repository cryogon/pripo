<script lang="ts" setup>
import AppIcon from "./Icons/AppIcon.vue";
import router from "@/router";
import { RouterLink } from "vue-router";
import { ref, watch } from "vue";
import { useDark, useScroll, useToggle } from "@vueuse/core";
import { useAuth0 } from "@auth0/auth0-vue";
import { setContext } from "@apollo/client/link/context";
import LoginButton from "./LoginButton.vue";
const isDropDownVisible = ref(false);
const isDark = useDark();
const toggleDark = useToggle(isDark);
const navbar = ref();
const compactNavbar = ref(false);
const { y } = useScroll(window);

const {
  user,
  logout: signout,
  isAuthenticated,
  getAccessTokenSilently,
} = useAuth0();

watch(y, () => {
  if (Math.round(y.value) > 130) {
    compactNavbar.value = true;
  }
  if (Math.round(y.value) <= 5) {
    compactNavbar.value = false;
  }
});
router.afterEach(() => {
  isDropDownVisible.value = false;
});

function toggleDropDown() {
  isDropDownVisible.value = !isDropDownVisible.value;

  setTimeout(() => {
    document.addEventListener(
      "click",
      () => {
        isDropDownVisible.value = false;
      },
      { once: true }
    );
  }, 10);
}
function logout() {
  signout({ returnTo: window.location.origin });
  localStorage.removeItem("token");
}
if (isAuthenticated) {
  const token = getAccessTokenSilently();
  //FIXME: Temporary Solution: Have to find a way to use ApolloClient.setContext
  token.then((d) => {
    localStorage.setItem("token", d);
  });
  setContext((request, { headers }) => ({
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  }));
}
</script>
<template>
  <!-- <Suspense> -->
  <header>
    <nav ref="navbar" :class="{ compact: compactNavbar }">
      <div class="icon" @click="router.push('/')">
        <AppIcon class="icon-image" />
        <h2>pripo</h2>
      </div>
      <ul class="options">
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>
      <div class="buttons">
        <LoginButton v-if="!isAuthenticated" />
        <div class="user-bar" v-else-if="user && isAuthenticated">
          <button
            class="post-button"
            type="submit"
            @click="router.push('/publish')"
          >
            Post
          </button>
          <img
            :src="user.picture"
            alt="userImg"
            class="userpfp"
            @click="toggleDropDown"
          />
          <div :class="{ visible: isDropDownVisible }" class="drop-down-menu">
            <router-link
              class="hover-item"
              :to="`/users/${user.username || user.nickname}`"
              role="button"
              >Profile</router-link
            >
            <span class="hover-item" @click="toggleDark()" role="button">{{
              isDark ? "Dark" : "Light"
            }}</span>
            <span class="hover-item" role="button">Settings</span>
            <span class="hover-item" @click="logout" role="button">Logout</span>
          </div>
        </div>
      </div>
    </nav>
  </header>
  <!-- </Suspense> -->
</template>
<style scoped lang="scss">
header {
  z-index: 9999;
}
header:has(.compact) {
  position: sticky;
  top: 0;
  z-index: 9999;
  animation: slidedown 300ms ease-out;
}
@keyframes slidedown {
  from {
    top: -5rem;
  }
  to {
    top: 0;
  }
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
    &:hover .icon-image {
      rotate: -30deg;
    }
  }
  .icon-image {
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
  .user-bar {
    display: flex;
    align-items: center;
    gap: 3rem;
    position: relative;
    .post-button {
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
.drop-down-menu {
  background-color: var(--dropdown-background);
  box-shadow: 0.6rem 0.6rem 2rem #303030;
  position: absolute;
  display: none;
  flex-direction: column;
  padding: 0.3rem;
  top: 4rem;
  right: -1rem;
  min-width: 6rem;
  min-height: 7rem;
  z-index: 99999;
  .hover-item {
    color: var(--color-text);
    cursor: pointer;
    padding: 0.3rem 1rem;
    &:hover {
      background: var(--nav-background);
    }
  }
}
</style>
