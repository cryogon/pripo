<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  mutate: (variables: any) => void;
  variables: any;
}>();
const isVisible = ref(true);
function clickYep(cb: (v: any) => void, variables: any) {
  cb(variables);
  isVisible.value = false;
}
</script>
<template>
  <div class="container" v-if="isVisible">
    <div class="child">
      Are you sure you want to perform this task. This task might be
      irreversible.
    </div>
    <div class="buttons">
      <button
        class="child accept"
        type="button"
        @click="clickYep(mutate, variables)"
      >
        Yep
      </button>
      <button class="child deny" type="button" @click="isVisible = false">
        Nah
      </button>
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  position: absolute;
  background: #0d1b2a;
  padding: 0.7rem;
  border-radius: 1rem;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  animation: test 300ms linear;
  width: 30rem;
  height: 6rem;
  & .buttons {
    display: flex;
    gap: 10px;
    & button {
      padding: 0.3rem 0.7rem;
      border-radius: 8px;
      outline-color: transparent;
      transition: 100ms;
      border: 0;
      &.accept {
        background: var(--accent-color);
        border-bottom: 2px solid white;
        &:hover {
          border-bottom: 0;
        }
      }
      &.deny {
        background: var(--input-box-background);
        border-bottom: 2px solid rgb(88, 88, 88);
        &:hover {
          border-bottom: 0;
        }
      }
    }
  }
  // @keyframes test {
  //   from {
  //     width: 1rem;
  //     height: 1rem;
  //     border-radius: 50%;
  //     opacity: 0;
  //   }
  //   50% {
  //     width: 30rem;
  //     height: 30rem;
  //     border-radius: 0;
  //     opacity: 1;
  //   }
  //   to {
  //     width: 30rem;
  //     height: 5rem;
  //     border-radius: 0;
  //     opacity: 1;
  //   }
  // }
}
</style>
