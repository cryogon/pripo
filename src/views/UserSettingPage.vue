<script setup lang="ts">
import { useFileDialog } from "@vueuse/core";
import { watch, ref } from "vue";
const { files, open } = useFileDialog();
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
const img = ref<string | null | ArrayBuffer>();
watch(files, () => {
  const reader = new FileReader();
  reader.onload = () => {
    img.value = `"${reader.result}"`;
    console.log(img.value);
  };
  files.value && reader.readAsDataURL(files.value[0]);
  console.log(files);
});
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
            ></div>
          </div>
          <div class="user-options">
            <div class="user-option-child">
              <label for="fullname" class="option">full name</label>
              <input
                type="text"
                id="fullname"
                class="input-option"
                value="Jatin Thakur"
                placeholder="Full Name"
              />
            </div>
            <div class="user-option-child">
              <label for="username" class="option"> username </label>
              <span id="username">cryogon</span>
              <button class="change-button">Change</button>
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
                value="India"
                placeholder="Current Location"
              />
            </div>
            <div class="user-option-child">
              <label for="Interests" class="option">interests</label>
              <input
                type="text"
                id="interests"
                class="input-option"
                value="Gaming, Sleeping"
                placeholder="Interests"
              />
            </div>
          </div>
        </article>
      </section>
      <aside class="mini-nav">
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
  padding: 1rem 20rem;
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
        .drop-area {
          width: 9rem;
          height: 9rem;
          border-radius: 1rem;
          background-color: grey;
          background-image: var(--image-url);
          background-size: cover;
          background-repeat: no-repeat;
        }
      }
      .profile-settings {
        display: flex;
        gap: 5rem;
        :target {
          color: red;
          background-color: red;
        }
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
  @media (max-width: 700px) {
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
