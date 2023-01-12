import CommentInputBox from "./CommentInputBox.vue";
import CommentCard from "./CommentCard.vue";
import { CommentBuilder } from "@/composables/CommentBuilder";
import { useQuery } from "@vue/apollo-composable";
import { GET_COMMENTS } from "@/graphql";
import { watch, ref, defineComponent } from "vue";
function traverse(el: any, callback: any) {
  let els: JSX.Element[] = [];
  function walk(node: any) {
    callback(node);
    node?.children && node.children.forEach(walk);
    els = [...els, node];
  }
  walk(el);
  console.log(els.length, el.children.length);

  return els;
}

const CommentSection = defineComponent({
  props: { blogId: { type: Number } },
  name: "CommentSection",
  setup(props) {
    // console.log("Working");

    const { result: comments } = useQuery(GET_COMMENTS, {
      blogId: props.blogId,
    });
    const builder = new CommentBuilder();
    const currComments = ref();
    watch(comments, () => {
      builder.addMultiple(comments.value.comments);
      currComments.value = builder.root?.children;
      console.log(currComments.value);
    });
    return () => {
      return (
        currComments.value && (
          <section class="comment-section">
            <CommentInputBox />
            <div class="comments">
              {currComments.value.map((c: any) => (
                <div class="comment-reply-container">
                  {/* <CommentCard comment={c} />
                  {c.children.map((r: any) => {
                    return (
                      <div class="reply" style={`padding-inline-start: 2rem`}>
                        <div class="reply--main">
                          <CommentCard comment={r} />
                        </div>
                      </div>
                    );
                  })} */}
                  {traverse(c, (r: any) => (
                    <div class="reply" style={`padding-inline-start: 2rem`}>
                      <div class="reply--main">
                        <CommentCard comment={r} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )
      );
    };
  },
});

export default CommentSection;
