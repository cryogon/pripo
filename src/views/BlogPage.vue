<script setup lang="ts">
import router from "@/router";
import CommentSection from "@/components/CommentSection.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { GET_BLOG, SET_LIKE, REMOVE_LIKE, EDIT_BLOG } from "@/graphql";
import { ref, watch, provide } from "vue";
import StarIcon from "../components/Icons/StarIcon.vue";
import { useAuth0 } from "@auth0/auth0-vue";
import ShareIcon from "../components/Icons/ShareIcon.vue";
import EditIcon from "../components/Icons/EditIcon.vue";
import { useShare } from "@vueuse/core";
import { useEmitter } from "@/composables/EventEmitter";

const emitter = useEmitter();
const { user } = useAuth0();
const params = router.currentRoute.value.params;
const blogId = parseInt(params?.id as string);
const {
  result,
  loading,
  error,
  onError,
  stop,
  refetch: refetchBlog,
} = useQuery(GET_BLOG, {
  id: blogId,
});
const isFav = ref(false);
const { share, isSupported } = useShare();
const blog = ref<any>();
//Variables For Editing Blogs
const blogEditable = ref(false);
const isPostPublic = ref(false);
const blogContent = ref<HTMLParagraphElement>();
const blogTitle = ref<HTMLHeadingElement>();
const blogTags = ref();

provide("blog_id", blogId);
function showFormatedDate(date: Date | string | number) {
  return Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

watch(result, () => {
  //This is not working since router is appling value of currentTitle first and it is updating later since blog is updating late
  localStorage.setItem(
    "currentTitle",
    result.value.blogs[0].title + " - Pripo"
  );
  //This is workaround for title updating
  document.title = result.value.blogs[0].title + " - Pripo";
  blog.value = result.value.blogs[0];

  isPostPublic.value = blog.value.is_public;
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
    isPublic: isPostPublic.value,
    tags: blogTags.value.split(" "),
  });
  blogEditable.value = false;
  refetchBlog();
}
</script>

<template>
  <main class="container" v-if="blog">
    <section class="blog-section">
      <div class="author">
        <div class="author-pfp anonymous" v-if="!blog.is_public"></div>
        <img
          :src="blog.user.profile_picture"
          alt="author"
          class="author-pfp"
          @click="router.push(`/users/${blog.user.id}`)"
          referrerpolicy="no-referrer"
          v-else
        />
        <span class="author-name"
          >Posted by
          {{ blog.is_public ? blog.user.username : "Anonymous" }}</span
        >
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
          <span v-for="tag in blog.tags" :key="tag" class="link"
            >#{{ tag }}</span
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
          <button
            type="submit"
            class="post-button input-active-area"
            @click="editBlog"
          >
            Edit
          </button>
        </div>
        <span class="date-posted"
          >posted on {{ showFormatedDate(blog.date_posted) }}</span
        >
      </div>
    </section>
    <CommentSection :blog="blog" />
  </main>

  <main v-else-if="loading && !error">Loading...</main>
  <main v-else-if="error || !loading">Blog Not Found</main>
</template>
<style scoped lang="scss">
.container {
  padding-block-start: 3rem;
  padding-inline: min(10rem, 10vw);
  max-width: 80rem;
  .title,
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
  }

  .title {
    line-height: 2.4rem;
  }
  .date-posted {
    display: flex;
    justify-content: flex-end;
    opacity: 0.7;
  }

  .author {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.5rem;
    .author-name {
      width: 100%;
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
}
</style>
