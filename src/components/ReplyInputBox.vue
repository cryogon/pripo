<script setup lang="ts">
// import type { Comment } from "@/types";
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import gql from "graphql-tag";

defineProps<{
  isReplyInputInactive: boolean;
  comment: any;
}>();

const content = ref("");

/**
 * @method submitReply
 * @param id uniquely identifies the current comment user clicked on
 */
function submitReply(e: Event) {
  // const { mutate } = useMutation(gql`
  //   mutation submitComment(
  //     $blogId: Int!
  //     $content: String!
  //     $parentId: Int!
  //     $name: String!
  //   ) {
  //     insert_comments(
  //       objects: {
  //         blog_id: $blogId
  //         content: $content
  //         parent_id: $parentId
  //         username: $name
  //       }
  //     ) {
  //       affected_rows
  //     }
  //   }
  // `);
  console.log("Yoo");
  console.log(e);
}

function setRows(e: any): void {
  e.target.rows = (e.target.value.match(/\n/gm) || []).length + 2;
}
</script>

<template>
  <div class="reply-input-container" :class="{ hidden: isReplyInputInactive }">
    <textarea
      name="reply"
      class="reply-input"
      cols="100"
      :rows="2"
      placeholder="Type your reply here"
      @input="setRows"
      v-model="content"
    ></textarea>
    <button type="submit" class="submit-reply" @click="submitReply">
      Reply
    </button>
  </div>
</template>
<style scoped lang="scss">
.hidden {
  display: none;
}
.reply-input-container {
  width: 100%;
  padding-block-start: 0.5rem;
  .reply-input {
    width: 100%;
    color: var(--color-text);
    background: var(--card-background);
    padding: 0.3rem 0.5rem;
    resize: none;
  }
  .submit-reply {
    padding: 0.4rem;
    border-radius: 2rem;
    border: none;
    outline: none;
    box-shadow: 0 0 4px var(--color-text);
    letter-spacing: 1px;
    margin: 0.3rem;
    background: #69c3ed;
    &:hover {
      background: #4d98bb;
    }
  }
}
</style>
