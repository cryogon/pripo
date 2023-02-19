<script lang="ts" setup>
import AppIcon from "./Icons/AppIcon.vue";
import router from "@/router";
import { RouterLink } from "vue-router";
import { ref, watch } from "vue";
import { useDark, useScroll, useToggle } from "@vueuse/core";
import { useAuth0 } from "@auth0/auth0-vue";
import LoginButton from "./LoginButton.vue";
import BellIcon from "./Icons/BellIcon.vue";
import HamBurger from "./Icons/HamBurger.vue";
import NotificationCenter from "./NotificationCenter.vue";
import { usePripoStore } from "@/stores";
const store = usePripoStore();
// import { setContext } from "@apollo/client/link/context";
const isDropDownVisible = ref(false);
const isDark = useDark({ initialValue: "dark" });
const toggleDark = useToggle(isDark);
const navbar = ref();
const compactNavbar = ref(false);
const { y } = useScroll(window);
const isMobileOptionVisible = ref(false);
const isNotificationActive = ref(false);
const {
  user,
  logout: signout,
  isAuthenticated,
  getAccessTokenSilently,
} = useAuth0();
const windowWidth = ref(window.innerWidth - 49);
const searchInputData = ref("");
const filter = ref("posts");
const unreadNotification = ref();
store.notification.onResult((n) => {
  unreadNotification.value = n.data.user_notifications.length;
});
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
  isNotificationActive.value = false;
});

function toggleDropDown() {
  if (!isDropDownVisible.value) {
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
  isDropDownVisible.value = true;
}

function toggleMobileOptions() {
  isMobileOptionVisible.value = !isMobileOptionVisible.value;
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
}
window.addEventListener("resize", () => {
  windowWidth.value = window.innerWidth - 49;
});

function search() {
  if (searchInputData.value.startsWith("user:")) {
    filter.value = "users";
    searchInputData.value = searchInputData.value.replace("user:", "");
  }
  if (searchInputData.value.startsWith("tag:")) {
    filter.value = "tags";
    searchInputData.value = searchInputData.value.replace("tag:", "");
  }
  if (searchInputData.value.startsWith("#")) {
    filter.value = "tags";
    searchInputData.value = searchInputData.value.replace("#", "");
  }
  router.push({
    path: "/search",
    query: { q: searchInputData.value, f: filter.value },
  });
  filter.value = "posts";
  searchInputData.value = "";
}
function toggleNotification() {
  isNotificationActive.value = !isNotificationActive.value;
}
</script>
<template>
  <header>
    <nav ref="navbar" :class="{ compact: compactNavbar }">
      <section class="left-section">
        <div class="mobile-options" :style="`--window-size:${windowWidth}px`">
          <HamBurger class="mobile-options-icon" @click="toggleMobileOptions" />
          <div
            class="mobile-options-tray"
            :class="{ active: isMobileOptionVisible }"
          >
            <input
              type="search"
              placeholder="search"
              class="mobile-input-search"
              v-model="searchInputData"
              @keydown.enter="search"
            />
            <ul class="mobile-tabs">
              <li><router-link to="/contact">Contact</router-link></li>
              <li>on Alpha Stage for mobile</li>
            </ul>
          </div>
        </div>
        <div class="icon" @click="router.push('/')">
          <AppIcon class="icon-image" />
          <h2>pripo</h2>
        </div>
        <input
          type="search"
          placeholder="search"
          class="input-search"
          @keydown.enter="search"
          v-model="searchInputData"
        />
        <ul class="options">
          <li><router-link to="/contact" class="link">Contact</router-link></li>
        </ul>
      </section>
      <div class="buttons">
        <LoginButton v-if="!isAuthenticated" />
        <div class="user-bar" v-else-if="user && isAuthenticated">
          <span v-if="!isDark" title="Light mode is on alpha stage">Alpha</span>
          <div class="notification-container">
            <BellIcon
              class="notification-icon"
              @click.prevent="toggleNotification"
            />
            <NotificationCenter
              class="notifications"
              :class="{ 'has-notification': unreadNotification }"
              v-show="isNotificationActive"
            />
          </div>
          <img
            :src="user.picture"
            alt="userImg"
            class="userpfp"
            @click="toggleDropDown"
          />
          <div :class="{ visible: isDropDownVisible }" class="drop-down-menu">
            <span class="user-item">{{ user.nickname }}</span>
            <router-link
              class="hover-item"
              :to="`/users/${user.username || user.nickname}`"
              role="button"
              >Profile</router-link
            >
            <router-link class="hover-item" to="/publish" role="button"
              >Post</router-link
            >
            <span class="hover-item" @click="toggleDark()" role="button">{{
              isDark ? "Dark" : "Light"
            }}</span>
            <router-link class="hover-item" to="/settings" role="button"
              >Settings</router-link
            >
            <span class="hover-item" @click="logout" role="button">Logout</span>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
<style scoped lang="scss">
header {
  z-index: 9999;
  user-select: none;
  -webkit-user-select: none;
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
  &.compact {
    height: 5rem;
  }
  .left-section {
    display: flex;
    align-items: center;
    gap: 15px;
    .input-search,
    .mobile-input-search {
      padding: 0.5rem;
      border: 1px solid var(--background-color);
      background-color: var(--card-background);
      border-radius: 0.5rem;
      height: 3rem;
      width: 15rem;
      outline: none;
      color: var(--color-text);
    }
    .mobile-options {
      display: none;
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
    & ul {
      list-style: none;
    }
    .icon-image {
      transition: 300ms;
      scale: 1.3;
    }
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
    gap: 20px;
    position: relative;
    .notification-container {
      position: relative;
      .notification-icon {
        width: 1.3rem;
        aspect-ratio: 1/1;
      }
      &:has(.has-notification)::after {
        content: "";
        position: absolute;
        top: 0.4rem;
        left: 0.8rem;
        border-radius: 50%;
        width: 0.5rem;
        height: 0.5rem;
        background: linear-gradient(var(--tag-background));
      }
    }
    .userpfp {
      border-radius: 50%;
      width: 50px;
      height: 50px;
      &:hover {
        outline: 2px solid var(--color-text);
      }
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
  top: 5rem;
  right: -1rem;
  min-width: 6rem;
  min-height: 7rem;
  z-index: 99999;
  gap: 5px;
  .hover-item,
  .user-item {
    color: var(--color-text);
    cursor: pointer;
    padding: 0.3rem 1rem;
    &:hover:not(.user-item) {
      background: var(--nav-background);
    }
  }
  .user-item {
    cursor: default;
    font-weight: bold;
    background-color: var(--accent-color);
  }
}
@media (max-width: 700px) {
  nav {
    // background-color: red;
    .icon > h2 {
      display: none;
    }
    .left-section {
      .input-search,
      .options {
        display: none;
      }
      .icon {
        margin-inline-start: 25vw;
      }
      .mobile-options {
        display: block;
        // position: relative;
        .mobile-options-tray {
          display: none;
          background-color: var(--nav-background);
          position: absolute;
          box-sizing: border-box;
          padding: 1rem;
          z-index: 999;
          flex-direction: column;
          min-height: 10rem;
          gap: 15px;
          top: 5rem;
          left: 0rem;
          .mobile-input-search {
            width: var(--window-size);
          }
          &.active {
            display: flex;
          }
        }
        .mobile-tabs > li {
          display: block;
        }
      }
    }
  }
}
</style>
