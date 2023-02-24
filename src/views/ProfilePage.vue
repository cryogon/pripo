<script setup lang="ts">
import LocationPin from "../components/Icons/LocationPin.vue";
import HeartIcon from "../components/Icons/HeartIcon.vue";
import LinkIcon from "../components/Icons/LinkIcon.vue";
import CheckIcon from "@/components/Icons/CheckIcon.vue";
import { useElementBounding, useFileDialog } from "@vueuse/core";
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
import axios from "axios";
import { useEmitter } from "@/composables/EventEmitter";
import XIcon from "../components/Icons/XIcon.vue";
const { files, open, reset } = useFileDialog({
  accept: "image/jpeg, image/gif, image/x-png",
});
const emitter = useEmitter();
const online = useOnline();
const nav = ref(null);
const background = ref();
const userParam = router.currentRoute.value.params.user;
const { user: u, getAccessTokenSilently } = useAuth0();
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
const { y } = useElementBounding(nav);
const clickedOnFollowed = ref(false);
const navIsCompact = ref(false);
const tabs = ["About", "Posts", "Favourites", "Followers", "Followings"];

//changing this will change cover image
const coverImage = ref("");
const currentSection = ref<string | null>("About");
const isCoverImageLoading = ref<boolean | null>(null);
const getFilteredBlogs = computed(() => {
  if (user.value.users[0].username === u.value?.nickname) {
    return user.value.users[0].blogs;
  }
  return user.value.users[0].blogs.filter((blog: Blog) => blog.is_public);
});

