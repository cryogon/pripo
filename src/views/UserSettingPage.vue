<script setup lang="ts">
import { useFileDialog } from "@vueuse/core";
import { watch, ref } from "vue";
import PencilIcon from "@/components/Icons/PencilIcon.vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useEmitter } from "@/composables/EventEmitter";
import axios from "axios";
const emitter = useEmitter();
const { files, open, reset } = useFileDialog();
const isImageUploading = ref<boolean | null>(false);
const { getAccessTokenSilently, user } = useAuth0();

watch(files, () => {
  if (files.value?.length) {
    if (!files.value[0].type.includes("image")) {
      emitter.emit("alert", "Only Image files are allowed");
      reset();
      return;
    }
    if (files.value[0].size / 1024 / 1024 >= 5) {
      emitter.emit("alert", "Image Size should be less than 2MB");
      reset();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      img.value = `"${reader.result}"`;
    };
    files.value && reader.readAsDataURL(files.value[0]);
  }
});

function onDragOver(event: any) {
  event.stopPropagation();
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = "copy";
}
function onDrop(event: any) {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  console.log(fileList);
}
function openImage() {
  open({ accept: "image/gif,image/jpeg,image/x-png" });
}
const img = ref<string | null>(`${user.value.picture}`);

async function uploadImage() {
  const data = new FormData();
  data.append("file", files.value?.item(0) as any);
  data.append("upload_preset", "wdo2tdms");
  console.log(import.meta.env.VITE_IMG_UPLOAD_PATH);
  const image = await axios({
    url: import.meta.env.VITE_IMG_UPLOAD_PATH,
    method: "POST",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return image.data;
}

function updateImage() {
  isImageUploading.value = true;
  uploadImage()
    .then((image) => {
      getAccessTokenSilently().then((token) => {
        const url = "https://pripo-api.vercel.app/avatar/" + user.value.sub;
        axios
          .post(
            url,
            {
              avatar: image.url,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            }
          )
          .then(() => {
            isImageUploading.value = false;
            emitter.emit("alert", "Avatar Updated Sucessfully");
            reset();
          })
          .catch((err) => {
            console.error(err);
            emitter.emit("alert", "Avatar failed to Update!!!");
            img.value = user.value?.picture || "";
          });
      });
    })
    .catch((err) => {
      console.error(err);
      emitter.emit("alert", "Avatar failed to Update!!!");
      reset();
      return;
    });
}
function clearImage() {
  reset();
  img.value = user.value?.picture || "";
}
function changeUsername() {
  emitter.emit("alert", "Changing username is not allowed yet!");
}
// function changeFullName() {}
</script>
<template>
  <main class="settings-container">
    <section class="main">
      <section class="settings">
        <h2 class="heading" id="profile">Profile</h2>
        <article class="profile-settings" id="profile">
          <div class="user-avatar" :style="`--image-url:url(${img});`">
            <label for="drop-area" class="option">avatar</label>
            <div
              id="drop-area"
              class="drop-area"
              @dragover="onDragOver"
              @drop="onDrop"
              @click="openImage"
            >
              <i class="edit-icon" title="change profile">
                <PencilIcon class="icon" />
              </i>
            </div>
            <button
              class="upload avatar-options"
              :class="{
                uploading: isImageUploading,
              }"
              v-if="files?.length"
              @click="updateImage"
            >
              Upload
            </button>
            <button
              class="cancel avatar-options"
              v-if="files?.length"
              @click="clearImage"
            >
              Cancel
            </button>
          </div>
          <div class="user-options">
            <div class="user-option-child">
              <label for="fullname" class="option">full name</label>
              <input
                type="text"
                id="fullname"
                class="input-option"
                :value="user.name"
                placeholder="Full Name"
              />
            </div>
            <div class="user-option-child">
              <label for="username" class="option"> username </label>
              <span id="username">{{ user.nickname }}</span>
              <button class="change-button" @click="changeUsername">
                Change
              </button>
            </div>
            <div class="user-option-child social-links">
              <span class="option">social links</span>
              <input type="text" class="input-option" placeholder="link1" />
              <input type="text" class="input-option" placeholder="link2" />
              <input type="text" class="input-option" placeholder="link3" />
              <input type="text" class="input-option" placeholder="link4" />
            </div>
            <div class="user-option-child">
              <label for="about" class="option">about</label>
              <textarea
                id="about"
                class="input-option about-area"
                placeholder="about"
              ></textarea>
            </div>
            <div class="user-option-child">
              <label for="location" class="option">location</label>
              <input
                type="text"
                id="location"
                class="input-option"
                placeholder="current location"
              />
            </div>
            <div class="user-option-child">
              <label for="Interests" class="option">interests</label>
              <input
                type="text"
                id="interests"
                class="input-option"
                placeholder="interests"
              />
            </div>
          </div>
        </article>
      </section>
      <!-- Will enable this when all tabs are available. now only profile is available -->
      <aside class="mini-nav" style="display: none">
        <a class="nav-item" href="#profile">Profile</a>
        <a class="nav-item" href="#notification">Notification</a>
        <a class="nav-item" href="#apperence">Appearence</a>
        <a class="nav-item" href="#privacy">Privacy</a>
      </aside>
    </section>
  </main>
</template>
<style scoped lang="scss">
.settings-container {
  padding: 1rem min(17vw, 20rem);
  .main {
    justify-content: space-between;
    background-color: #202020;
    display: flex;
    padding: 1rem 4rem;
    .settings {
      width: 80%;
      .option {
        opacity: 0.8;
        display: block;
        margin-block-end: 0.2rem;
      }
      .heading {
        position: relative;
        &::before {
          content: "";
          position: absolute;
          left: -0.5rem;
          top: 0;
          height: 1.8rem;
          width: 2px;
          background-color: var(--color-text);
        }
      }
      .user-avatar {
        width: 30%;
        .drop-area {
          width: 9rem;
          height: 9rem;
          border-radius: 1rem;
          background-color: grey;
          background-image: var(--image-url);
          background-size: cover;
          background-repeat: no-repeat;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          .edit-icon {
            padding: 0.3rem;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background-color: #303030;
            user-select: none;
            position: relative;
            cursor: pointer;
            margin: 0.5rem;
            .icon {
              position: absolute;
              width: 1.2rem;
              height: 1.2rem;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
        .avatar-options {
          padding: 0.5rem 1rem;
          outline-color: none;
          border-radius: 0.5rem;
          border: 0;
          color: var(--tag-color);
          margin-block-start: 1rem;
          &.upload {
            background: linear-gradient(var(--tag-background));
            width: 4.5rem;
            will-change: color, width, border-radius;
            &.done {
              background: linear-gradient(rgb(19, 174, 19), lightgreen);
            }
            &.uploading {
              color: transparent;
              transition-property: padding, margin, width, border-radius;
              transition-duration: 300ms;
              transition-timing-function: linear;
              height: 2rem;
              width: 2rem;
              border-radius: 50%;
              margin-inline: 1rem;
              padding: 0 0;
              animation: loading 500ms infinite;
              animation-delay: 300ms;
              @keyframes loading {
                from {
                  transform: rotate(0);
                }
                to {
                  transform: rotate(1turn);
                }
              }
            }
          }
          &.cancel {
            background: #dedede;
            margin-inline-start: 0.3rem;
          }
        }
      }
      .profile-settings {
        display: flex;
        gap: 5rem;
        .user-options {
          .user-option-child {
            margin-block-end: 1rem;
            &.social-links {
              display: flex;
              flex-direction: column;
              gap: 0.3rem;
            }
            .input-option {
              padding: 0.5rem;
              outline-color: none;
              border-radius: 0.3rem;
              border: 0;
              color: var(--text-color);
              background-color: #303030;
              &.about-area {
                min-height: 5rem;
                resize: vertical;
              }
            }
            .change-button {
              padding: 0.5rem;
              background: linear-gradient(var(--tag-background));
              outline-color: none;
              border-radius: 0.5rem;
              border: 0;
              color: var(--tag-color);
              margin-inline-start: 2rem;
            }
          }
        }
      }
    }
    .mini-nav {
      display: flex;
      flex-direction: column;
      .nav-item {
        &:hover {
          cursor: pointer;
          background-color: #303030;
        }
      }
    }
  }
  @media screen and (max-width: 1200px) {
    padding: 0 5rem;
  }
  @media (max-width: 900px) {
    padding: 0;
    .main {
      flex-direction: column-reverse;
      padding: 1rem 1rem;
      .settings {
        .profile-settings {
          flex-direction: column;
        }
      }
      .mini-nav {
        flex-direction: row;
        gap: 1rem;
        padding: 0.3rem;
        background-color: #161616;
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
