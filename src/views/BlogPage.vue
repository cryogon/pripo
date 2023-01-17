<script setup lang="ts">
import router from "@/router";
import CommentSection from "@/components/CommentSection.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { GET_BLOG, SET_LIKE, REMOVE_LIKE } from "@/graphql";
import { ref, watch, provide } from "vue";
import StarIcon from "../components/Icons/StarIcon.vue";
import { useAuth0 } from "@auth0/auth0-vue";

const { user } = useAuth0();
const params = router.currentRoute.value.params;
const blogId = parseInt(params?.id as string);
const { result, loading, error, onError, stop } = useQuery(GET_BLOG, {
  id: blogId,
});
const isFav = ref(false);
provide("blog_id", blogId);

function showFormatedDate(date: Date | string | number) {
  return Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
let blog = ref<any>();
watch(result, () => {
  blog.value = result.value.blogs[0];
  if (
    blog.value.favourites.filter((u: any) => u.user_id === user.value.uid)
      .length != 0
  ) {
    isFav.value = true;
  }
  localStorage.setItem(
    "currentTitle",
    result.value.blogs[0].title + " - Pripo"
  );
});

onError(() => {
  stop();
});
function setLike() {
  if (!isFav.value) {
    const { mutate } = useMutation(SET_LIKE);
    try {
      mutate({
        blogId,
        userId: user.value.uid,
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
        userId: user.value.uid,
      });
      isFav.value = false;
    } catch (err) {
      console.error(err);
    }
  }
}
</script>

<template>
  <main class="container" v-if="blog">
    <div class="author">
      <div class="authorPfp anonymous" v-if="!blog.is_public"></div>
      <img
        :src="blog.user.profile_picture"
        alt="author"
        class="authorPfp"
        @click="router.push(`/users/${blog.user.id}`)"
        v-else
      />
      <span class="author_name"
        >Posted by {{ blog.is_public ? blog.user.username : "Anonymous" }}</span
      >
      <StarIcon class="star" :class="{ staractive: isFav }" @click="setLike" />
    </div>
    <h1 class="title">{{ blog.title }}</h1>
    <div class="content">
      <p>
        {{ JSON.parse(blog.content) }}
      </p>
      <div class="tags">
        <span v-for="tag in blog.tags" :key="tag" class="link">#{{ tag }}</span>
      </div>
      <span class="date-posted"
        >posted on {{ showFormatedDate(blog.date_posted) }}</span
      >
    </div>
    <CommentSection :blog-id="blogId" />
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
    margin-bottom: 0.6rem;
    .star {
      margin-inline-start: auto;
      width: 1.5rem;
      align-items: center;
    }
    .staractive {
      fill: var(--color-text);
    }
  }
  .authorPfp {
    cursor: pointer;
    width: 45px;
    height: 45px;
    border-radius: 50%;
  }
  .anonymous {
    background-color: grey;
  }
}
</style>
