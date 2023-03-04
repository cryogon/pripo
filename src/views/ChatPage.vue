<script setup lang="ts">
import { GET_CHAT_ALL, GET_CHAT_CONTENT, ADD_CHAT } from "@/graphql";
import { useAuth0 } from "@auth0/auth0-vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { ref, watchEffect } from "vue";
import router from "@/router";
import type { Chat } from "@/types";
defineProps<{
  userParam: string;
}>();

const { user } = useAuth0();
const { onResult: onChatReceived } = useQuery(GET_CHAT_ALL, {
  user: user.value?.nickname || "",
});
const recipents = ref();
const messsageContent = ref("");
const chats = ref<Chat>();
onChatReceived((r) => {
  recipents.value = r.data.user_chats;
  // console.log(r.data);
});

function expandChat(_user: string) {
  const { onResult } = useQuery(GET_CHAT_CONTENT, {
    user: user.value?.nickname || "",
    receiver: _user,
  });
  onResult((result) => {
    console.log(result.data);
    chats.value = result.data.user_chats[0];
  });
}
function sendMessage(_user: string) {
  if (user.value?.nickname && !!messsageContent.value.length) {
    const { mutate: addChat } = useMutation(ADD_CHAT);
    addChat({
      user: user.value.nickname,
      receiver: _user,
      chat: {
        id: chats.value?.chat.length,
        content: messsageContent.value,
        date: new Date().toUTCString(),
        is_deleted: false,
      },
    });
    messsageContent.value = "";
    console.log(chats.value);
  }
}

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
          :class="{ selected: userParam && u.chat_with.username === userParam }"
          v-for="(u, i) in recipents"
          @click="router.replace(`/chat/${u.chat_with.username}`)"
          :key="i"
        >
          <img :src="u.chat_with.profile_picture" class="user-avatar" />
          <span class="user-name">{{ u.chat_with.username }}</span>
        </div>
      </aside>
      <aside class="chat-main">
        <div class="chat-main__chats">
          <div
            class="chat-item"
            v-for="(chat, i) in chats?.chat"
            :key="i"
            :class="{ me: chats?.sender === user?.nickname }"
          >
            <img
              class="chat-item__avatar"
              src="https://res.cloudinary.com/dmerejjkt/image/upload/v1677831303/g2srp6sszksql4htyzkd.jpg"
              alt=""
            />
            <div class="chat-item__detail">
              <span class="chat-content">
                {{ chat.content }}
              </span>
              <span class="chat-date">
                {{
                  new Date(chat.date).getHours() +
                  ":" +
                  new Date(chat.date).getMinutes()
                }}
              </span>
            </div>
          </div>
        </div>

        <div class="chat-main__input-container">
          <input
            type="text"
            name="chat-main__input"
            class="chat-main__input"
            v-model="messsageContent"
          />
          <button @click="sendMessage(userParam)" class="chat_main__button">
            Send
          </button>
        </div>
      </aside>
    </section>
  </main>
</template>
<style scoped lang="scss">
main {
  padding: 1rem 15vw;
  .container {
    display: grid;
    grid-template-columns: max(20vw, 10rem) 1fr;
    .user-list {
      background-color: #202020;
      width: 100%;
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
      display: grid;
      width: 100%;
      min-height: 10rem;
      align-items: flex-end;
      .chat-main__input-container {
        display: flex;
        padding: 0.3rem;
        .chat-main__input {
          background-color: #202020;
          color: white;
          padding: 0.3rem;
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
            .chat-date {
              opacity: 0.7;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
