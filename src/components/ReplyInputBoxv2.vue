<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { ref, onMounted } from "vue";
import { POST_REPLY, EDIT_COMMENT } from "@/graphql";
import { useAuth0 } from "@auth0/auth0-vue";
import type { Comment } from "@/types";
import { useEmitter } from "@/composables/EventEmitter";
const props = defineProps<{
  isReplyInputInactive: boolean;
  comment: any;
  mode: "reply" | "edit";
}>();

const emit = defineEmits(["edit"]);
const emitter = useEmitter();
const { user } = useAuth0();
const content = ref("");
const shouldPostPublicaly = ref(false);

/**
 * @method submitReply
 * @param id uniquely identifies the current comment user clicked on
 */
async function submitReply(cmnt: Comment) {
  if (!content.value) {
    emitter.emit("alert", "Reply can't be empty");
    emitter.emit("replied");
    return;
  }
  const { mutate } = useMutation(POST_REPLY);
  mutate({
    blogId: cmnt.blog_id,
    content: content.value,
    name: user.value.preferred_username || user.value.nickname,
    parent_id: cmnt.id,
    isPublic: shouldPostPublicaly.value,
    receiver: cmnt.user.username,
  });

  //Used To toggle reply input box - handled in CommentCard component;
  emitter.emit("replied");
  //Used To refetch comments from db - handled in CommentSection Component;
  emitter.emit("refetchComments");
  content.value = "";
}

function editComment(cmnt: Comment) {
  emit("edit", content.value);
  const { mutate } = useMutation(EDIT_COMMENT);
  mutate({
    commentId: cmnt.id,
    content: content.value,
    isPublic: shouldPostPublicaly.value,
  });
  content.value = "";
}

function cancelReply() {
  emitter.emit("replied"); //Sending reply since all it is doing is appling hidden class on reply input container
}
onMounted(() => {
  if (props.mode == "edit") {
    content.value = props.comment.content;
    shouldPostPublicaly.value = props.comment.is_public;
  }
});
</script>
<template>
  <div class="container" :class="{ hidden: isReplyInputInactive }">
    <textarea
      class="input"
      name=""
      id=""
      placeholder="reply"
      v-model="content"
    ></textarea>
    <div class="options">
      <div
        class="post-button"
        role="button"
        @click="mode == 'reply' ? submitReply(comment) : editComment(comment)"
      >
        {{ mode == "reply" ? "Reply" : "Edit" }}
      </div>
      <div class="cancel-button" role="button" @click="cancelReply">Cancel</div>
      <span class="post-public-toggle">
        <input
          type="checkbox"
          name="post-public"
          id="post-public"
          v-model="shouldPostPublicaly"
        />
        <label for="post-public">post publicly</label>
      </span>
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  background-color: var(--input-box-background);
  margin-inline: 5rem;
  padding: 0.3rem 0.5rem;
  margin-block-start: 1rem;
  &.hidden {
    display: none;
  }
  .input {
    background-color: var(--input-box-background);
    color: var(--color-text);
    outline: none;
    border: none;
    resize: vertical;
    width: 100%;
    min-height: 3rem;
  }
  .options {
    display: flex;
    gap: 10px;
    align-items: center;
    .cancel-button {
      background-color: var(--deactive-input-box-background) !important;
    }
    div[role="button"] {
      background-color: var(--accent-color);
      padding: 0.3rem 1rem;
      border-radius: 2rem;
      cursor: pointer;
    }
    .post-public-toggle {
      display: flex;
      align-items: center;
      margin-inline-start: 1rem;
      gap: 5px;
      label {
        opacity: 0.7;
      }
    }
  }
}
</style>
