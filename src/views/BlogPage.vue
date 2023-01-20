<script setup lang="ts">
import router from "@/router";
import CommentSection from "@/components/CommentSection.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { GET_BLOG, SET_LIKE, REMOVE_LIKE } from "@/graphql";
import { ref, watch, provide } from "vue";
import StarIcon from "../components/Icons/StarIcon.vue";
import { useAuth0 } from "@auth0/auth0-vue";
import ShareIcon from "../components/Icons/ShareIcon.vue";
import EditIcon from "../components/Icons/EditIcon.vue";
import { useShare } from "@vueuse/core";

const { user } = useAuth0();
const params = router.currentRoute.value.params;
const blogId = parseInt(params?.id as string);
const { result, loading, error, onError, stop } = useQuery(GET_BLOG, {
  id: blogId,
});
const isFav = ref(false);
const { share, isSupported } = useShare();
let blog = ref<any>();

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

function shareButton() {
  if (isSupported.value) {
    share({
      title: blog.value.title,
      text: blog.value.content.substring(0, 50),
      url: location.href,
    });
  } else {
    alert("It seems this feature is not supported by your browser");
  }
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
          v-else
        />
        <span class="author-name"
          >Posted by
          {{ blog.is_public ? blog.user.username : "Anonymous" }}</span
        >
        <div class="blog-options">
          <EditIcon class="icon edit" v-if="blog.user.id == user.uid" />
          <ShareIcon class="star icon" @click="shareButton" />
          <StarIcon
            class="star icon"
            :class="{ staractive: isFav }"
            @click="setLike"
          />
        </div>
      </div>
      <h1 class="title">{{ blog.title }}</h1>
      <div class="content">
        <p>
          {{ JSON.parse(blog.content) }}
        </p>
        <div class="tags">
          <span v-for="tag in blog.tags" :key="tag" class="link"
            >#{{ tag }}</span
          >
        </div>
        <span class="date-posted"
          >posted on {{ showFormatedDate(blog.date_posted) }}</span
        >
      </div>
    </section>
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
    border-radius: 50%;
  }
  .anonymous {
    background-color: grey;
  }
}
</style>
