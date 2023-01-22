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
      path: "/404",
      name: "notfound",
      component: () => import("@/views/NotFound.vue"),
    },
  ],
});

router.afterEach(() => {
  router.isReady().then(() => {
    document.title = localStorage.getItem("currentTitle") || "Pripo";
  });
});
export default router;
