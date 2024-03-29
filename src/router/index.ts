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
      meta: {
        requiresAuth: true,
      },
      component: () => import("@/views/PostPage.vue"),
    },
    {
      path: "/users/:user",
      name: "users",
      component: () => import("@/views/ProfilePage.vue"),
    },
    {
      path: "/v1/users/:user",
      name: "usersv2",
      component: () => import("@/views/ProfilePagev1.vue"),
    },
    {
      path: "/notifications",
      name: "notification",
      meta: {
        requiresAuth: true,
      },
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
      path: "/settings",
      name: "settings",
      meta: {
        requiresAuth: true,
      },
      component: () => import("@/views/UserSettingPage.vue"),
    },
    {
      //For Testing Purpose. Must remove when moved to production
      path: "/loading",
      name: "loading",
      component: () => import("@/components/LoadingScreen.vue"),
    },
    {
      path: "/chat/:userParam?",
      name: "chat",
      meta: {
        requiresAuth: true,
      },
      props: true,
      component: () => import("@/views/ChatPage.vue"),
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
        }, 300);
      });
    }
  },
});

router.afterEach((to) => {
  router.isReady().then(async () => {
    if (to.meta.requiresAuth) {
      if (!localStorage.getItem("token")) {
        router.back();
        const useEmitter = (await import("@/composables/EventEmitter"))
          .useEmitter;
        useEmitter().emit("alert", "Login Required!!!");
      }
    }
  });
});
export default router;
