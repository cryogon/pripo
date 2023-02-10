<script setup lang="ts">
import { useEmitter } from "@/composables/EventEmitter";
import { ref } from "vue";
import type { ConfirmRequest } from "@/types";
const isVisible = ref(false);
const mutate = ref();
const variables = ref();

function clickYep(cb: (v: any) => void, variables: any) {
  console.log(variables);
  cb(variables);
  isVisible.value = false;
}
const emitter = useEmitter();
emitter.on("confirm", (d) => {
  mutate.value = (d as ConfirmRequest).mutate;
  variables.value = { id: (d as ConfirmRequest).id };
  isVisible.value = true;
});
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
  position: fixed;
  z-index: 900;
  pointer-events: visibleFill;
  background: #0d1b2a;
  padding: 0.7rem;
  border-radius: 1rem;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  animation: fade 300ms linear ease-in-out;
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
        background: white;
        border-bottom: 2px solid rgb(88, 88, 88);
        &:hover {
          border-bottom: 0;
        }
      }
    }
    @keyframes fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
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
