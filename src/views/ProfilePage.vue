<script setup lang="ts">
import LocationPin from "../components/Icons/LocationPin.vue";
import HeartIcon from "../components/Icons/HeartIcon.vue";
import LinkIcon from "../components/Icons/LinkIcon.vue";
import { useElementBounding } from "@vueuse/core";
import { ref, watch, onMounted, computed } from "vue";
import type { Blog, User } from "@/types";
import router from "@/router";
import { useAuth0 } from "@auth0/auth0-vue";
import {
  GET_USER_BY_ID,
  GET_USER_BY_USERNAME,
  FOLLOW_USER,
  UNFOLLOW_USER,
} from "@/graphql";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { useOnline } from "@vueuse/core";
import PostItem from "../components/PostItem.vue";
import FollowerItem from "../components/FollowerItem.vue";
import PencilIcon from "../components/Icons/PencilIcon.vue";

const online = useOnline();
const nav = ref(null);
const background = ref();
const userParam = router.currentRoute.value.params.user;
const { user: u } = useAuth0();
const {
  result: user,
  onResult,
  onError,
  loading,
  refetch,
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
  console.error("Some Problem Occured! Please Refetch");
});
const { y } = useElementBounding(nav);
const navIsCompact = ref(false);
const tabs = ["About", "Posts", "Favourites", "Followers", "Followings"];

//For user to change even when page not refreshed
//For instance, checking a user's profile and then checking your own profile
router.afterEach((to, from) => {
  if (to.name === "users" && from.name === "users" && to.hash === "")
    refetch({ id: to.params.user, username: to.params.user });
});

const getFilteredBlogs = computed(() => {
  if (user.value.users[0].username === u.value?.nickname) {
    return user.value.users[0].blogs;
  }
  return user.value.users[0].blogs.filter((blog: Blog) => blog.is_public);
});
watch(y, () => {
  //Will use different Method later
  if (y.value === 80) {
    navIsCompact.value = true;
  } else {
    navIsCompact.value = false;
  }
});

