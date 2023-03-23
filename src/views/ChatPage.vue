<script setup lang="ts">
import { GET_CHAT_ALL, LISTEN_CHAT_CONTENT, ADD_CHAT } from "@/graphql";
import { useAuth0 } from "@auth0/auth0-vue";
import { useMutation, useQuery, useSubscription } from "@vue/apollo-composable";
import { ref, watchEffect, watch } from "vue";
import router from "@/router";
import { useScroll } from "@vueuse/core";
import type { Chat } from "@/types";
import { setMeta } from "@/utils";

const props = defineProps<{
  userParam: string;
}>();
setMeta({
  title: `Chats ● Pripo`,
  description: `Chatting With ${props.userParam || ""}`,
});
const { user } = useAuth0();
const { onResult: onChatListReceived } = useQuery(GET_CHAT_ALL, {
  user: user.value?.nickname || "",
});
const recipient = ref<any>([]);
const messsageContent = ref("");
const chats = ref<Chat[]>([]);
const chatScroll = ref();
const { y } = useScroll(chatScroll, {
  behavior: "smooth",
});
onChatListReceived((r) => {
  recipient.value = r.data.users[0].chatting_with;
});

function expandChat(_user: string) {
  const { onResult } = useSubscription(LISTEN_CHAT_CONTENT, {
    user: user.value?.nickname || "",
    receiver: _user,
  });
  onResult((result) => {
    chats.value = result.data.user_chats;
  });
}
function sendMessage(_user: string) {
  if (user.value?.nickname && !!messsageContent.value.length) {
    const { mutate: addChat } = useMutation(ADD_CHAT);
    addChat({
      user: user.value.nickname,
      receiver: _user,
      content: messsageContent.value,
    });
    messsageContent.value = "";
  }
}

function formatTime(time: number | string | Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
  }).format(new Date(time));
}
watch(chats, () => {
  setTimeout(() => {
    y.value = chatScroll.value.scrollHeight;
  }, 100);
});
watchEffect(() => {
  expandChat(router.currentRoute.value.params.userParam as string);
});
</script>
<template>
  <main>
    <section class="container">
      <aside class="user-list">
        <div
          class="user-list__item"
          :class="{
            selected: userParam && u.username === userParam,
          }"
          v-for="(u, i) in recipient"
          @click="router.replace(`/chat/${u.username}`)"
          :key="i"
        >
          <img :src="u.profile_picture" class="user-avatar" />
          <span class="user-name">{{ u.username }}</span>
        </div>
      </aside>
      <aside class="chat-main">
        <div class="chat-main__chats" ref="chatScroll">
          <!-- <div class="chat-main__header" @click="router.replace('/chat')">
            <fa-icon icon="arrow-left" />
            Go Back
          </div> -->
          <div
            class="chat-item"
            v-for="(chat, i) in chats"
            :key="i"
            :class="{ me: chat.sender.username === user?.nickname }"
          >
            <img
              class="chat-item__avatar"
              :src="chat.sender.profile_picture"
              alt=""
            />
            <div class="chat-item__detail">
              <span class="chat-content">
                {{ chat.content }}
              </span>
              <span class="chat-date">
                {{ formatTime(chat.created_at) }}
              </span>
            </div>
          </div>
        </div>

        <div class="chat-main__input-container" v-show="userParam">
          <input
            type="text"
            name="chat-main__input"
            class="chat-main__input"
            placeholder="Type a Message"
            @keypress.enter="sendMessage(userParam)"
            v-model="messsageContent"
          />
          <!-- <button @click="sendMessage(userParam)" class="chat_main__button">
            Send
          </button> -->
        </div>
      </aside>
    </section>
  </main>
</template>
<style scoped lang="scss">
main {
  height: 90vh;
  padding: 0 15vw;
  .container {
    display: flex;
    height: 100%;
    .user-list {
      background-color: #202020;
      width: 35%;
      overflow-y: auto;
      min-height: 10rem;
      padding: 0.3rem;
      .user-list__item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0.2rem;
        cursor: pointer;
        &.selected {
          background-color: var(--link-hover-background);
        }
        &:not(.selected):hover {
          background-color: var(--link-hover-background);
        }
        .user-avatar {
          width: 2.5rem;
          aspect-ratio: 1/1;
          border-radius: 50%;
        }
      }
    }
    .chat-main {
      background-color: #303030;
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      height: inherit;
      width: 100%;
      min-width: 23rem;
      min-height: 10rem;
      align-items: center;
      .chat-main__input-container {
        display: flex;
        padding: 0.3rem;
        gap: 10px;
        width: 100%;
        .chat-main__input {
          background-color: #202020;
          color: white;
          padding: 0.5rem;
          border: 0;
          outline-color: transparent;
          display: block;
          flex: 1;
        }
        .chat_main__button {
          all: unset;
          background-color: var(--accent-color);
          padding: 0.3rem;
          border-radius: 0.5rem;
          &:hover {
            cursor: pointer;
            background-color: rgb(0, 150, 100);
          }
        }
      }
      .chat-main__chats {
        width: 100%;
        max-height: 100%;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 0.3rem;
        }
        &::-webkit-scrollbar-track {
          border-radius: 2rem;
          background-color: #202020;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 2rem;
          background-color: #e75151;
        }
        .chat-item {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px;
          &.me {
            margin-inline-start: auto;
            flex-direction: row-reverse;
          }
          .chat-item__avatar {
            width: 3rem;
            aspect-ratio: 1/1;
            border-radius: 50%;
          }
          .chat-item__detail {
            display: flex;
            flex-direction: column;
            padding-inline: 0.3rem;
            line-break: anywhere;
            .chat-date {
              opacity: 0.7;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 700px) {
    padding-inline: 0;
    .container {
      display: flex;
      flex-direction: column;
      .user-list {
        width: 100%;
        display: flex;
        min-height: auto;
        min-width: 23rem;
        overflow-x: auto;
      }
      .chat-main {
        // display: none;
        position: relative;
        .chat-main__return {
          display: block;
          top: 0.2rem;
          position: absolute;
        }
      }
    }
  }
}
</style>
