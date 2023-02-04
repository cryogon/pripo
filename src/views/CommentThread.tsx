import { defineComponent, ref, watch } from "vue";
import CommentCardv2 from "../components/CommentCardv2.vue";
import { CommentBuilder } from "@/composables/CommentBuilder";
import { useQuery } from "@vue/apollo-composable";
import { GET_THREAD_COMMENT } from "@/graphql";
import type { Comment } from "@/types";
import "@/assets/comment-thread.css";
const CommentThread = defineComponent({
  name: "CommentThread",
  setup() {
    const builder = ref(new CommentBuilder());
    const { result } = useQuery(GET_THREAD_COMMENT, { id: 1 });
    const comments = ref<Comment[] | null>(null);
    watch(result, () => {
      builder.value.clear();
      builder.value.addMultiple(result.value.comments);
      comments.value = builder.value.root?.children;
    });
    return () => (
      <main>
        <h1>Comments</h1>
        <section class="comment-container">
          <div class="comment-main">
            {comments.value && <CommentCardv2 comment={comments.value[0]} />}
            {comments.value &&
              builder.value.returnJsx((v: Comment) => {
                return (
                  <div class="reply-main">
                    <CommentCardv2 comment={v} />
                  </div>
                );
              })}
          </div>
        </section>
      </main>
    );
  },
});
export default CommentThread;
