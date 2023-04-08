<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useMutation } from "@vue/apollo-composable";
import { INSERT_BLOG } from "@/graphql";
import { useEmitter } from "@/composables/EventEmitter";

document.title = "Post ● Pripo";

const emitter = useEmitter();
const postTitle = ref("");
const postContent = ref("");
const content = ref();
const isPostPublic = ref(false);
const isCommentDisabled = ref(false);
const blogTags = ref("");

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
    content: JSON.stringify(postContent.value),
    isPublic: isPostPublic.value,
    commentAllowed: !isCommentDisabled.value,
    tags: blogTags.value?.split(" ").map((c) => c.toLowerCase()) || [],
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
</script>
<!-- Need A Redesign -->
<template>
  <div class="post">
    <input
      type="text"
      name="blog-title"
      class="blog-title"
      placeholder="Post Title"
      autocomplete="off"
      v-model="postTitle"
    />
    <textarea
      name="blog-content"
      class="blog-content"
      rows="10"
      placeholder="Write your content here"
      spellcheck="false"
      ref="content"
      v-model="postContent"
    ></textarea>

    <!--Will work on this soon not working now-->
    <div class="content-options" style="display: none"></div>
    <div class="post-tags">
      <input
        type="text"
        placeholder="Tags (Seprated By Space)"
        class="tags"
        v-model="blogTags"
      />
    </div>
    <div class="bottom-bar">
      <div class="bottom-bar__options">
        <div class="is-post-public">
          <input
            type="checkbox"
            id="is-post-public"
            :value="isPostPublic"
            @change="isPostPublic = !isPostPublic"
          />
          <label for="is-post-public" class="bottom-bar__options-item">
            Public
          </label>
        </div>
        <div class="disable-comments">
          <input
            type="checkbox"
            id="disable-comments"
            :value="isCommentDisabled"
            @change="isCommentDisabled = !isCommentDisabled"
          />
          <label for="disable-comments" class="bottom-bar__options-item">
            Disable Comment
          </label>
        </div>
      </div>
      <span class="post-button" @click="pushPostToDB"> Post </span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.post {
  display: flex;
  flex-direction: column;
  max-width: 60rem;
  padding: 2rem;
  position: relative;
  margin-inline-end: 3rem;
  .blog-content,
  .blog-title,
  .content-options,
  .tags,
  .bottom-bar {
    background-color: var(--card-background);
    color: var(--text-color);
    padding-inline-start: 1rem;
    border: none;
    outline: none;
  }
  .bottom-bar__options-item {
    opacity: 0.6;
  }
  .blog-title {
    min-height: 3rem;
    font-weight: bolder;
    border-bottom: none;
    font-size: 26px;
  }
  .blog-content {
    resize: vertical;
    min-height: 20rem;
    font-size: 18px;

    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-track {
      background-color: var(--link-hover-background);
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 2rem;
      background-color: darkseagreen;
    }
    &::-webkit-scrollbar-corner {
      background-color: var(--link-hover-background);
    }
  }
  .content-options {
    width: 3.3rem;
    height: 87%;
    display: flex;
    position: absolute;
    flex-direction: column;
    align-items: center;
    right: -1rem;
    border-inline-start: 1px solid var(--link-hover-background);
    .icon {
      cursor: pointer;
      padding: 0.7rem 1rem;
      margin-right: 0.6rem;
      overflow-x: hidden;
      &:not(.post-button):hover {
        background: var(--link-hover-background);
      }
    }
  }
  .tags {
    height: 2rem;
    width: 100%;
  }
  .bottom-bar {
    display: flex;
    gap: 10px;
    // height: 2rem;
    font-family: monospace;
    font-size: 16px;
    align-items: center;
    input {
      accent-color: aquamarine;
    }
    .post-button {
      margin-inline-start: auto;
      padding: 0.6rem;
      color: black;
      background-color: aquamarine;
      border-radius: 2rem;
      margin-inline: auto 0.3rem;
      margin-block: 0.3rem;
      cursor: pointer;

      &:active {
        background-color: rgb(58, 230, 173);
      }
      .post-icon {
        // scale: 1.4;
        margin: auto;
      }
    }
  }
}
</style>
