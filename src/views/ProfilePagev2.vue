<script setup lang="ts">
import LocationPin from "../components/Icons/LocationPin.vue";
import HeartIcon from "../components/Icons/HeartIcon.vue";
import LinkIcon from "../components/Icons/LinkIcon.vue";
import { useElementBounding } from "@vueuse/core";
import { ref, watch, onMounted } from "vue";
const nav = ref(null);
const { y } = useElementBounding(nav);
const navIsCompact = ref(false);
const tabs = ["About", "Posts", "Favourites", "Followers", "Followings"];
watch(y, () => {
  //Will use different Method later
  if (y.value === 80) {
    navIsCompact.value = true;
  } else {
    navIsCompact.value = false;
  }
});

const currentSection = ref<string | null>("About");
onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.intersectionRatio > 0) {
        currentSection.value = entry.target.getAttribute("id");
      }
    },
    { threshold: 0, rootMargin: "0% 0px -75% 0px" }
  );
  document.querySelectorAll(".section h4").forEach((section) => {
    observer.observe(section);
  });
});
</script>
<template>
  <main class="container">
    <section class="user-info">
      <div class="cover-image"></div>
      <img
        src="https://avatars.githubusercontent.com/u/75153974?v=4"
        alt="user-avatar"
        class="avatar"
      />
    </section>
    <div class="background">
      <section class="basic-user-info">
        <div class="left-section">
          <span class="full-name">Jatin Thakur</span>
          <span class="special-title">pripo!dev</span>
          <span class="username">cryogon</span>
        </div>
        <div class="right-section">
          <div class="analytics">
            <div class="followers">
              <span>Followers</span>
              <span id="follower-count" class="count">999</span>
            </div>
            <div class="followings">
              <span>Followings</span>
              <span id="followings-count" class="count">999</span>
            </div>
          </div>
          <div class="options">
            <button type="button" class="follow-button">Follow</button>
            <button type="button" class="message-button">Message</button>
            <button type="button" class="report-button">Report</button>
          </div>
        </div>
      </section>
      <section class="user-detail-section card">
        <span class="date-joined">Member since January 2023</span>
        <div class="major-info">
          <span class="location">
            <LocationPin />
            India
          </span>
          <span class="interests">
            <HeartIcon />
            Gaming, Coding
          </span>
        </div>
        <div class="social-media-links">
          <a href="https://cryogon.netlify.app" class="website">
            <LinkIcon />
            cryogon.netlify.app
          </a>
          <!-- <a href="https://youtube.com/@cryogon" class="youtube">Youtube </a>
          <a href="https://www.instagram.com/cryogonjs/" class="instagram"
            >Instagram
          </a> -->
        </div>
      </section>
      <nav
        class="tab-navigation"
        :class="{ 'is-compact': navIsCompact }"
        ref="nav"
        id="nav"
      >
        <ul>
          <router-link
            v-for="(tab, i) in tabs"
            :key="i"
            :to="`#${tab}`"
            class="tab-item"
            :class="{ active: tab === currentSection }"
            >{{ tab }}</router-link
          >
        </ul>
      </nav>
      <section
        class="about-section card section"
        ref="aboutSection"
        id="aboutSection"
      >
        <h4 class="heading" id="About">About</h4>
      </section>
      <section
        class="posts-section card section"
        ref="postsSection"
        id="postsSection"
      >
        <h4 class="heading" id="Posts">Posts</h4>
      </section>
      <section
        class="favourite-section card section"
        ref="favouritesSection"
        id="favouritesSection"
      >
        <h4 class="heading" id="Favourites">Favourites</h4>
      </section>
      <section
        class="follower-section card section"
        ref="followersSection"
        id="followersSection"
      >
        <h4 class="heading" id="Followers">Followers</h4>
      </section>
      <section
        class="following-section card section"
        ref="followingsSection"
        id="followingsSection"
      >
        <h4 class="heading" id="Followings">Following</h4>
      </section>
    </div>
  </main>
</template>
<style scoped lang="scss">
.container {
  transition: 100ms;
  padding: 0 14vw;
  .card {
    min-height: 20rem;
    margin-block-start: 1rem;
    background-color: #303030;
    border-radius: 12px;
    padding: 0.3rem 1rem;
    .heading {
      font-weight: normal;
      text-decoration: underline;
    }
  }
  .user-info {
    position: relative;
    .cover-image {
      height: 18rem;
      width: 100%;
      background-color: grey;
    }
    .avatar {
      width: 9rem;
      height: 9rem;
      display: block;
      top: 12rem;
      left: 2.5rem;
      border-radius: 2rem;
      position: absolute;
    }
  }
  .background {
    background-color: #202020;
    min-height: 30rem;
    padding: 1rem;
    .basic-user-info {
      display: flex;
      flex-wrap: wrap;
      padding-block-end: 1.5rem;
      padding-inline: 2rem;
      justify-content: space-between;
      gap: 2rem;
      .left-section {
        display: flex;
        flex-direction: column;
        padding-block-start: 2.6rem;
        margin-inline-end: 5rem;

        .full-name {
          font-size: 20px;
        }
        .special-title {
          color: transparent;
          background: linear-gradient(var(--tag-background));
          background-clip: text;
          -moz-background-clip: text;
          -webkit-background-clip: text;
        }
        .username {
          opacity: 0.6;
        }
      }
      .right-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        .analytics {
          display: flex;
          gap: 4rem;
          .followers,
          .followings {
            display: flex;
            flex-direction: column;
            align-items: center;
            .count {
              color: transparent;
              background: linear-gradient(var(--tag-background));
              background-clip: text;
              -moz-background-clip: text;
              -webkit-background-clip: text;
            }
          }
        }
        .options {
          display: flex;
          gap: 1.5rem;
          button {
            padding: 0.3rem 0.9rem;
            border-radius: 9px;
            color: white;
            outline-color: transparent;
            border: 0;
            border-bottom: 2px solid white;
            margin-block-start: 2rem;
            transition: box-shadow 300ms;
            &:hover {
              background-color: rgb(95, 145, 91);
            }
            &:active {
              border-bottom: 0;
            }
          }
          .follow-button,
          .message-button {
            background-color: var(--accent-color);
          }
          .report-button {
            background-color: #e75151;
          }
        }
      }
    }
    .user-detail-section {
      min-height: auto;
      .date-joined {
        opacity: 0.6;
        font-size: 14px;
      }
      .major-info {
        display: flex;
        gap: 10px;
        margin-top: 0.1rem;
        .location,
        .interests {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      }
      .social-media-links {
        display: flex;
        margin-block-start: 0.1rem;
        flex-direction: column;
        a {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
    .tab-navigation {
      padding: 0.5rem;
      padding-inline-start: 1rem;
      margin-block-start: 1rem;
      border-radius: 12px;
      position: sticky;
      top: 5rem;
      background-color: #252525;
      transition: 200ms;
      &.is-compact {
        background-color: #202020;
        border-radius: 0;
      }
      .tab-item {
        cursor: pointer;
        position: relative;
        &.active {
          text-decoration: underline dotted;
        }
      }
      ul {
        display: flex;
        list-style: none;
        gap: 1rem;
      }
    }
  }
  @media screen and (max-width: 900px) {
    padding: 0 4rem;
  }
  @media screen and (max-width: 700px) {
    padding: 0 0;
  }
}
</style>
