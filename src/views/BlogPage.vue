<script setup lang="ts">
import router from "@/router";
import CommentSection from "@/components/CommentSection.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  GET_BLOG,
  SET_LIKE,
  REMOVE_LIKE,
  EDIT_BLOG,
  DELETE_POST,
} from "@/graphql";
import { ref, watch, provide } from "vue";
import StarIcon from "../components/Icons/StarIcon.vue";
import { useAuth0 } from "@auth0/auth0-vue";
import ShareIcon from "../components/Icons/ShareIcon.vue";
import EditIcon from "../components/Icons/EditIcon.vue";
import { useShare } from "@vueuse/core";
import { useEmitter } from "@/composables/EventEmitter";
import LoadingScreen from "../components/LoadingScreen.vue";
import { useTimeAgo } from "@vueuse/core";
import { setMeta } from "@/helper";
const emitter = useEmitter();
const { user } = useAuth0();
const params = router.currentRoute.value.params;
const blogId = params?.id as string;
const { result, loading, error, onError, stop } = useQuery(GET_BLOG, {
  id: blogId,
});

const isFav = ref(false);
const { share, isSupported } = useShare();
const blog = ref<any>();
//Variables For Editing Blogs
const blogEditable = ref(false);
const isPostPublic = ref(false);
const isCommentDisabled = ref(false);
const blogContent = ref<HTMLParagraphElement>();
const blogTitle = ref<HTMLHeadingElement>();
const blogTags = ref();

provide("blog_id", blogId);

watch(result, () => {
  //This is not working since router is appling value of currentTitle first and it is updating later since blog is updating late
  localStorage.setItem(
    "currentTitle",
    result.value.blogs[0].title + " - Pripo"
  );
  //For Updating Page Meta
  setMeta({
    title: result.value.blogs[0].title + " ● Pripo",
    description: result.value.blogs[0].content.substring(0, 50) + "...",
  });

  blog.value = result.value.blogs[0];
  isPostPublic.value = blog.value.is_public;
  isCommentDisabled.value = !blog.value.comments_allowed;
  blogTags.value = blog.value.tags.join(" ");
  if (
    blog.value.favourites.filter((u: any) => u.user_id === user.value?.uid)
      .length != 0
  ) {
    isFav.value = true;
  }
});

onError(() => {
  stop();
});
function setLike() {
  if (!user.value?.email) {
    emitter.emit("alert", "You must login first in order to like");
    return;
  }
  if (!isFav.value) {
    const { mutate } = useMutation(SET_LIKE);
    try {
      mutate({
        blogId,
        userId: user.value?.uid,
      });
      isFav.value = true;
    } catch (err) {
      console.error(err);
    }
  } else {
    const { mutate } = useMutation(REMOVE_LIKE);
    try {
      mutate({
        blogId,
        userId: user.value?.uid,
      });
      isFav.value = false;
    } catch (err) {
      console.error(err);
    }
  }
}

function shareButton() {
  if (isSupported.value) {
    share({
      title: blog.value.title,
      text: blog.value.content.substring(0, 50),
      url: location.href,
    });
  } else {
    emitter.emit(
      "alert",
      "It seems this feature is not supported by your browser"
    );
  }
}
function editBlog() {
  const { mutate } = useMutation(EDIT_BLOG);
  if (blogTitle.value?.innerText && blogTitle.value.innerText.length < 4) {
    emitter.emit("alert", "title is too short");
    return;
  }
  if (blogContent.value?.innerText && blogContent.value.innerText.length < 15) {
    emitter.emit("alert", "Post Content is too short");
    return;
  }
  if (!blogTags.value.length) {
    emitter.emit("alert", "Tags should not be empty");
    return;
  }
  mutate({
    blogId: blog.value.id,
    title: blogTitle.value?.innerText,
    content: JSON.stringify(blogContent.value?.innerText),
    commentAllowed: !isCommentDisabled.value,
    isPublic: isPostPublic.value,
    tags: blogTags.value.split(" ").map((c: any) => c.toLowerCase()),
  });
  blogEditable.value = false;
}
function deletePost(id: number) {
  const variables = { id };
  useMutation(DELETE_POST, { variables }).mutate();
}
</script>

