import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      alias: "/home",
      component: HomeView,
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
      path: "/comments",
      name: "comments",
      component: () => import("@/views/CommentThread.vue"),
    },
    {
      path: "/commentstest",
      name: "commentstest",
      component: () => import("@/views/CommentThread"),
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
              top: -10,
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
