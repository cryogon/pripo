<script setup lang="ts">
defineProps<{
  description: string;
}>();
function parseContent(content: string) {
  if (content.endsWith("!!!")) {
    return {
      status: "failed",
      content: content.replace("!!!", ""),
    };
  }
  if (content.endsWith("**")) {
    return {
      status: "warn",
      content: content.replace("**", ""),
    };
  }
  return {
    status: "success",
    content,
  };
}
</script>
<template>
  <main
    class="alert-box"
    :class="{
      failed: parseContent(description).status === 'failed',
      warn: parseContent(description).status === 'warn',
    }"
    role="alert"
  >
    <span>{{ parseContent(description).content }}</span>
  </main>
</template>
<style scoped lang="scss">
.alert-box {
  position: fixed;
  max-width: 50rem;
  background-color: var(--accent-color);
  padding: 1rem;
  animation: fadein 300ms linear;
  border-radius: 2rem;
  top: 4rem;
  left: 50%;
  z-index: 100000;
  opacity: 1;
  transform: translateX(-50%);
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  &.failed {
    background-color: rgb(227, 123, 123);
  }
  &.warn {
    background-color: goldenrod;
  }
}
</style>
