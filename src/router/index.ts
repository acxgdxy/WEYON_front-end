import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "digital human",
      component: () => import("@/views/chat.vue")
    }, {
      path: "/chat",
      name: "chat",
      component: () => import("@/views/home.vue")
    }, {
      path: "/text",
      name: "txt",
      component: () => import("@/views/text.vue")
    }, {
      path: "/game",
      name: "game",
      component: () => import("@/views/game.vue")
    }
  ],
});

export default router;
