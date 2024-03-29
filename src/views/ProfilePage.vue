<script setup lang="ts">
import PostItem from "../components/PostItem.vue";
import FollowerItem from "../components/FollowerItem.vue";
import { useElementBounding, useFileDialog, useOnline } from "@vueuse/core";
import { ref, watch, onMounted, computed } from "vue";
import type { Blog, User } from "@/types";
import router from "@/router";
import { useAuth0 } from "@auth0/auth0-vue";
import {
  GET_USER_BY_ID,
  GET_USER_BY_USERNAME,
  FOLLOW_USER,
  UNFOLLOW_USER,
  UPDATE_ABOUT,
  INITIALIZE_CHAT,
} from "@/graphql";
import {
  LocationPin,
  HeartIcon,
  LinkIcon,
  CheckIcon,
  PencilIcon,
  XIcon,
} from "@/components/Icons";
import { useMutation, useQuery } from "@vue/apollo-composable";
import axios from "axios";
import { useEmitter } from "@/composables/EventEmitter";
import DOMpurify from "dompurify";
import MarkDownIt from "markdown-it";
import { setMeta } from "@/utils";
import LoadingScreen from "@/components/LoadingScreen.vue";

const { files, open, reset } = useFileDialog({
  accept: "image/jpeg, image/gif, image/x-png",
});
const emitter = useEmitter();
const online = useOnline();
const nav = ref(null);
const background = ref();
const userParam = router.currentRoute.value.params.user;
const { user: authUser, getAccessTokenSilently } = useAuth0();
const {
  result: user,
  onResult,
  onError,
  loading,
  refetch,
} = !isNaN(+userParam)
  ? useQuery(GET_USER_BY_ID, { id: userParam })
  : useQuery(GET_USER_BY_USERNAME, { username: userParam });

const userFound = ref(user.value ? true : false);
const { y } = useElementBounding(nav);
const navIsCompact = ref(false);
const tabs = ["About", "Posts", "Favourites", "Followers", "Followings"];
const md = MarkDownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
});

