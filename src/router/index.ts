import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      alias: "/home",
      component: HomePage,
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactPage.vue"),
    },
    {
      path: "/posts/:id",
      name: "posts",
      component: () => import("@/views/BlogPage.vue"),
    },
    {
      path: "/publish",
      name: "publish",
      component: () => import("@/views/PostPage.vue"),
    },
    {
      path: "/users/:user",
      name: "users",
      component: () => import("@/views/ProfilePage.vue"),
    },
    {
      path: "/notifications",
      name: "notification",
      component: () => import("@/views/NotificationPage.vue"),
    },
    {
      path: "/search",
      name: "search",
      component: () => import("@/views/SearchPage.vue"),
    },
    {
      path: "/comments/:id",
      name: "comments",
      component: () => import("@/views/CommentThread.vue"),
    },
    {
      path: "/commentstest",
      name: "commentstest",
      component: () => import("@/views/CommentThread"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/views/UserSettingPage.vue"),
    },
    {
      //For Testing Purpose. Must remove when moved to production
      path: "/loading",
      name: "loading",
      component: () => import("@/components/LoadingScreen.vue"),
    },
    {
      path: "/404",
      name: "notfound",
      component: () => import("@/views/NotFound.vue"),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return new Promise((resolve, _reject) => {
        setTimeout(() => {
          if (savedPosition) {
            resolve(savedPosition);
          } else {
            resolve({
              el: to.hash,
              top: 150,
            });
          }
        }, 200);
      });
    }
  },
});

router.afterEach(() => {
  router.isReady().then(() => {
    document.title = localStorage.getItem("currentTitle") || "Pripo";
  });
});
export default router;
