<script setup lang="tsx">
import { Tree } from "@/composables/Tree";
import { usePripoStore } from "@/stores";
import { storeToRefs } from "pinia";
const { user } = storeToRefs(usePripoStore());
console.log(user);
const comment = {
  id: 1,
  content: "Nice Blog",
  username: "cryogon",
  parentId: null,
  likes: 0,
  blogId: 1,
  childrens: [
    {
      id: 2,
      content: "I agree",
      username: "kumuko",
      parentId: 1,
      likes: 0,
      blogId: 1,
      childrens: [],
    },
  ],
};
const comments = new Tree();
comments.add(comment);

comments.traverse((comment: any) => {
  console.log(comment);
});
</script>

<template>
  <div>Just Test</div>
</template>
<style scoped lang="scss">
input[type="text"] {
  background-color: var(--card-background);
  padding: 1rem;
  outline: none;
  border: none;
  color: var(--color-text);
}
</style>
