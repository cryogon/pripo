<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Blog } from "@/types";
import { setImageQuality } from "@/utils/setImageQuality";
import { useTimeAgo } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";
const props = defineProps<{
  post: Blog;
}>();
const { user } = useAuth0();
const isFav = ref<boolean>(false);
async function sharePost(title: string, content: string) {
  const { useShare } = await import("@vueuse/core");
  const { share, isSupported } = useShare();
  if (isSupported.value) {
    share({
      title: title,
      text: content.substring(0, 50),
      url: location.href,
    });
  } else {
    const emitter = (await import("@/composables/EventEmitter")).useEmitter();
    emitter.emit(
      "alert",
      "It seems this feature is not supported by your browser"
    );
  }
}

async function setLike(post: Blog) {
  const { useMutation } = await import("@vue/apollo-composable");
  const { SET_LIKE, REMOVE_LIKE } = await import("@/graphql");
  if (!user.value?.email) {
    const emitter = (await import("@/composables/EventEmitter")).useEmitter();
    emitter.emit("alert", "You must login first in order to like");
    return;
  }
  if (!isFav.value) {
    const { mutate } = useMutation(SET_LIKE);
    try {
      mutate({
        blogId: post.id,
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
        blogId: post.id,
        userId: user.value?.uid,
      });
      isFav.value = false;
    } catch (err) {
      console.error(err);
    }
  }
}

onMounted(() => {
  if (
    props.post.favourites.filter((u: any) => u.user_id === user.value?.uid)
      .length != 0
  ) {
    isFav.value = true;
  }
});
</script>
<template>
  <section class="post-card">
    <div class="post-card__header">
      <img
        :src="setImageQuality(post.user?.profile_picture, { width: 96 })"
        alt="user"
        class="user-avatar"
        v-if="post.is_public"
      />
      <div class="user-avatar anonymous" v-else></div>
      <div class="post-card__header-user-info">
        <span class="post-card__user-name">{{ post.user.username }}</span>
        <span class="post-card__date">{{
          useTimeAgo(post.date_posted).value
        }}</span>
      </div>
    </div>
    <RouterLink :to="`/posts/${post.id}`">
      <h3 class="post-card__title padding">{{ post.title }}</h3>
      <article class="post-card__content padding">
        {{ post.content }}
      </article>
    </RouterLink>
    <section class="post-card__options padding">
      <Icon
        :icon="isFav ? 'mdi:cards-heart' : 'mdi:cards-heart-outline'"
        :height="30"
        :width="30"
        @click="setLike(post)"
      />
      <span class="post-like-count">{{ post.likes }}</span>

      <Icon icon="mdi:comment-outline" :height="30" :width="30" />
      <span class="post-comment-count">{{ post.comments?.length }}</span>
      <Icon
        icon="ph:share-network-light"
        :height="30"
        :width="30"
        @click="sharePost(post.title, post.content)"
      />
    </section>
  </section>
</template>
<style scoped lang="scss">
section.post-card {
  $gap: 10px;
  padding-block: 1rem;
  border-bottom: 2px solid var(--post-separator);
  .post-card__header {
    display: flex;
    align-items: center;
    gap: $gap;
    margin-block-end: 0.7rem;
    .user-avatar {
      width: 3rem;
      aspect-ratio: 1/1;
      background-color: grey;
      border-radius: 50%;
    }
    .post-card__header-user-info {
      display: flex;
      flex-direction: column;
      .post-card__date {
        opacity: 0.7;
      }
    }
  }
  .post-card__content {
    line-height: 1.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .padding {
    margin: 0.4rem 0.6rem 0;
  }

  .post-card__options {
    display: flex;
    align-items: center;
    margin-block-start: 0.75rem;
    gap: calc($gap + 10px);
    & > span {
      margin-inline-start: -0.5rem;
    }
    & > svg {
      cursor: pointer;
    }
  }
}
</style>
