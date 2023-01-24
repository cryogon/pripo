<script lang="ts" setup>
import { useScroll } from "@vueuse/core";
import { ref, watch, computed } from "vue";
import router from "@/router";
import type { RouteLocationRaw } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import type { Blog } from "@/types";
import { GET_USER_BY_ID, GET_USER_BY_USERNAME } from "@/graphql";
import { useAuth0 } from "@auth0/auth0-vue";
const isCompact = ref(false);
const { y } = useScroll(window);
const currentTab = ref<"posts" | "favorites">("posts");
const userParam = router.currentRoute.value.params.user;
const { user: u } = useAuth0();
const {
  result: user,
  onResult,
  onError,
} = !isNaN(+userParam)
  ? useQuery(GET_USER_BY_ID, { id: userParam })
  : useQuery(GET_USER_BY_USERNAME, { username: userParam });

const userFound = ref(false);

onResult((r) => {
  if (r.data.users.length == 0) {
    router.push("/404");
  } else {
    userFound.value = true;
  }
});

onError(() => {
  // router.push("/404");
  console.log("Error");
});

watch(y, () => {
  if (y.value > 20) {
    isCompact.value = true;
  } else {
    isCompact.value = false;
  }
});

function navigateTo(url: RouteLocationRaw) {
  router.push(url);
}

function changeTab(tab: "posts" | "favorites") {
  currentTab.value = tab;
}

const getFilteredBlogs = computed(() => {
  if (user.value.users[0].username === u.value?.nickname) {
    return user.value.users[0].blogs;
  }
  return user.value.users[0].blogs.filter((blog: Blog) => blog.is_public);
});
</script>

<template>
  <main v-if="user && userFound">
    <div class="user-display-container" :class="{ compact: isCompact }">
      <img
        :src="user.users[0].profile_picture"
        alt="user"
        class="userPfp"
        referrerpolicy="no-referrer"
      />
      <span class="fullname">{{ user.users[0].name }}</span>
      <span class="username">@{{ user.users[0].username }}</span>
    </div>
    <span class="scrollDown" :class="{ compact: isCompact }">
      <fa-icon icon="chevron-down" class="scrollDownIcon" />
    </span>
    <ul class="optionContainer">
      <li
        class="option"
        :class="{ active: currentTab === 'posts' }"
        @click="changeTab('posts')"
      >
        Posts
      </li>
      <li
        class="option"
        :class="{ active: currentTab === 'favorites' }"
        @click="changeTab('favorites')"
      >
        Favorites
      </li>
    </ul>
    <div class="main-data-container">
      <div class="postsContainer" v-if="currentTab === 'posts'">
        <div
          class="post"
          v-for="(blog, index) in getFilteredBlogs"
          :key="blog.id"
          @click="navigateTo(`/posts/${blog.id}`)"
        >
          <span class="blogItemIndex"> {{ index + 1 }}. </span>
          <span class="blogTitle">
            {{ blog.title }}
          </span>
        </div>
      </div>
      <div
        class="favoritePostsContainer"
        v-else-if="currentTab === 'favorites'"
      >
        <div
          class="post"
          v-for="(blog, index) in user.users[0].liked_blogs"
          :key="blog.id"
          @click="navigateTo(`/posts/${blog.blog[0].id}`)"
        >
          <span class="blogItemIndex"> {{ index + 1 }}. </span>
          <span class="blogTitle">
            {{ blog.blog[0].title }}
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
    position: relative;
    align-self: flex-start;
    margin-inline-start: 49%;
    translate: -50% 0;
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
      translate: 0;
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
    position: relative;
    .postsContainer,
    .favoritePostsContainer {
      background-color: var(--card-background);
      padding: 0.5rem;
      .post {
        padding: 0.4rem;
        min-height: 3rem;
        margin-block-end: 1rem;
        &:hover {
          background-color: var(--color-background);
        }
        .blogTitle {
          font-size: 20px;
          letter-spacing: 0.3px;
          cursor: pointer;
        }
        .blogItemIndex {
          font-size: 22px;
          padding-inline: 1rem;
        }
      }
    }
  }
}
</style>
