import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactPage.vue"),
    },
    {
      path: "/blogs/:id",
      name: "blogs",
      component: () => import("@/views/BlogPage.vue"),
    },
    {
      path: "/post",
      name: "post",
      component: () => import("@/views/PostPage.vue"),
    },
  ],
});

router.afterEach(() => {
  router.isReady().then(() => {
    document.title = localStorage.getItem("currentTitle") || "Pripo";
  });
});
export default router;
