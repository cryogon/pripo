<script setup lang="ts">
import type { Comment } from "@/types";
import { ref } from "vue";
import { getUser } from "@/user";
import { useEmitter } from "@/composables/EventEmitter";

const props = defineProps<{
  isReplyInputInactive: boolean;
  comment: Comment;
}>();
const emitter = useEmitter();
const comment = ref(props.comment);
const content = ref("");
const user = getUser();

/**
 * @method submitReply
 * @param id uniquely identifies the current comment user clicked on
 */
function submitReply() {
  if (comment.value && content.value.trim().length > 0) {
    if (!comment.value.reply) {
      comment.value.reply = [
        {
          id: 0,
          content: content.value,
          likes: {
            count: 0,
            users: [],
          },
          postedOn: new Date(),
          user: user.currUser,
        },
      ];
    } else {
      comment.value.reply.push({
        id: 0,
        content: content.value,
        likes: {
          count: 0,
          users: [],
        },
        postedOn: new Date(),
        user: user.currUser,
      });
    }
  }
  emitter.emit("replyInactive");
  content.value = "";
  console.log(comment.value.reply);
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
