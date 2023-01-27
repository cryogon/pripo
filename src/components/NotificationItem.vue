<script setup lang="ts">
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import BellIcon from "./Icons/BellIcon.vue";
import CheckIcon from "./Icons/CheckIcon.vue";
import { MARK_NOTIFICATION_READ } from "@/graphql";
const props = defineProps<{
  user: string;
  desc: string;
  content: string;
  id: number;
  created_at: string;
}>();
const date = new Date(props.created_at);
const timeFormatter = new Intl.RelativeTimeFormat("en", {
  localeMatcher: "best fit",
  numeric: "always",
  style: "long",
});
const timeDifference = ref(getTimeDifference(date, new Date()));

function getTimeDifference(oldtime: Date, currtime: Date) {
  const timeInSeconds = (currtime.getTime() - oldtime.getTime()) / 1000; // Converted Miliseconds to seconds
  const timeInMinutes = timeInSeconds / 60;
  const timeInHours = timeInMinutes / 60;
  const timeInDays = timeInHours / 24;
  if (timeInSeconds < 60) {
    return [Math.round(timeInSeconds), "seconds"];
  }
  if (timeInMinutes < 60) {
    return [Math.round(timeInMinutes), "minute"];
  }
  if (timeInHours < 24) {
    return [Math.round(timeInHours), "hour"];
  }
  if (timeInDays < 30) {
    return [Math.round(timeInDays), "day"];
  }
  return [Math.round(timeInDays / 30), "month"];
}

function markRead(id: number) {
  const { mutate } = useMutation(MARK_NOTIFICATION_READ);
  mutate({ id });
}
</script>
<template>
  <div class="link container">
    <BellIcon class="bell" />
    <div class="info">
      <div>
        <span class="user">{{ user + " " }}</span>
        <span class="description"> {{ desc }}</span>
        <p class="content">
          {{
            content.length < 20
              ? content.substring(0, 20)
              : content.substring(0, 20) + "..."
          }}
        </p>
      </div>
      <span class="time">{{
        timeFormatter.format(-timeDifference[0], timeDifference[1] as any)
      }}</span>
    </div>
    <div class="check">
      <CheckIcon @click="markRead(id)" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.container {
  padding: 0.1rem;
  color: var(--color-text);
  background-color: var(--dropdown-background);
  margin-block-end: 0.5rem;
  display: flex;
  font-size: 14px;
  gap: 10px;

  .bell {
    width: 1.2rem;
    height: 2rem;
    align-self: flex-start;
  }
  .info {
    padding-top: 0.4rem;
    .time {
      margin-inline-start: 9rem;
      opacity: 0.6;
    }
    .user {
      font-weight: bolder;
    }
    .content {
      color: #dbff00;
    }
  }
  .check {
    display: none;
    margin-block-start: 0.3rem;
    height: 1.4rem;
    padding: 0.2rem 0.5rem;
    &:hover {
      background-color: var(--link-hover-background);
    }
  }
  &:hover .check {
    display: block;
  }
}
</style>
