<script setup lang="ts"></script>
<template>
  <!-- <div class="loading-screen"></div> -->
  <div class="blob">
    <div class="inside"></div>
  </div>
</template>
<style scoped lang="scss">
div.blob {
  width: 8rem;
  height: 8rem;
  position: absolute;
  top: 50%;
  left: 50%;
  border: none;
  outline: none;
  background-color: lightgoldenrodyellow;
  border-radius: 50%;
  animation: blob 5s infinite;
  display: flex;
  overflow: hidden;
  transform: translate(-50%, -50%);
  align-items: flex-end;
  .inside {
    background-color: lightblue;
    width: 100%;
    animation: water-fill infinite 5s;
    @keyframes water-fill {
      0% {
        height: 0%;
        border-radius: 50% 0 0 50%;
      }
      50% {
        height: 100%;
        border-radius: 50% 50% 0 0%;
      }
      100% {
        height: 0%;
        border-radius: 50% 0 0 50%;
      }
    }
  }
  @keyframes blob {
    0% {
      border-radius: 50%;
    }
    15% {
      border-radius: 40% 50%;
    }
    30% {
      border-radius: 50% 40%;
    }
    45% {
      border-radius: 40% 40% 50%;
    }
    60% {
      border-radius: 50% 30% 50%;
    }
    75% {
      border-radius: 50% 40% 40%;
    }
    90% {
      border-radius: 40%, 40%, 30%;
    }
    100% {
      border-radius: 50%;
    }
  }
}
div.loading-screen {
  width: 5rem;
  height: 5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  background: var(--loading-background);
  animation: anim infinite 2s;

  @mixin rotation-start {
    border-radius: 0;
    rotate: 0;
    opacity: 1;
  }
  @keyframes anim {
    0% {
      @include rotation-start();
    }
    50% {
      border-radius: 50%;
      rotate: 0.5turn;
      opacity: 0.5;
    }
    100% {
      @include rotation-start();
    }
  }
}
</style>
