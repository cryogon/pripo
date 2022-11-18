<script setup lang="ts">
import { usePripoStore } from "@/stores";
import { ref } from "vue";
import router from "@/router";
import type { User } from "@/types";
const params = router.currentRoute.value.params;
const blogId = parseInt(params.id as string);
const store = usePripoStore();
const blog = store.blogs.filter((b) => b.id == (blogId as number))[0];
const commentInp = ref();
const comments = ref(blog.comments);
const user = store.user;

function setRows(): void {
  commentInp.value.rows =
    (commentInp.value.value.match(/\n/gm) || []).length + 2;
}

function postComment(user: User, content: string): void {
  const postedOn = new Date();
  if (content.length > 0) {
    if (comments.value) {
      comments.value.push({
        id: comments.value.length,
        user,
        content,
        postedOn,
        likes: {
          count: 0,
          users: [],
        },
      });
    } else {
      comments.value = [
        {
          id: 0,
          user,
          content,
          postedOn,
          likes: {
            count: 0,
            users: [],
          },
        },
      ];
    }
  }
  commentInp.value.value = "";
}
function showFormatedDate(date: Date | string | number): string {
  return Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function redirctToProfilePage(id: number) {
  router.push(`/user/${id}`);
}

/**
 * @method setLikes
 * Set Likes on the comment
 * @param id takes id of the comment to uniquely identify it
 */

function setLikes(id: number) {
  /*This Login is Broken And is needed to be fixed 
  since the flag always initilize with false and even if I take it outside it won't work properly for multiple comments */
  let flag = false;
  if (comments.value) {
    if (!flag) {
      comments.value[id].likes.count++;
      comments.value[id].likes?.users.push(user);
      flag = true;
    } else {
      comments.value[id].likes.count--;

      //Need Better Logic On This one
      comments.value[id].likes?.users.pop();
      flag = false;
    }
  }
}
</script>

<template>
  <div class="comment-section">
    <div class="commentInputSection">
      <img
        src="/mypfp.jpg"
        alt="user"
        class="userIcon"
        @click="redirctToProfilePage(user.id)"
      />
      <textarea
        placeholder="Type you comment"
        class="comment_input"
        ref="commentInp"
        @input="setRows"
        :rows="0"
        cols="100"
        required
      ></textarea>
      <button
        type="submit"
        class="postButton"
        @click="postComment(user, commentInp.value)"
      >
        Post
      </button>
    </div>

    <div class="comments" v-for="comment in comments" :key="comment.content">
      <img
        :src="comment.user.pfp"
        alt="user"
        class="userIcon"
        @click="redirctToProfilePage(comment.user.id)"
      />

      <div class="postedComment">
        <span class="currentUser">
          {{ comment.user.name }}
          <span class="time-commented">{{
            showFormatedDate(comment.postedOn)
          }}</span>
        </span>
        <span class="content">
          {{ comment.content }}
        </span>
        <div class="commentOptions">
          <span class="reply comment-options-icon" title="reply">
            <fa-icon icon="reply" />
            <span class="replyCount"></span>
          </span>
          <span
            class="likes comment-options-icon"
            @click="setLikes(comment.id)"
          >
            <fa-icon :icon="['regular', 'thumbs-up']" class="likeIcon" />
            <span class="likeCount">{{ comment.likes?.count }}</span>
          </span>
          <fa-icon icon="ellipsis-vertical" class="comment-options-icon" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.comment-section {
  .commentInputSection {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-block: 1rem 2rem;
  }
  .comment_input {
    background-color: var(--card-background);
    outline: none;
    border: none;
    color: var(--text-color);
    padding: 0.6rem 1rem;
    resize: none;
  }
  .postButton {
    margin-inline-start: 1rem;
    border-radius: 1rem;
    padding: 0.6rem 1.6rem;
    align-self: flex-start;
    background: transparent;
    color: var(--text-color);
    font-size: 20px;
    transition: 150ms;
  }
  .postButton:hover {
    border-color: var(--text-color);
    background: var(--button-hover-color);
  }
  .userIcon {
    align-self: flex-start;
    grid-row: 1 / span 2;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    cursor: pointer;
  }

  .comments {
    display: flex;
    align-items: center;
    margin-block: 1rem;
    gap: 10px;
  }
  .postedComment {
    background: var(--card-background);
    min-height: 6rem;
    width: 49rem;
    padding: 0.5rem 1rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    .commentOptions {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      .likes,
      .reply {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .comment-options-icon {
        padding: 0.3rem;
        &:hover {
          background: var(--button-hover-color);
        }
      }
    }
  }
  .currentUser {
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    opacity: 0.6;
    margin-block-end: 0.4rem;
  }
}
</style>
