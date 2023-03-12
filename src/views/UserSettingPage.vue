<script setup lang="ts">
import { useFileDialog } from "@vueuse/core";
import { watch, ref } from "vue";
import PencilIcon from "@/components/Icons/PencilIcon.vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { useEmitter } from "@/composables/EventEmitter";
import axios from "axios";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  UPDATE_LOCATION,
  UPDATE_INTERESTS,
  SET_LINKS,
  GET_USER_BY_USERNAME,
  UPDATE_PROFILE_VISIBILITY,
} from "@/graphql";
const emitter = useEmitter();
const { files, open, reset } = useFileDialog();
const isImageUploading = ref<boolean | null>(false);
const { getAccessTokenSilently, user } = useAuth0();
const fullNameChangeStatus = ref("idle");
const locationChangeStatus = ref("idle");
const interestsChangeStatus = ref("idle");
const profileVisibiltyChangeStatus = ref("idle");
const linksChangeStatus = ref(Array.from({ length: 4 }).fill("idle"));
const dbUser = ref();
const { onResult } = useQuery(GET_USER_BY_USERNAME, {
  username: user.value.nickname,
});
let fullNameTimeout: any;
let locationTimeout: any;
let interestsTimeout: any;
let linkTimeout: any;
let links = ref<{ url: string }[]>([]);

localStorage.setItem("currentTitle", "Settings");

onResult((r) => {
  dbUser.value = r.data.users[0];
  links.value = (r.data.users[0].social_links || []).map((link: any) => link);
});

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

function openImage() {
  open({ accept: "image/gif,image/jpeg,image/x-png" });
}
const img = ref<string | null>(`${user.value.picture}`);

