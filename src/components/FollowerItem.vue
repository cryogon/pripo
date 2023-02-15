<script setup lang="ts">
defineProps<{
  avatar: string;
  name: string;
  username: string;
}>();
function addThreeDots(str: string) {
  return str.length > 13 ? str.substring(0, 13) + "..." : str;
}
</script>
<template>
  <div class="follower-item">
    <router-link :to="`/users/${username}`">
      <img :src="avatar" alt="user_avatar" class="user_item_avatar" />
    </router-link>
    <div class="user-info">
      <div class="user-name">{{ addThreeDots(name) }}</div>
      <div class="user-username">{{ addThreeDots(username) }}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.follower-item {
  margin: 0.5rem;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  a {
    padding: 0;
  }
  .user_item_avatar {
    width: 7rem;
    height: 7rem;
    border-radius: 1.8rem;
  }
  .user-info {
    .user-username {
      font-size: 14px;
      opacity: 0.8;
    }
  }
}
</style>