//For About Input
const aboutContent = ref({
  newValue: "",
  oldValue: "",
});
const isAboutEditable = ref(false);
//changing this will change cover image
const coverImage = ref("");
const currentSection = ref<string | null>("about");
const isCoverImageLoading = ref<boolean | null>(null);
const getFilteredBlogs = computed(() => {
  if (user.value.users[0].username === authUser.value?.nickname) {
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
  if (!r.data.users.length) {
    router.push("/404");
    return;
  }
  if (
    r.data.users[0].profile_visibility === "hidden" &&
    !isMe(r.data.users[0])
  ) {
    router.push("/404");
    return;
  }

  userFound.value = true;
  aboutContent.value.newValue = JSON.parse(user.value?.users[0]?.about) || "";
  setMeta({ title: `${user.value.users[0].username} ● Pripo` });
  if (user.value?.users[0].cover_picture)
    coverImage.value = user.value?.users[0].cover_picture;
  else coverImage.value = "";
});
onError((err) => {
  console.error("Some Problem Occured! Please Refetch", err);
});

function sanitizeHTML(html: string) {
  return DOMpurify.sanitize(html);
}

function getFormattedDate(date: number) {
  return Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function toggleAboutEditable() {
  isAboutEditable.value = !isAboutEditable.value;
  aboutContent.value.oldValue = aboutContent.value.newValue;
}

function changeAbout(content: string) {
  if (!aboutContent.value.newValue.length) {
    return emitter.emit("alert", "About Can't be empty!!!");
  }
  if (aboutContent.value.oldValue === aboutContent.value.newValue) {
    return emitter.emit(
      "alert",
      "About Value should not be same as old value!!!"
    );
  }

  const { mutate, onError } = useMutation(UPDATE_ABOUT);
  mutate({ user: authUser.value?.nickname, content: JSON.stringify(content) });
  isAboutEditable.value = false;
  onError(() => {
    emitter.emit(
      "alert",
      "Failed To changes about please refresh page and try again!"
    );
  });
}

function followUser(user: User) {
  if (!authUser.value?.nickname) {
    return;
  }
  const { mutate } = useMutation(FOLLOW_USER, {
    update(cache, { data: follow }) {
      let data = cache.readQuery({
        query: GET_USER_BY_USERNAME,
        variables: {
          username: userParam,
        },
      }) as any;
      let authUser = structuredClone(data.users);
      let follower = {
        __typename: follow.insert_follow_system.returning[0].__typename,
        user: {
          __typename: "users",
          name: follow.insert_follow_system.returning[0].followings.name,
          username:
            follow.insert_follow_system.returning[0].followings.username,
          profile_picture:
            follow.insert_follow_system.returning[0].followings.profile_picture,
        },
      };
      authUser[0].followers.aggregate.count += 1;
      authUser[0].followers.nodes.push(follower);
      data = {
        users: authUser[0],
      };
      cache.writeQuery({ query: GET_USER_BY_USERNAME, data });
    },
  });
  mutate({ me: authUser.value.nickname, user: user.username });
}
function unfollowUser(user: User) {
  if (!authUser.value?.nickname) {
    return;
  }
  const { mutate } = useMutation(UNFOLLOW_USER, {
    update(cache, { data: unfollow }) {
      let data = cache.readQuery({
        query: GET_USER_BY_USERNAME,
        variables: {
          username: userParam,
        },
      }) as any;
      let authUser = structuredClone(data.users);
      authUser[0].followers.aggregate.count -= 1;
      authUser[0].followers.nodes = authUser[0].followers.nodes.filter(
        (f: { user: User }) =>
          f.user.username !== unfollow.delete_follow_system.returning[0].user
      );
      data = {
        users: authUser[0],
      };
      cache.writeQuery({ query: GET_USER_BY_USERNAME, data });
    },
  });
  mutate({ me: authUser.value.nickname, user: user.username });
}

function isMutual(user: any) {
  if (!authUser.value?.nickname) {
    return false;
  }
  //!!authUser.value is shorthand for authUser.value !== "" && authUser.value !== null && authUser.value !== undefined
  if (
    user.username === authUser.value.nickname ||
    user.followings.nodes.length === 0
  ) {
    return false;
  }
  //Here I am basically checking that if users follower and following are same or not and also his following is equal to logged in user or not

  return (user.followers.nodes || []).some((follower: any) => {
    return (user.followings.nodes || []).some((following: any) => {
      return (
        follower.user.username == following.user.username &&
        following.user.username === authUser.value.nickname
      );
    });
  });
}
// To Update it in real time I have to look info GQL Query and return proper id of followed user from user table not follower table
function isFollowed(user: any) {
  //If user is not logged in return false since there is not need for futher checking
  if (!authUser.value?.nickname) {
    return false;
  }
  for (let follower of user.followers.nodes || []) {
    if (follower.user.username === authUser.value.nickname) {
      return true;
    }
  }
  return false;
}

function isMe(user: User) {
  return user.username === authUser.value?.nickname;
}

async function uploadImage() {
  if (!files.value) {
    return null;
  }
  const data = new FormData();
  data.append("file", files.value[0]);
  data.append("upload_preset", import.meta.env.VITE_IMG_PRESET);

  const image = await axios({
    url: import.meta.env.VITE_IMG_UPLOAD_PATH,
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
      const url = "https://pripo-api.vercel.app/cover/" + authUser.value.sub;
      axios
        .post(
          url,
          {
            user_metadata: {
              cover_image: image.secure_url,
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
          coverImage.value = image.secure_url;
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

//For Making NavBar sticky
watch(y, () => {
  //TODO:Will use different Method later
  if (y.value <= 80) {
    navIsCompact.value = true;
  } else {
    navIsCompact.value = false;
  }
});

//For uploading cover page
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
      (background.value.querySelectorAll(".section > .heading") || []).forEach(
        (section: any) => {
          observer.observe(section);
        }
      );
  });
});

function redirectToChat(_user: User) {
  if (!authUser.value?.nickname) {
    return;
  }
  if (
    user.value.users[0].chatting_with.some((us: User) => {
      return us.username === authUser.value.nickname;
    })
  ) {
    router.push(`/chat/${_user.username}`);
  } else {
    const { mutate } = useMutation(INITIALIZE_CHAT, {
      variables: {
        user1: authUser.value.nickname,
        receiver1: {
          username: _user.username,
          profile_picture: _user.profile_picture,
        },
        user2: _user.username,
        receiver2: {
          username: authUser.value.nickname,
          profile_picture: authUser.value.picture,
        },
      },
    });
    mutate().then(() => {
      router.push(`/chat/${_user.username}`);
    });
  }
}

function getFilteredUsers(user: User) {
  return user.followers.nodes.filter(
    (follower) => follower.user.profile_visibility !== "hidden"
  );
}
</script>
<template>
  <LoadingScreen v-if="loading" />
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
        <div
          :style="`--user-avatar:url(${user.users[0].profile_picture})`"
          alt="user-avatar"
          class="avatar"
        ></div>
      </div>
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
            v-if="
              authUser?.nickname && authUser.nickname !== user.users[0].username
            "
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
            <button
              type="button"
              class="message-button"
              @click="redirectToChat(user.users[0])"
            >
              Message
            </button>
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
            {{ user.users[0].interests }}
          </span>
        </div>
        <div class="social-media-links" v-if="user.users[0].social_links">
          <a
            :href="link?.url"
            class="social-links"
            v-for="(link, index) in user.users[0].social_links"
            :key="index"
          >
            <LinkIcon />
            {{ link?.url }}
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
            :to="`#${tab.toLowerCase()}`"
            class="tab-item link"
            :class="{ active: tab.toLowerCase() === currentSection }"
            >{{ tab }}</router-link
          >
        </ul>
      </nav>
      <section
        class="about-section card section"
        ref="aboutSection"
        id="aboutSection"
      >
        <h4 class="heading" id="about">About</h4>
        <div
          class="about-section__content"
          v-html="sanitizeHTML(md.render(aboutContent.newValue))"
          v-if="!isAboutEditable"
        ></div>
        <textarea
          name="about-input"
          class="about-section__input"
          placeholder="Edit Text Area (MD Supported)"
          v-model="aboutContent.newValue"
          v-else
        ></textarea>
        <div class="about-section__option" v-if="isMe(user.users[0])">
          <PencilIcon
            class="edit-icon"
            @click="toggleAboutEditable"
            v-if="!isAboutEditable"
          />
          <div class="icon-container" v-else>
            <XIcon class="x-icon" @click="toggleAboutEditable" />
            <CheckIcon
              class="check-icon"
              @click="changeAbout(aboutContent.newValue)"
              :class="{
                disabled:
                  !aboutContent.newValue.length &&
                  aboutContent.oldValue === aboutContent.newValue,
              }"
              :disabled="
                !aboutContent.newValue.length &&
                aboutContent.oldValue === aboutContent.newValue
              "
            />
          </div>
        </div>
      </section>
      <section
        class="about-section card section"
        ref="aboutSection"
        v-if="isAboutEditable"
      >
        <h4 class="heading" id="about">Live Preview</h4>
        <div
          class="about-section__preview"
          v-html="sanitizeHTML(md.render(aboutContent.newValue))"
        ></div>
      </section>
      <section
        class="posts-section card section"
        ref="postsSection"
        id="postsSection"
        v-if="
          user.users[0].profile_visibility === 'default' || isMe(user.users[0])
        "
      >
        <h4 class="heading" id="posts">Posts</h4>
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
        v-if="
          user.users[0].profile_visibility === 'default' || isMe(user.users[0])
        "
      >
        <h4 class="heading" id="favourites">Favourites</h4>
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
        v-if="
          user.users[0].profile_visibility === 'default' || isMe(user.users[0])
        "
      >
        <h4 class="heading" id="followers">Followers</h4>
        <FollowerItem
          v-for="follower in getFilteredUsers(user.users[0])"
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
        v-if="
          user.users[0].profile_visibility === 'default' || isMe(user.users[0])
        "
      >
        <h4 class="heading" id="followings">Followings</h4>
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
    &.about-section {
      display: flex;
      flex-direction: column;
      padding-block-end: 0;
      word-wrap: break-word;
      overflow-x: hidden;

      .about-section__content {
        min-height: 3rem;
        flex-wrap: wrap;
        max-height: 25rem;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 0.3rem;
          height: 0.3rem;
        }
        &::-webkit-scrollbar-corner {
          background-color: #202020;
          border-radius: 2rem;
        }
        &::-webkit-scrollbar-track {
          border-radius: 2rem;
          background-color: #202020;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 2rem;
          background-color: #e75151;
        }
      }
      .about-section__input {
        all: unset;
        min-height: 6rem;
        padding: 0.2rem;
        border-radius: 0.3rem;
        background-color: #202020;
        &:focus {
          outline: 1px solid white;
        }
      }
      .about-section__option {
        place-self: flex-end;

        .edit-icon {
          padding: 0.4rem;
          width: 2rem;
          height: 2rem;
          border-radius: 0.6rem;
          background-color: #202020;
          user-select: none;
          position: relative;
          margin-block-start: 0.3rem;
          cursor: pointer;
        }
        .icon-container {
          user-select: none;
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: #202020;
          border-radius: 0.4rem;
          padding: 0.3rem;
          background-color: rgb(204, 75, 75);
          box-shadow: inset -1.5rem 0 var(--accent-color);
          margin-block-start: 0.3rem;
          &:has(.x-icon:hover) {
            background-color: rgb(87, 67, 67);
          }
          &:has(.check-icon:not(.disabled):hover) {
            box-shadow: inset -1.5rem 0 rgb(107, 208, 107);
          }
          &:has(.check-icon:is(.disabled)) {
            box-shadow: inset -1.5rem 0 grey;
          }
          .check-icon:not(.disabled) {
            cursor: pointer;
          }
          .x-icon {
            cursor: pointer;
            height: 1rem;
            width: 1rem;
          }
        }
      }
    }
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
      aspect-ratio: 16/4;
      background-position: 50%;
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
              place-items: center;
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
      bottom: -3rem;
      left: 2.5rem;
      border-radius: 2rem;
      position: absolute;
      background-color: grey;
      background-image: var(--user-avatar);
      background-repeat: no-repeat;
      background-size: cover;
      image-rendering: optimizeSpeed;
      image-orientation: from-image;
      @media screen and (max-width: 700px) {
        width: 6rem;
        height: 6rem;
      }
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
      font-size: 14px;
      .date-joined {
        opacity: 0.6;
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
          color: var(--link-color);
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0;
          &:hover {
            text-decoration: underline;
          }
          &.youtube {
            color: red;
          }
          &.twitter {
            color: #1da1f2;
          }
          &.instagram {
            color: #f70077;
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
      top: 4.9rem;
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