function getFormattedDate(date: number) {
  return Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function followUser(user: User) {
  const { mutate } = useMutation(FOLLOW_USER);
  mutate({ me: u.value.nickname, user: user.username });
}
function unfollowUser(user: User) {
  const { mutate } = useMutation(UNFOLLOW_USER);
  mutate({ me: u.value.nickname, user: user.username });
}

// const isFollowed = computed(() => {
//   for (let follower of user.value.users[0].followers.nodes || []) {
//     if (follower.followings.username === u.value.nickname) {
//       return true;
//     }
//   }
//   return false;
// });

function isMutual(followers: any, followings: any) {
  return followers.some((user: any) => {
    return followings.some((f: any) => {
      return (
        user.user.username == f.user.username &&
        f.user.username === u.value.nickname
      );
    });
  });
}
//To Update it in real time I have to look info GQL Query and return proper id of followed user from user table not follower table
function isFollowed(user: any) {
  for (let follower of user.followers.nodes || []) {
    if (follower.user.username === u.value.nickname) {
      return true;
    }
  }
  return false;
}
const currentSection = ref<string | null>("About");
onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.intersectionRatio > 0) {
        currentSection.value = entry.target.getAttribute("id");
      }
    },
    { threshold: 0, rootMargin: "0% 0px -75% 0px" }
  );
  watch(background, () => {
    background.value
      .querySelectorAll(".section .heading")
      .forEach((section: any) => {
        observer.observe(section);
      });
  });
});
</script>
<template>
  <main class="container" v-if="user && userFound && !loading">
    <section class="user-info">
      <div class="cover-image">
        <i class="edit-icon">
          <PencilIcon class="icon" />
        </i>
      </div>
      <img
        :src="user.users[0].profile_picture"
        alt="user-avatar"
        class="avatar"
      />
    </section>
    <div class="background" ref="background">
      <section class="basic-user-info">
        <div class="left-section">
          <span class="full-name">{{ user.users[0].name }}</span>
          <span
            class="special-title"
            v-for="(title, index) in user.users[0].special_title"
            :key="index"
            >{{ title }}</span
          >
          <span class="username">{{ user.users[0].username }}</span>
        </div>
        <div class="right-section">
          <div class="analytics">
            <div class="followers">
              <span
                :class="{
                  mutual: isMutual(
                    user.users[0].followers.nodes,
                    user.users[0].followings.nodes
                  ),
                }"
                >Followers</span
              >
              <span id="follower-count" class="count">
                {{ user.users[0].followers.aggregate.count }}
              </span>
            </div>
            <div class="followings">
              <span>Followings</span>
              <span id="followings-count" class="count">
                {{ user.users[0].followings.aggregate.count }}
              </span>
            </div>
          </div>
          <div
            class="options"
            v-if="u && u.nickname !== user.users[0].username"
          >
            <button
              type="button"
              class="follow-button"
              @click="followUser(user.users[0])"
              v-if="!isFollowed(user.users[0])"
            >
              Follow
            </button>
            <button
              type="button"
              class="unfollow-button"
              @click="unfollowUser(user.users[0])"
              v-else
            >
              Unfollow
            </button>
            <button type="button" class="message-button">Message</button>
            <button type="button" class="report-button">Report</button>
          </div>
        </div>
      </section>
      <section class="user-detail-section card">
        <span class="date-joined"
          >Member since {{ getFormattedDate(user.users[0].created_at) }}</span
        >
        <div class="major-info">
          <span class="location" v-if="user.users[0].location">
            <LocationPin />
            {{ user.users[0].location }}
          </span>
          <span class="interests" v-if="user.users[0].interests">
            <HeartIcon />
            user.users[0].interests
          </span>
        </div>
        <div class="social-media-links" v-if="user.users[0].social_links">
          <a
            href="https://cryogon.netlify.app"
            class="social-links"
            v-for="(link, index) in user.users[0].social_links"
            :key="index"
          >
            <LinkIcon />
            {{ link }}
          </a>
        </div>
      </section>
      <nav
        class="tab-navigation"
        :class="{ 'is-compact': navIsCompact }"
        ref="nav"
        id="nav"
      >
        <ul>
          <router-link
            v-for="(tab, i) in tabs"
            :key="i"
            :to="`#${tab}`"
            class="tab-item"
            :class="{ active: tab === currentSection }"
            >{{ tab }}</router-link
          >
        </ul>
      </nav>
      <section
        class="about-section card section"
        ref="aboutSection"
        id="aboutSection"
      >
        <h4 class="heading" id="About">About</h4>
      </section>
      <section
        class="posts-section card section"
        ref="postsSection"
        id="postsSection"
      >
        <h4 class="heading" id="Posts">Posts</h4>
        <PostItem
          v-for="post in getFilteredBlogs"
          :key="post.id"
          :id="post.id"
          :title="post.title"
          :favorites="post.favourites.aggregate.count"
          :posted_at="post.date_posted"
          :visibility="post.is_public"
        />
      </section>
      <section
        class="favourite-section card section"
        ref="favouritesSection"
        id="favouritesSection"
      >
        <h4 class="heading" id="Favourites">Favourites</h4>
        <PostItem
          v-for="post in user.users[0].liked_blogs"
          :key="post.blog[0].id"
          :id="post.blog[0].id"
          :title="post.blog[0].title"
          :favorites="post.blog[0].favourites.aggregate.count"
          :posted_at="post.blog[0].date_posted"
          :visibility="post.blog[0].is_public"
        />
      </section>
      <section
        class="follower-section card section"
        ref="followersSection"
        id="followersSection"
      >
        <h4 class="heading" id="Followers">Followers</h4>
        <FollowerItem
          v-for="follower in user.users[0].followers.nodes"
          :key="follower.user.username"
          :avatar="follower.user.profile_picture"
          :name="follower.user.name"
          :username="follower.user.username"
        />
      </section>
      <section
        class="following-section card section"
        ref="followingsSection"
        id="followingsSection"
      >
        <h4 class="heading" id="Followings">Followings</h4>
        <FollowerItem
          v-for="follower in user.users[0].followings.nodes"
          :key="follower.user.username"
          :avatar="follower.user.profile_picture"
          :name="follower.user.name"
          :username="follower.user.username"
        />
      </section>
    </div>
  </main>
  <main v-if="!online">Your are currently Offline</main>
