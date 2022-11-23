<script setup lang="ts">
import { usePripoStore } from "@/stores";
import { ref } from "vue";
import router from "@/router";
import CommentInputBox from "./CommentInputBox.vue";
import CommentCard from "./CommentCard.vue";
import ReplyCard from "./ReplyCard.vue";

const params = router.currentRoute.value.params;
const blogId = parseInt(params.id as string);
const store = usePripoStore();
const blog = store.blogs.filter((b) => b.id == (blogId as number))[0];

const comments = ref(blog.comments);

function postComment(data: any) {
  if (comments.value) comments.value.push(data);
  else comments.value = [data];
}
</script>

<template>
  <div class="comment-section">
    <CommentInputBox @post-comment="postComment" />
    <div class="comments" v-for="comment in comments" :key="comment.content">
      <!-- <img
        :src="comment.user.pfp"
        alt="user"
        class="userIcon"
        @click="redirctToProfilePage(comment.user.id)"
      /> -->
      <div class="comment-reply-container">
        <CommentCard :comment="comment" />
        <div class="reply">
          <div class="reply--main">
            <div v-for="reply in comment.reply" :key="reply.id">
              <ReplyCard :reply="reply" />
              <div class="reply-child">
                <ReplyCard
                  v-for="subreply in reply.reply"
                  :key="subreply.id"
                  :reply="subreply"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.comment-section {
  .comment-reply-container {
    display: flex;
    flex-direction: column;
  }
  // .userIcon {
  //   align-self: flex-start;
  //   grid-row: 1 / span 2;
  //   width: 45px;
  //   height: 45px;
  //   border-radius: 50%;
  //   cursor: pointer;
  // }

  .comments {
    display: flex;
    align-items: center;
    margin-block: 1rem;
    gap: 10px;
  }
  .reply-child {
    margin-inline-start: 2rem;
  }
}
</style>