async function uploadImage() {
  const data = new FormData();
  data.append("file", files.value?.item(0) as any);
  data.append("upload_preset", import.meta.env.VITE_IMG_PRESET);
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
              avatar: image.secure_url,
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
function changeFullName(e: any) {
  fullNameChangeStatus.value = "updating";
  clearTimeout(fullNameTimeout);
  fullNameTimeout = setTimeout(() => {
    getAccessTokenSilently()
      .then((token) => {
        const url = "https://pripo-api.vercel.app/user/" + user.value.sub;
        if (e.target && e.target.value.length > 0) {
          axios
            .post(
              url,
              {
                fullname: e.target.value,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              }
            )
            .then(() => {
              fullNameChangeStatus.value = "updated";
              setTimeout(() => {
                fullNameChangeStatus.value = "idle";
              }, 1000);
            })
            .catch((err) => {
              console.error(err.message);
            });
        } else {
          emitter.emit("alert", "Full Name length should be greater than 1");
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  }, 3000);
}

function changeLocation(e: any) {
  locationChangeStatus.value = "updating";
  clearTimeout(locationTimeout);
  locationTimeout = setTimeout(() => {
    const { mutate } = useMutation(UPDATE_LOCATION);
    if (e.target && e.target.value.length > 2) {
      mutate({
        user: user.value.nickname,
        loc: e.target.value,
      })
        .then(() => {
          locationChangeStatus.value = "updated";
          setTimeout(() => {
            locationChangeStatus.value = "idle";
          }, 1000);
          // emitter.emit("alert", "Location Updated Sucessfully");
          reset();
        })
        .catch((err) => {
          console.error(err);
          locationChangeStatus.value = "failed";
          setTimeout(() => {
            locationChangeStatus.value = "idle";
          }, 1000);
          emitter.emit("alert", "Location failed to Update!!!");
        });
    }
  }, 3000);
}
function changeInterests(e: any) {
  interestsChangeStatus.value = "updating";
  clearTimeout(interestsTimeout);
  interestsTimeout = setTimeout(() => {
    const { mutate } = useMutation(UPDATE_INTERESTS);
    if (e.target && e.target.value.length > 0) {
      mutate({
        user: user.value.nickname,
        interests: e.target.value,
      })
        .then(() => {
          interestsChangeStatus.value = "updated";
          setTimeout(() => {
            interestsChangeStatus.value = "idle";
          }, 1000);
          // emitter.emit("alert", "Interests Updated Sucessfully");
          reset();
        })
        .catch((err) => {
          console.error(err);
          interestsChangeStatus.value = "failed";
          setTimeout(() => {
            interestsChangeStatus.value = "idle";
          }, 1000);
          emitter.emit("alert", "Interests failed to Update!!!");
        });
    }
  }, 3000);
}
function setLinks(event: any, pos: number) {
  clearTimeout(linkTimeout);
  linksChangeStatus.value[pos] = "updating";
  linkTimeout = setTimeout(() => {
    links.value[pos] = { url: event.target.value };
    const re = /\bhttps?:\S+\b/;
    const link = links.value[pos].url.match(re);
    const { mutate } = useMutation(SET_LINKS);
    if (!link) {
      linksChangeStatus.value[pos] = "failed";
      setTimeout(() => {
        linksChangeStatus.value[pos] = "idle";
      }, 1000);
      return emitter.emit("alert", "Enter a valid URL!!!");
    }
    mutate({ link: links.value, user: user.value.nickname })
      .then(() => {
        linksChangeStatus.value[pos] = "updated";
        setTimeout(() => {
          linksChangeStatus.value[pos] = "idle";
        }, 1000);
      })
      .catch((err) => {
        emitter.emit("alert", "Links Failed to update!!!");
        linksChangeStatus.value[pos] = "failed";
        setTimeout(() => {
          linksChangeStatus.value[pos] = "idle";
        }, 1000);
        console.error(err);
      });
  }, 3000);
}

function setProfileVisibility(e: Event) {
  if (!user.value?.nickname) {
    return;
  }
  const { value } = e.target as HTMLInputElement;
  profileVisibiltyChangeStatus.value = "updating";
  useMutation(UPDATE_PROFILE_VISIBILITY, {
    variables: {
      user: user.value.nickname,
      visibility: value,
    },
  })
    .mutate()
    .then(() => {
      profileVisibiltyChangeStatus.value = "updated";
      setTimeout(() => {
        profileVisibiltyChangeStatus.value = "idle";
      }, 1000);
    })
    .catch((err) => {
      emitter.emit("alert", "Couldn't update visisbilty!!!");
      console.error(err);
    });
}
</script>
<template>
  <main class="settings-container">
    <section class="main">
      <section class="settings">
        <h2 class="heading" id="profile">Profile</h2>
        <article class="profile-settings" id="profile">
          <div class="user-avatar" :style="`--image-url:url(${img});`">
            <label for="drop-area" class="option">avatar</label>
            <div id="drop-area" class="drop-area" @click="openImage">
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
                class="input-option fullname__input"
                :value="user.name"
                @input="changeFullName"
                placeholder="Full Name"
              />
              <span
                :class="{
                  'user-options__updating': fullNameChangeStatus === 'updating',
                  'user-options__updated': fullNameChangeStatus === 'updated',
                }"
              ></span>
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
              <div
                v-for="val in [0, 1, 2, 3]"
                :key="val"
                class="link-container"
              >
                <input
                  class="input-option"
                  type="text"
                  :value="
                    (dbUser?.social_links && dbUser?.social_links[val])?.url ||
                    ''
                  "
                  :placeholder="'link' + (val + 1)"
                  @input="setLinks($event, val)"
                />
                <span
                  :class="{
                    'user-options__updating link':
                      linksChangeStatus[val] === 'updating',
                    'user-options__updated link':
                      linksChangeStatus[val] === 'updated',
                  }"
                ></span>
              </div>
            </div>

            <div class="user-option-child">
              <label for="location" class="option">location</label>
              <input
                type="text"
                id="location"
                class="input-option"
                :value="dbUser?.location || ''"
                @input="changeLocation"
                placeholder="current location"
              />
              <span
                :class="{
                  'user-options__updating': locationChangeStatus === 'updating',
                  'user-options__updated': locationChangeStatus === 'updated',
                }"
              ></span>
            </div>
            <div class="user-option-child">
              <label for="Interests" class="option">interests</label>
              <input
                type="text"
                id="interests"
                @input="changeInterests"
                :value="dbUser?.interests || ''"
                class="input-option"
                placeholder="interests"
              />
              <span
                :class="{
                  'user-options__updating':
                    interestsChangeStatus === 'updating',
                  'user-options__updated': interestsChangeStatus === 'updated',
                }"
              ></span>
            </div>
          </div>
        </article>
        <article class="privacy-settings">
          <h2 class="heading" id="privacy">Privacy</h2>
          <ul class="privacy-options">
            <li class="privacy-item">
              <span> Profile Visibiity Option </span>
              <div class="profile-visibility-options">
                <select
                  name="profile_visibility"
                  id="profile-visibility-options"
                  class="profile-visibility-options-item"
                  @change="setProfileVisibility"
                >
                  <option value="default">default</option>
                  <option value="partial">partial</option>
                  <option value="none">none</option>
                </select>
                <span
                  :class="{
                    'privacy-options__updating':
                      profileVisibiltyChangeStatus === 'updating',
                    'privacy-options__updated':
                      profileVisibiltyChangeStatus === 'updated',
                  }"
                ></span>
              </div>
            </li>
          </ul>
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
            position: relative;
            .user-options__updated {
              position: absolute;
              right: -2rem;
              top: 55%;
              width: 1rem;
              transition: 1s;
              background-color: rgb(99, 250, 99);
              height: 1rem;
              clip-path: polygon(
                14% 50%,
                33% 81%,
                100% 0,
                100% 18%,
                32% 100%,
                0% 50%
              );
              &.link {
                top: 30%;
                right: -3rem;
              }
            }
            .user-options__updating {
              outline: 3px dotted var(--color-text);
              border-radius: 50%;
              align-items: center;
              position: absolute;
              right: -2rem;
              top: 55%;
              width: 1rem;
              height: 1rem;
              animation: rotate 1s ease-out infinite;
              &.link {
                top: 30%;
                right: -3rem;
              }
              @keyframes rotate {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            }
            &.social-links {
              display: flex;
              flex-direction: column;
              gap: 0.3rem;
              .link-container {
                position: relative;
              }
            }
            .input-option {
              padding: 0.5rem;
              outline-color: none;
              border-radius: 0.3rem;
              border: 0;
              color: var(--text-color);
              background-color: #303030;
              position: relative;
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
      .privacy-settings {
        .privacy-options {
          list-style: none;
          .privacy-item {
            display: flex;
            gap: 1rem;
            margin: 0.5rem;
            .profile-visibility-options {
              position: relative;
              .profile-visibility-options-item {
                background-color: #303030;
                color: white;
              }
              .privacy-options__updating {
                outline: 3px dotted var(--color-text);
                border-radius: 50%;
                // align-items: center;
                position: absolute;
                right: -2rem;
                top: 20%;
                width: 1rem;
                height: 1rem;
                background: red;
                animation: rotate 1s ease-out infinite;

                @keyframes rotate {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              }
              .privacy-options__updated {
                position: absolute;
                right: -2rem;
                top: 20%;
                width: 1rem;
                transition: 1s;
                background-color: rgb(99, 250, 99);
                height: 1rem;
                clip-path: polygon(
                  14% 50%,
                  33% 81%,
                  100% 0,
                  100% 18%,
                  32% 100%,
                  0% 50%
                );
                &.link {
                  top: 30%;
                  right: -3rem;
                }
              }
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
