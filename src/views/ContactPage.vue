<script setup lang="tsx">
import { CommentBuilder } from "@/composables/CommentBuilder";
const testComments = [
  { id: 2, parent_id: null, content: "My Favorite Game" },
  { id: 22, parent_id: null, content: "Root Message: Second" },
  { id: 23, parent_id: null, content: "Root Message: The Third" },
  { id: 5, parent_id: 2, content: "Testing Reply Second Time" },
  { id: 6, parent_id: 2, content: "Replying Again" },
  {
    id: 24,
    parent_id: 23,
    content: "Reply Of Root Message: The Third",
  },
];

const tree = new CommentBuilder();
tree.addMultiple(testComments);
console.log(tree.root);
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
