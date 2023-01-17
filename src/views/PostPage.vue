<script setup lang="ts">
import router from "@/router";
import { ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useMutation } from "@vue/apollo-composable";
import { INSERT_BLOG } from "@/graphql";
localStorage.setItem("currentTitle", "Post");
const postTitle = ref("");
const postContent = ref("");
const content = ref();
const isPostPublic = ref(false);
const blogTags = ref();

const { user } = useAuth0();

function pushPostToDB() {
  const variables = {
    title: postTitle.value,
    content: postContent.value,
    isPublic: isPostPublic.value,
    tags: blogTags.value?.split(" "),
    username: user.value.nickname,
    likes: 0,
    shares: 0,
    likedUser: [],
  };
  try {
    const { mutate: postBlog } = useMutation(INSERT_BLOG, { variables });
    postBlog();
    router.push("/");
  } catch {
    alert("Fill All Boxes");
  }
}
</script>
<!-- Need A Redesign -->
<template>
  <div class="post">
    <input
      type="text"
      name="blogTitle"
      class="blogTitle"
      placeholder="Blog Title"
      autocomplete="off"
      v-model="postTitle"
    />
    <textarea
      name="blogContent"
      class="blogContent"
      rows="10"
      placeholder="Write your content here"
      spellcheck="false"
      ref="content"
      v-model="postContent"
    ></textarea>

    <div class="contentOptions">
      <span class="boldIcon icon" @click="content.value += '<b></b>'">
        <fa-icon icon="bold"
      /></span>
      <span class="italicIcon icon" @click="content.value += '<i></i>'">
        <fa-icon icon="italic" />
      </span>
      <span class="headingIcon icon" @click="content.value += '<h1></h1>'">
        <fa-icon icon="heading" />
      </span>
      <span class="paragraphIcon icon" @click="content.value += '<p></p>'">
        <fa-icon icon="paragraph" />
      </span>
      <span class="postButton" @click="pushPostToDB">
        <fa-icon :icon="['regular', 'paper-plane']" class="postIcon" />
      </span>
    </div>
    <div class="postTags">
      <input
        type="text"
        placeholder="Tags (Seprated By Space)"
        class="tags"
        v-model="blogTags"
      />
    </div>
    <div class="isPostPublic">
      <label for="isPostPublic">Public: </label>
      <input
        type="checkbox"
        id="isPostPublic"
        :value="isPostPublic"
        @change="isPostPublic = !isPostPublic"
      />
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
  .blogContent,
  .blogTitle,
  .contentOptions,
  .tags,
  .isPostPublic {
    background-color: var(--card-background);
    color: var(--text-color);
    padding-inline-start: 1rem;
    border: none;
    outline: none;
  }
  .blogTitle {
    min-height: 3rem;
    font-weight: bolder;
    border-bottom: none;
    font-size: 26px;
  }
  .blogContent {
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
  .contentOptions {
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
      &:not(.postButton):hover {
        background: var(--link-hover-background);
      }
    }
    .postButton {
      padding: 0.6rem;
      color: black;
      background-color: aquamarine;
      border-radius: 50%;
      margin-top: auto;
      .postIcon {
        scale: 1.4;
        margin: auto;
      }
    }
  }
  .tags {
    height: 2rem;
    width: 100%;
  }
  .isPostPublic {
    display: flex;
    gap: 10px;
    // padding-top: 0.5rem;
    height: 2rem;
    font-family: monospace;
    font-size: 16px;
    align-items: center;
    input {
      accent-color: aquamarine;
    }
  }
}
</style>