<template>
  <main class="container" v-if="blog">
    <section class="blog-section">
      <div class="author">
        <div class="author-pfp anonymous" v-if="!blog.is_public"></div>
        <router-link :to="`/users/${blog.user.id}`" v-else>
          <img
            :src="blog.user.profile_picture"
            alt="author"
            class="author-pfp"
            referrerpolicy="no-referrer"
          />
        </router-link>
        <div class="basic-post-info">
          <span class="author-name">
            {{ blog.is_public ? blog.user.username : "Anonymous" }}</span
          >
          <span class="date-posted">
            {{ useTimeAgo(blog.date_posted).value }}
          </span>
        </div>
        <div class="blog-options">
          <EditIcon
            class="icon edit"
            v-if="blog.user.id == user?.uid"
            @click="blogEditable = !blogEditable"
          />
          <ShareIcon class="star icon" @click="shareButton" />
          <StarIcon
            class="star icon"
            :class="{ staractive: isFav }"
            @click="setLike"
          />
        </div>
      </div>
      <h1 class="title" :contenteditable="blogEditable" ref="blogTitle">
        {{ blog.title }}
      </h1>
      <div class="content">
        <p :contenteditable="blogEditable" ref="blogContent">
          {{ JSON.parse(blog.content) }}
        </p>
        <div class="tags" v-if="!blogEditable">
          <router-link
            :to="`/search?q=${tag}&f=tags`"
            v-for="tag in blog.tags"
            :key="tag"
            class="tag"
            >{{ tag }}</router-link
          >
        </div>
        <div class="extra-editing-options" v-if="blogEditable">
          <input
            type="text"
            v-if="blogEditable"
            v-model="blogTags"
            class="edit-tags"
          />
          <label for="isPostPublic">Post Publicly: </label>
          <input
            type="checkbox"
            id="isPostPublic"
            :checked="isPostPublic"
            @change="isPostPublic = !isPostPublic"
          />
          <label for="isPostPublic">Disable Comments </label>
          <input
            type="checkbox"
            id="isPostPublic"
            :checked="isCommentDisabled"
            @change="isCommentDisabled = !isCommentDisabled"
          />
          <button
            type="submit"
            class="post-button input-active-area"
            @click="editBlog"
          >
            Edit
          </button>
        </div>
      </div>
    </section>
    <CommentSection :blog="blog" />
  </main>
  <LoadingScreen v-else-if="loading && !error" />
  <main v-else-if="error || !loading">Post Not Found</main>
</template>
<style scoped lang="scss">
.container {
  padding-block-start: 3rem;
  padding-inline: min(10rem, 10vw);
  max-width: 80rem;
  .content {
    p {
      margin-block-end: 0.8rem;
      line-height: 1.4rem;
      white-space: pre-wrap;
    }
    .extra-editing-options {
      display: flex;
      gap: 10px;
      height: 2rem;
      font-family: monospace;
      flex-wrap: wrap;
      font-size: 16px;
      align-items: center;
      margin-block: 2rem;
      .edit-tags {
        padding: 0.5rem;
        background-color: var(--color-background);
        color: var(--color-text);
        outline: none;
        border: 1px solid var(--color-text);
      }
      input {
        accent-color: aquamarine;
      }
    }
    .post-button {
      margin-inline-start: auto;
      border-radius: 1rem;
      padding: 0.35rem 1.2rem;
      align-self: flex-start;
      background: var(--accent-color);
      color: var(--text-color);
      font-size: 14px;
      transition: 150ms;
      height: 3rem;
      width: 5rem;
    }
  }

  .title {
    line-height: 2.4rem;
  }

  .author {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.5rem;
    a: {
      padding: 0;
    }
    .basic-post-info {
      display: flex;
      gap: 3px;
      flex-direction: column;
      .date-posted {
        opacity: 0.7;
        font-size: 14px;
      }
      .author-name {
        width: 100%;
      }
    }
    .blog-options {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 30px;
      width: 75%;
      .icon {
        // margin-inline-start: auto;
        width: 2.1rem;
        height: 2.1rem;
        align-items: center;
        padding: 0.3rem;
        // border-radius: 1rem;
        &:hover {
          background-color: var(--button-hover-color);
        }
      }
    }
    .staractive {
      fill: var(--color-text);
    }
  }
  .author-pfp {
    cursor: pointer;
    width: 45px;
    height: 45px;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }
  .anonymous {
    background-color: grey;
  }
  .tags {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    .tag {
      background: linear-gradient(var(--tag-background));
      color: var(--tag-color);
      padding: 0.4rem 0.6rem;
      border-radius: 2rem;
      cursor: pointer;
    }
  }
  @media screen and (max-width: 700px) {
    padding-inline: 1rem;
  }
}
</style>