//For user to change even when page not refreshed
//For instance, checking a user's profile and then checking your own profile
router.afterEach((to, from) => {
  if (to.name === "users" && from.name === "users" && to.hash === "")
    refetch({ id: to.params.user, username: to.params.user });
});
onResult((r) => {
  if (user.value?.users[0].cover_picture)
    coverImage.value = user.value?.users[0].cover_picture;
  else coverImage.value = "";
  if (r.data.users.length == 0) {
    router.push("/404");
  } else {
    userFound.value = true;
  }
});
onError(() => {
  console.error("Some Problem Occured! Please Refetch");
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
  clickedOnFollowed.value = true;
}
function unfollowUser(user: User) {
  const { mutate } = useMutation(UNFOLLOW_USER);
  mutate({ me: u.value.nickname, user: user.username });
  clickedOnFollowed.value = false;
}

function isMutual(user: any) {
  //!!u.value is shorthand for u.value !== "" && u.value !== null && u.value !== undefined
  if (
    (!!u.value && user.username === u.value.nickname) ||
    user.followings.nodes.length === 0
  ) {
    return false;
  }
  //Here I am basically checking that if users follower and following are same or not and also his following is equal to logged in user or not

  return (user.followers.nodes || []).some((follower: any) => {
    return (user.followings.nodes || []).some((following: any) => {
      return (
        follower.user.username == following.user.username &&
        following.user.username === u.value.nickname
      );
    });
  });
}
// To Update it in real time I have to look info GQL Query and return proper id of followed user from user table not follower table
function isFollowed(user: any) {
  for (let follower of user.followers.nodes || []) {
    if (follower.user.username === u.value.nickname) {
      return true;
    }
  }
  return false;
}

function isMe(user: User) {
  return user.username === u.value.nickname;
}

async function uploadImage() {
  if (!files.value) {
    return null;
  }
  const data = new FormData();
  data.append("file", files.value[0]);
  data.append("upload_preset", "wdo2tdms");

  const image = await axios({
    url: "https://api.cloudinary.com/v1_1/dmerejjkt/image/upload",
    method: "POST",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return image.data;
}

async function changeCoverPicture() {
  isCoverImageLoading.value = true;
  const image = await uploadImage();
  isCoverImageLoading.value = false;
  image &&
    getAccessTokenSilently().then((token) => {
      const url = "https://pripo-api.vercel.app/cover/" + u.value.sub;
      axios
        .patch(
          url,
          {
            user_metadata: {
              cover_image: image.url,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        )
        .then(() => {
          emitter.emit("alert", "Cover Page Updated Sucessfully");
        })
        .catch((err) => {
          console.error(err);
          emitter.emit("alert", "Cover Page failed to Update!!!");
        });
    });
  reset();
}

function clearImage() {
  reset();
  isCoverImageLoading.value = false;
}

//Watchers
watch(y, () => {
  //Will use different Method later
  if (y.value === 80) {
    navIsCompact.value = true;
  } else {
    navIsCompact.value = false;
  }
});

watch(files, () => {
  if (files.value?.length) {
    if (!files.value[0].type.includes("image")) {
      emitter.emit("alert", "Only Image files are allowed");
      reset();
      return;
    }
    if (files.value[0].size / 1024 / 1024 >= 5) {
      emitter.emit("alert", "Image Size should be less than 5MB");
      reset();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      coverImage.value = `"${reader.result}"`;
    };
    files.value && reader.readAsDataURL(files.value[0]);
  } else {
    coverImage.value = user.value?.users[0].cover_picture;
  }
});
onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.intersectionRatio > 0) {
        currentSection.value = entry.target.getAttribute("id");
      }
    },
    { threshold: 0, rootMargin: "0% 0px -80% 0px" }
  );
  watch(background, () => {
    background.value &&
      (background.value.querySelectorAll(".section .heading") || []).forEach(
        (section: any) => {
          observer.observe(section);
        }
      );
  });
});
</script>
<template>
  <main class="container" v-if="user && userFound && !loading">
    <section class="user-info" :style="`--cover-image:url(${coverImage})`">
      <div class="cover-image">
        <i
          class="edit-icon"
          v-if="isMe(user.users[0])"
          :class="{
            extended: files?.length,
            empty: !files?.length && isCoverImageLoading === false,
          }"
        >
          <PencilIcon class="icon" @click="open()" v-show="!files?.length" />
          <XIcon
            class="icon close"
            @click="clearImage"
            v-show="files?.length"
          />
          <CheckIcon
            class="icon check"
            @click="changeCoverPicture"
            v-show="!isCoverImageLoading"
          />
          <div class="icon loading" v-show="isCoverImageLoading"></div>
        </i>
      </div>
      <div
        :style="`--user-avatar:url(${user.users[0].profile_picture})`"
        alt="user-avatar"
        class="avatar"
      ></div>
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
                  mutual: isMutual(user.users[0]),
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
              v-if="!isFollowed(user.users[0]) && !clickedOnFollowed"
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
  padding: 0 min(15vw, 20rem);
  .mutual {
    background: linear-gradient(var(--mutual-color));
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
      width: 100%;
      height: 18rem;
      // aspect-ratio: ;
      background-color: grey;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      background-image: var(--cover-image);
      background-repeat: no-repeat;
      background-size: cover;
      .edit-icon {
        padding: 0.3rem;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: #303030;
        user-select: none;
        position: relative;
        cursor: pointer;
        margin: 0.5rem;
        &.empty {
          animation: slide-back 350ms linear;
          @keyframes slide-back {
            from {
              width: 4rem;
              border-radius: 0.7rem;
            }
            to {
              width: 2rem;
              border-radius: 50%;
            }
          }
          .icon {
            animation: slide-center 350ms linear;
            @keyframes slide-center {
              from {
                left: 1rem;
              }
              to {
                left: 50%;
              }
            }
          }
        }
        &.extended {
          border-radius: 0.7rem;
          width: 4rem;
          animation: slide 350ms linear;
          .icon {
            left: 1rem;
            &:hover {
              background-color: var(--link-hover-background);
            }
            &.check {
              display: block;
              // place-items: center;
              left: 3rem;
              animation: fade 350ms linear;

              @keyframes fade {
                from {
                  opacity: 0;
                  left: 1rem;
                }
                to {
                  opacity: 1;
                  left: 3rem;
                }
              }
            }
          }
          @keyframes slide {
            from {
              width: 2rem;
              border-radius: 50%;
            }
            to {
              width: 4rem;
              border-radius: 0.7rem;
            }
          }
        }
        .icon {
          position: absolute;
          width: 1.2rem;
          height: 1.2rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          &.check {
            display: none;
            left: 0;
            padding: 0.1rem;
          }
          &.close {
            padding: 0.2rem;
          }
          &.loading {
            left: 3rem;
            width: 1rem;
            height: 1rem;
            background-color: transparent;
            outline: 2px solid white;
            border-radius: 50%;
            outline-offset: 1px;
            outline-style: dotted;
            animation: spin 2s infinite ease-out;
            @keyframes spin {
              from {
                translate: -50% -50%;
                transform: rotate(0turn);
              }
              to {
                translate: -50% -50%;
                transform: rotate(1turn);
              }
            }
          }
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
      background-color: grey;
      background-image: var(--user-avatar);
      background-repeat: no-repeat;
      background-size: cover;
      image-rendering: optimizeSpeed;
      image-orientation: from-image;
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
          color: var(--color-text);
        }
      }
      ul {
        display: flex;
        list-style: none;
        gap: 1rem;
      }
    }
  }
  @media screen and (max-width: 1000px) {
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
