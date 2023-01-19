<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { ref, onMounted } from "vue";
import { POST_REPLY, EDIT_COMMENT } from "@/graphql";
import { useAuth0 } from "@auth0/auth0-vue";
const props = defineProps<{
  isReplyInputInactive: boolean;
  comment: any;
  mode: "reply" | "edit";
}>();
const { user } = useAuth0();
const content = ref("");
const shouldPostPublicaly = ref(false);

/**
 * @method submitReply
 * @param id uniquely identifies the current comment user clicked on
 */
async function submitReply(cmnt: any) {
  const { mutate } = useMutation(POST_REPLY);
  mutate({
    blogId: cmnt.blog_id,
    content: content.value,
    name: user.value.preferred_username || user.value.nickname,
    parent_id: cmnt.id,
    isPublic: shouldPostPublicaly.value,
  });
  content.value = "";
}

function editComment(cmnt: any) {
  const { mutate } = useMutation(EDIT_COMMENT);
  mutate({
    commentId: cmnt.id,
    content: content.value,
    isPublic: shouldPostPublicaly.value,
  });
  content.value = "";
}
function setRows(e: any): void {
  e.target.rows = (e.target.value.match(/\n/gm) || []).length + 2;
}
onMounted(() => {
  if (props.mode == "edit") {
    content.value = props.comment.content;
    shouldPostPublicaly.value = props.comment.is_public;
  }
});
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
    <button
      type="submit"
      class="submit-reply"
      @click="mode == 'reply' ? submitReply(comment) : editComment(comment)"
    >
      {{ mode == "reply" ? "Reply" : "Edit" }}
    </button>
    <span class="is_public">
      <input type="checkbox" id="is_public" v-model="shouldPostPublicaly" />
      <label for="is_public">Post Publicly</label>
    </span>
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
  .is_public {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-inline-start: 1rem;
    label {
      opacity: 0.7;
    }
  }
}
</style>
