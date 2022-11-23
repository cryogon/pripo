<script lang="ts" setup>
import { useWindowScroll } from "@vueuse/core";
import { ref, watch } from "vue";
import { getUser } from "@/user";
import router from "@/router";
import type { RouteLocationRaw } from "vue-router";
const user = getUser();
const isCompact = ref(false);
const { y } = useWindowScroll();

watch(y, () => {
  if (y.value > 5) {
    isCompact.value = true;
  } else {
    isCompact.value = false;
  }
});

function navigateTo(url: RouteLocationRaw) {
  router.push(url);
}
</script>

<template>
  <main>
    <div class="user-display-container" :class="{ compact: isCompact }">
      <img :src="user.currUser.pfp" alt="user" class="userPfp" />
      <span class="fullname">{{ user.currUser.name }}</span>
      <span class="username">@{{ user.currUser.unique_name }}</span>
    </div>
    <span class="scrollDown" :class="{ compact: isCompact }">
      <fa-icon icon="chevron-down" class="scrollDownIcon" />
    </span>
    <ul class="optionContainer">
      <li class="option active">Blogs</li>
      <li class="option">Favorites</li>
    </ul>
    <div class="main-data-container">
      <div class="postsContainer">
        <div
          class="post"
          v-for="blog in user.blogs"
          :key="blog.id"
          @click="navigateTo(`/blogs/${blog.id}`)"
        >
          <span class="blogTitle">
            {{ blog.title }}
          </span>
        </div>
      </div>
    </div>
  </main>
</template>
<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-block-start: 1rem;

  .user-display-container {
    display: grid;
    gap: 10px;
    margin-bottom: 50rem;
    transition: margin 0.5s;
    .userPfp {
      width: 20rem;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
    }
    .fullname {
      font-size: 38px;
    }
    .fullname,
    .username {
      padding-inline-start: 2rem;
    }
    &.compact {
      grid-template-columns: 9rem 1fr;
      align-items: center;
      margin-inline-start: 9vw;
      margin-block: 5rem 3rem;
      align-self: flex-start;
      animation: moveleft 0.4s ease-out;
      @keyframes moveleft {
      }
      .userPfp {
        width: 10rem;
        grid-row: 1 / span 2;
      }
      .fullname {
        font-size: 24px;
        align-self: flex-end;
      }
      .username {
        align-self: flex-start;
      }
    }
  }
  .scrollDown {
    position: absolute;
    bottom: 2rem;
    animation: updown 500ms infinite alternate ease-out;
    @keyframes updown {
      from {
        bottom: 1.8rem;
      }
      to {
        bottom: 3rem;
      }
    }
    &.compact {
      display: none;
    }
    .scrollDownIcon {
      scale: 2;
    }
  }
  .optionContainer {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 80%;
    list-style: none;
    gap: 5rem;
    font-size: 20px;

    .option {
      cursor: pointer;
    }
    .active {
      padding-inline: 1rem;
      padding-block: 0.5rem;
      border-radius: 2rem;
      background-color: var(--link-hover-background);
    }
  }
  .main-data-container {
    margin-block-start: 2rem;
    width: 90%;
    min-height: 30rem;

    .postsContainer {
      .post {
        padding: 0.4rem;
        min-height: 3rem;
        background-color: var(--card-background);
        margin-block-end: 1rem;
        .blogTitle {
          font-size: 20px;
          letter-spacing: 0.3px;
        }
      }
    }
  }
}
</style>
