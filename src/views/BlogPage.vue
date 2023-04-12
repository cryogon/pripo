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
import { useAuth0 } from "@auth0/auth0-vue";
import { Icon } from "@iconify/vue";
import { useShare } from "@vueuse/core";
import { useEmitter } from "@/composables/EventEmitter";
import LoadingScreen from "../components/LoadingScreen.vue";
import { useTimeAgo } from "@vueuse/core";
import { setMeta } from "@/utils";
import OptionsIcon from "../components/Icons/OptionsIcon.vue";
import { setImageQuality } from "@/utils/setImageQuality";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

const md = MarkdownIt({
  html: true,
  linkify: true,
});
const emitter = useEmitter();
const { user } = useAuth0();
const params = router.currentRoute.value.params;
const blogId = params?.id as string;
const { result, loading, error, onError, stop } = useQuery(GET_BLOG, {
  id: blogId,
});

const isFav = ref(false);
const { share, isSupported } = useShare();
const blog = ref<any>(result.value?.blogs[0] || null);
//Variables For Editing Blogs
const blogEditable = ref(false);
const isPostPublic = ref(false);
const isCommentDisabled = ref(false);
const blogContent = ref<HTMLParagraphElement>();
const blogTitle = ref<HTMLHeadingElement>();
const blogTags = ref();

provide("blog_id", blogId);

watch(result, () => {
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

onError((err) => {
  console.error(err);
  stop();
});
function sanitizeHTML(html: string) {
  return DOMPurify().sanitize(md.render(html));
}

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
    content: JSON.stringify(
      sanitizeHTML(blogContent.value?.innerText as string)
    ),
    commentAllowed: !isCommentDisabled.value,
    isPublic: isPostPublic.value,
    tags: blogTags.value.split(" ").map((c: any) => c.toLowerCase()),
  });
  blogEditable.value = false;
}
function deletePost(id: number) {
  const variables = { id };
  const { mutate } = useMutation(DELETE_POST, { variables });
  emitter.emit("confirm", { mutate, id });
  isBlogOptionVisible.value = false;
}
const isBlogOptionVisible = ref(false);
function toggleBlogOptions() {
  isBlogOptionVisible.value = !isBlogOptionVisible.value;
}
function toggleBlogEditMode() {
  blogEditable.value = !blogEditable.value;
  isBlogOptionVisible.value = false;
}
</script>

<template>
  <main class="container" v-if="blog">
    <section class="blog-section">
      <section class="post-header">
        <div class="author-pfp anonymous" v-if="!blog.is_public"></div>
        <router-link :to="`/users/${blog.user.id}`" v-else>
          <img
            :src="
              setImageQuality(blog.user.profile_picture, {
                width: 196,
                height: 196,
              })
            "
            alt="author"
            class="author-pfp"
            referrerpolicy="no-referrer"
          />
        </router-link>
        <div class="basic-post-info">
          <span class="author-name">
            {{ blog.is_public ? blog.user.username : "Anonymous" }}
          </span>
          <span class="date-posted">
            {{ useTimeAgo(blog.date_posted).value }}
          </span>
        </div>
        <div class="blog-options">
          <Icon
            icon="ph:share-network-light"
            :height="30"
            :width="30"
            @click="shareButton"
          />

          <Icon
            :icon="isFav ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
            :height="30"
            :width="30"
            @click="setLike"
          />
          <Icon
            icon="ph:dots-three-outline-vertical"
            :height="30"
            :width="30"
          />
        </div>
      </section>
      <!-- <div class="author">
        <div class="author-pfp anonymous" v-if="!blog.is_public"></div>
        <router-link :to="`/users/${blog.user.id}`" v-else>
          <img
            :src="
              setImageQuality(blog.user.profile_picture, {
                width: 196,
                height: 196,
              })
            "
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
          <EditIcon class="icon edit" />
          <Icon
            icon="ph:share-network-light"
            :height="30"
            :width="30"
            @click="shareButton"
          />
          <Icon
            icon="isFav ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
            :width="35"
            :height="35"
            @click="setLike"
          />
          <OptionsIcon
            class="options-icon icon"
            @click="toggleBlogOptions"
            v-if="blog.user.id == user?.uid"
          />
          <ul
            class="blog-options__drop-down"
            :class="{ active: isBlogOptionVisible }"
          >
            <li class="list-item" @click="toggleBlogEditMode">Edit</li>
            <li class="list-item danger" @click="deletePost(blog.id)">
              Delete
            </li>
          </ul>
        </div>
      </div> -->
      <h1 class="title" :contenteditable="blogEditable" ref="blogTitle">
        {{ blog.title }}
      </h1>
      <div class="content">
        <p
          :contenteditable="blogEditable"
          ref="blogContent"
          v-html="sanitizeHTML(JSON.parse(blog.content))"
        ></p>
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

  .title {
    line-height: 2.4rem;
  }
  .content {
    margin-block-end: 0.8rem;
    line-height: 1.4rem;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    .tag {
      background: linear-gradient(var(--tag-background));
      text-decoration: none;
    }
  }
  .post-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.5rem;
    padding-inline-end: 0.75rem;
    .author-pfp {
      cursor: pointer;
      width: 45px;
      height: 45px;
      aspect-ratio: 1/1;
      border-radius: 50%;
      &.anonymous {
        background-color: grey;
      }
    }
    .basic-post-info {
      display: flex;
      gap: 3px;
      flex-direction: column;
      user-select: none;
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
      user-select: none;
      align-items: center;
      justify-content: flex-end;
      gap: 30px;
      margin-inline-start: auto;
      position: relative;
    }
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
