<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useMutation } from "@vue/apollo-composable";
import { INSERT_BLOG } from "@/graphql";
import { useEmitter } from "@/composables/EventEmitter";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import hljs from "highlight.js";

document.title = "Post ● Pripo";

const emitter = useEmitter();
const postTitle = ref("");
const postContent = ref("");
const isPostPublic = ref(false);
const isCommentDisabled = ref(false);
const postTags = ref<string[]>();

const { user } = useAuth0();
function pushPostToDB() {
  if (!user.value?.nickname) {
    emitter.emit("alert", "You need to login first");
    return;
  }
  if (postTitle.value == "") {
    emitter.emit("alert", "Title should not be empty");
    return;
  }
  if (postContent.value.length < 15) {
    emitter.emit("alert", "Your content is quite long isn't it.hehe");
    return;
  }

  // eslint-disable-next-line no-control-regex
  const re = /^[\x00-\x7F\x0A\x0D\s\-|\\/()[\]{}<>@#^_+=*&~`';:,.?!"]+$/g;
  const safeContent = postContent.value.match(re);

  if (safeContent === null) {
    emitter.emit("alert", "ASCII Art is not allowed");
    return;
  }
  const variables = {
    title: postTitle.value,
    content: JSON.stringify(sanitizedHTML(postContent.value)),
    isPublic: isPostPublic.value,
    commentAllowed: !isCommentDisabled.value,
    tags: postTags.value?.map((c) => c.toLowerCase()) || [],
    username: user.value.nickname,
    likes: 0,
    shares: 0,
    likedUser: [],
  };
  try {
    const { mutate: postBlog } = useMutation(INSERT_BLOG, { variables });
    postBlog();
    router.push("/");
  } catch (err) {
    console.error(err);
  }
}
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang): string {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<pre class="hljs"><code>` +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch (err) {
        console.log(err);
      }
    }
    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
});
function syncTag(e: Event) {
  const { value } = e.target as HTMLInputElement;

  //Regex For Spliting String when there is a charcter right after space
  postTags.value = value.split(/\s(?=\S)/);
}
function sanitizedHTML(html: string) {
  return DOMPurify().sanitize(md.render(html));
}
</script>
<!-- Need A Redesign -->
<template>
  <main class="container">
    <div class="publisher">
      <input
        type="text"
        name="title"
        id="post-title"
        class="post-input"
        placeholder="Title"
        autocomplete="off"
        v-model="postTitle"
      />
      <textarea
        name="content"
        id="post-content"
        class="post-input"
        cols="30"
        rows="10"
        placeholder="Content"
        v-model="postContent"
      ></textarea>
      <input
        type="text"
        name="tags"
        id="post-tags"
        class="post-tags post-input"
        placeholder="Tags (Seprated By Space)"
        @input="syncTag"
      />
      <section class="publish-options">
        <div class="disable-comments publish-option">
          <label for="comment-visibility">Disable Comments: </label>
          <input
            type="checkbox"
            name="cvis"
            id="comment-visibility"
            v-model="isCommentDisabled"
          />
        </div>
        <div class="toggle-post-visibility publish-option">
          <label for="visibility-toggle">Public: </label>
          <input
            type="checkbox"
            name="vis-t"
            id="visibility-toggle"
            v-model="isPostPublic"
          />
        </div>
      </section>
      <section class="publish-post">
        <router-link to="/404" class="publish-post__help"
          >Need Help With Post?</router-link
        >
        <button class="publish-post__button" @click="pushPostToDB">Post</button>
      </section>
    </div>
    <div class="preview">
      <div class="preview-profile">
        <div
          :style="`--avatar:url(${user.picture})`"
          class="preview-profile__picture"
          :class="{ public: isPostPublic }"
        ></div>
        <span class="preview-profile__username">{{
          isPostPublic ? user.nickname : "Anonymous"
        }}</span>
      </div>
      <h3 class="preview-heading">{{ postTitle }}</h3>
      <article
        class="preview-content"
        v-html="sanitizedHTML(postContent)"
      ></article>
      <section
        class="preview-tags"
        v-if="postTags?.length && postTags[0].length"
      >
        <span
          class="preview-tags__item"
          v-for="(tag, index) in postTags"
          :key="index"
        >
          {{ tag }}
        </span>
      </section>
      <section class="preview-comments" v-if="isCommentDisabled">
        Comments are Disabled
      </section>
    </div>
  </main>
</template>
<style lang="scss">
main.container {
  display: flex;
  padding: 1rem;
  gap: 10px;

  .publisher {
    margin-block-start: 3rem;
    width: 50%;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    .post-input {
      all: unset;
      padding: 1rem;
      border-radius: 1rem;
      background-color: var(--input-background);
    }
    .publish-options {
      border-radius: 1rem;
      padding: 0.5rem 1rem;
      background-color: var(--input-background);
      .publish-option {
        display: flex;
        gap: 5px;
        justify-content: space-between;
        align-items: center;
        width: 12rem;
      }
    }
    .publish-post {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-inline-start: 0.5rem;
      .publish-post__help {
        color: var(--link-color);
      }
      .publish-post__button {
        all: unset;
        border-radius: 1rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
        background: var(--accent-color);
      }
    }
  }
  .preview {
    width: 50%;
    .preview-content {
      min-height: 10rem;
      a {
        color: lightcoral;
        text-decoration: none;
      }
      ul,
      ol {
        list-style-position: inside;
        padding-inline-start: 5px;
      }
    }
    .preview-profile {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-block-end: 1rem;
      .preview-profile__picture {
        width: 3rem;
        aspect-ratio: 1/1;
        border-radius: 50%;
        background-color: grey;
        &.public {
          // background-color: aquamarine;
          background-image: var(--avatar);
          background-size: cover;
        }
      }
    }
    .preview-tags {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-block: 1rem;
      .preview-tags__item {
        color: var(--tag-color);
        padding: 0.5rem;
        border-radius: 2rem;
        background: linear-gradient(var(--tag-background));
      }
    }
  }
}
</style>
