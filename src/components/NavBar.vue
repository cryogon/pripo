<script lang="ts" setup>
import AppIcon from "./Icons/AppIcon.vue";
import router from "@/router";
import { RouterLink } from "vue-router";
import { ref, watch } from "vue";
import { useDark, useScroll, useToggle } from "@vueuse/core";
import { useAuth0 } from "@auth0/auth0-vue";
import LoginButton from "./LoginButton.vue";
import NotificationCenter from "./NotificationCenter.vue";
import { usePripoStore } from "@/stores";
import { SearchIcon, MessageIcon, HamBurger, BellIcon } from "./Icons";
import SearchBar from "@/components/SearchBar.vue";
import { setImageQuality } from "@/helper/setImageQuality";
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
const searchBarVisible = ref(false);

const {
  user,
  logout: signout,
  isAuthenticated,
  getAccessTokenSilently,
} = useAuth0();
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
  searchBarVisible.value = false;
  isMobileOptionVisible.value = false;
});

//For Search Bar Toggle
document.addEventListener("keydown", (e) => {
  if (!searchBarVisible.value && e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    searchBarVisible.value = true;
  }
  if (searchBarVisible.value && e.key === "Escape") {
    e.preventDefault();
    searchBarVisible.value = false;
  }
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
  //FIXME: Temporary Solution: Have to find a way to use ApolloClient.setContext
  getAccessTokenSilently({ ignoreCache: true }).then((token) => {
    localStorage.setItem("token", token);
  });
}

function toggleNotification() {
  isNotificationActive.value = !isNotificationActive.value;
}

// document.addEventListener("touchstart", handleTouchStart);
// document.addEventListener("touchmove", handleTouchMove);
//Mobile Swipe Event for drop down
let xDown = 0,
  yDown = 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleTouchStart(e: TouchEvent) {
  const firstTouch = e.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleTouchMove(e: TouchEvent) {
  if (!xDown || !yDown) return;
  const xUp = e.touches[0].clientX;
  const yUp = e.touches[0].clientY;

  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    //Horizontal Movement
    if (xDiff > 0) {
      //Right Swipe
      isMobileOptionVisible.value = false;
    } else {
      //Left Swipe
      if (xDown < 50) isMobileOptionVisible.value = true;
    }
  } else {
    //Vertical Movement
    if (yDiff > 0) {
      //Down Swipe
    } else {
      //Up Swipe
    }
  }
  xDown = 0;
  yDown = 0;
}
function openSearchBar() {
  searchBarVisible.value = true;
  isMobileOptionVisible.value = false;
}
</script>
<template>
  <header>
    <nav ref="navbar" :class="{ compact: compactNavbar }">
      <section class="left-section">
        <div class="mobile-options">
          <HamBurger class="mobile-options-icon" @click="toggleMobileOptions" />
          <div
            class="mobile-options-tray"
            :class="{ active: isMobileOptionVisible }"
          >
            <ul class="mobile-tabs">
              <li>
                <router-link to="/publish" class="link">create</router-link>
              </li>
              <li class="search-icon link">
                <span @click="openSearchBar">search</span>
              </li>
              <li>on Alpha Stage for mobile</li>
            </ul>
          </div>
        </div>
        <div class="icon" @click="router.push('/')">
          <AppIcon class="icon-image" />
        </div>
        <ul class="options">
          <li><router-link to="/publish" class="link">create</router-link></li>
          <li class="search-icon link" @click="searchBarVisible = true">
            <SearchIcon />
            <span>search</span>
          </li>
        </ul>
      </section>
      <div class="buttons">
        <LoginButton v-if="!isAuthenticated" />
        <div class="user-bar" v-else-if="user && isAuthenticated">
          <MessageIcon class="icon" @click="router.push('/chat')" />
          <div class="notification-container">
            <BellIcon
              class="notification-icon icon"
              @click.prevent="toggleNotification"
            />
            <NotificationCenter
              class="notifications"
              :class="{ 'has-notification': unreadNotification }"
              v-show="isNotificationActive"
            />
          </div>
          <img
            :src="
              setImageQuality(user.picture, {
                width: 196,
                height: 196,
              })
            "
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
            <span
              class="hover-item"
              @click="toggleDark()"
              role="button"
              v-if="false"
              >{{ isDark ? "Dark" : "Light" }}</span
            >
            <router-link class="hover-item" to="/settings" role="button"
              >Settings</router-link
            >
            <span class="hover-item" @click="logout" role="button">Logout</span>
          </div>
        </div>
      </div>
    </nav>
    <SearchBar v-if="searchBarVisible" @close="searchBarVisible = false" />
  </header>
</template>
<style scoped lang="scss">
header {
  user-select: none;
  -webkit-user-select: none;
  background: linear-gradient(#040303 1%, #0403033a 95%);
}
header:has(.compact) {
  position: sticky;
  top: 0;
  z-index: 9999;
  animation: slidedown 300ms ease-out;
  background-color: var(--nav-background);
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
  justify-content: space-between;
  padding-inline: min(10rem, 10vw);
  align-items: center;
  height: 4.75rem;
  transition: height 300ms;

  &.compact {
    height: 5rem;
  }
  .left-section {
    display: flex;
    align-items: center;
    gap: 15px;
    .options {
      display: flex;
      align-items: center;
      .search-icon {
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
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
      margin-inline-end: 1rem;
      &:hover .icon-image {
        rotate: -30deg;
      }
    }
    & ul {
      list-style: none;
    }
    .icon-image {
      transition: 300ms;
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
    .icon {
      cursor: pointer;
    }
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
      cursor: pointer;
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
    padding-inline: min(3rem, 5vw);
    .left-section {
      .options {
        display: none;
      }
      .icon {
        margin-inline-start: 25vw;
      }
      .mobile-options {
        display: flex;
        // position: relative;
        .mobile-options-tray {
          display: none;
          background-color: var(--nav-background);
          position: absolute;
          box-sizing: border-box;
          padding: 1rem;
          z-index: 1;
          flex-direction: column;
          min-height: 10rem;
          gap: 15px;
          top: 4.5rem;
          left: 0rem;
          width: 100%;
          animation: slide 200ms linear;
          @keyframes slide {
            from {
              left: -12rem;
            }
            to {
              left: 0rem;
            }
          }
          &.active {
            display: flex;
          }
        }
        .mobile-tabs > li {
          display: block;
          margin-block: 0.5rem;
        }
      }
    }
  }
}
</style>