</template>
<style scoped lang="scss">
.container {
  transition: 100ms;
  padding: 0 14vw;
  .mutual {
    background: linear-gradient(#48bfe3, #80ffdb);
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    color: transparent;
  }
  .card {
    min-height: 8rem;
    margin-block-start: 1rem;
    background-color: #303030;
    border-radius: 12px;
    padding: 0.3rem 1rem;
    .heading {
      font-weight: normal;
      text-decoration: underline;
      margin-block-end: 1rem;
    }
  }
  .user-info {
    position: relative;
    .cover-image {
      height: 18rem;
      width: 100%;
      background-color: grey;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      .edit-icon {
        padding: 0.3rem;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: black;
        user-select: none;
        position: relative;
        cursor: pointer;
        margin: 0.5rem;
        .icon {
          position: absolute;
          width: 1.2rem;
          height: 1.2rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .avatar {
      width: 9rem;
      height: 9rem;
      display: block;
      top: 12rem;
      left: 2.5rem;
      border-radius: 2rem;
      position: absolute;
    }
  }
  .background {
    background-color: #202020;
    min-height: 30rem;
    padding: 1rem;
    .basic-user-info {
      display: flex;
      flex-wrap: wrap;
      padding-block-end: 1.5rem;
      padding-inline: 2rem;
      justify-content: space-between;
      gap: 2rem;
      .left-section {
        display: flex;
        flex-direction: column;
        padding-block-start: 2.6rem;
        margin-inline-end: 5rem;

        .full-name {
          font-size: 20px;
        }
        .special-title {
          color: transparent;
          background: linear-gradient(var(--tag-background));
          background-clip: text;
          -moz-background-clip: text;
          -webkit-background-clip: text;
        }
        .username {
          opacity: 0.6;
        }
      }
      .right-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        .analytics {
          display: flex;
          gap: 4rem;
          .followers,
          .followings {
            display: flex;
            flex-direction: column;
            align-items: center;
            .count {
              color: transparent;
              background: linear-gradient(var(--tag-background));
              background-clip: text;
              -moz-background-clip: text;
              -webkit-background-clip: text;
            }
          }
        }
        .options {
          display: flex;
          gap: 1.5rem;
          button {
            padding: 0.3rem 0.9rem;
            border-radius: 9px;
            color: white;
            outline-color: transparent;
            border: 0;
            border-bottom: 2px solid white;
            margin-block-start: 2rem;
            transition: box-shadow 300ms;
            &:hover {
              background-color: rgb(95, 145, 91);
            }
            &:active {
              border-bottom: 0;
            }
          }
          .follow-button,
          .message-button {
            background-color: var(--accent-color);
          }
          .unfollow-button {
            background-color: grey;
          }
          .report-button {
            background-color: #e75151;
          }
        }
      }
    }
    .user-detail-section {
      min-height: auto;
      .date-joined {
        opacity: 0.6;
        font-size: 14px;
      }
      .major-info {
        display: flex;
        gap: 10px;
        margin-top: 0.1rem;
        .location,
        .interests {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      }
      .social-media-links {
        display: flex;
        margin-block-start: 0.1rem;
        flex-direction: column;
        a {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    .tab-navigation {
      padding: 0.5rem;
      padding-inline-start: 1rem;
      margin-block-start: 1rem;
      border-radius: 12px;
      position: sticky;
      z-index: 1;
      top: 5rem;
      background-color: #252525;
      transition: 200ms;
      &.is-compact {
        background-color: #202020;
        border-radius: 0;
      }
      .tab-item {
        cursor: pointer;
        position: relative;
        &.active {
          text-decoration: underline dotted;
        }
      }
      ul {
        display: flex;
        list-style: none;
        gap: 1rem;
      }
    }
  }
  @media screen and (max-width: 900px) {
    padding: 0 4rem;
  }
  @media screen and (max-width: 700px) {
    padding: 0 0;
    .tab-navigation {
      display: none;
    }
  }
}
</style>
