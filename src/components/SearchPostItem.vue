<script setup lang="ts">
import type { Blog } from "@/types";
import { useAuth0 } from "@auth0/auth0-vue";
import { ref } from "vue";
import PostIcon from "./Icons/PostIcon.vue";
import StarIcon from "./Icons/StarIcon.vue";
import { useEmitter } from "@/composables/EventEmitter";
import { useMutation } from "@vue/apollo-composable";
import { SET_LIKE, REMOVE_LIKE } from "@/graphql";
const emitter = useEmitter();
const { user } = useAuth0();
const isFav = ref<boolean>(false);
const props = defineProps<{
  post: Blog;
}>();

if (
  props.post.favourites.filter((u: any) => u.user_id === user.value?.uid)
    .length != 0
) {
  isFav.value = true;
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
        blogId: props.post.id,
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
        blogId: props.post.id,
        userId: user.value?.uid,
      });
      isFav.value = false;
    } catch (err) {
      console.error(err);
    }
  }
}
</script>
<template>
  <div class="post-item">
    <PostIcon />
    <div class="post-info">
      <router-link :to="`/posts/${post.id}`" class="title">{{
        post.title
      }}</router-link>
      <span class="content">{{
        JSON.parse(post.content).substring(0, 100) + "..."
      }}</span>
    </div>
    <div class="options">
      <div class="likes" @click="setLike">
        <StarIcon class="icon" :class="{ active: isFav }" />
        <span class="count">{{ post.likes }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.post-item {
  margin-block: 0.7rem 1.5rem;
  min-height: 4rem;
  background-color: var(--color-background);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  column-gap: 20px;
  padding-inline: 1rem;
  .user-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }
  .post-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
      display: block;
      color: var(--color-text);
      font-weight: 600;
      padding-inline: 0;
      &:hover {
        text-decoration: underline;
      }
    }
    .content {
      color: var(--accent-color);
      font-size: 14px;
    }
  }
  .options {
    margin-inline-start: auto;
    .likes {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      .icon {
        height: 1.5rem;
        width: 2rem;
        stroke-width: 2;
        &.active {
          fill: var(--color-text);
        }
      }
    }
  }
}
</style>
