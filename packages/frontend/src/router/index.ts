import { createRouter, createWebHistory } from "vue-router";
import CosplayersView from "@/views/CosplayersView.vue";
import SubmitView from "@/views/SubmitView.vue";
import JuryView from "@/views/JuryView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: CosplayersView,
    },
    {
      path: "/cosplayers",
      name: "cosplayers",
      component: CosplayersView,
    },
    {
      path: "/submit",
      name: "submit",
      component: SubmitView,
    },
    {
      path: "/jury",
      name: "jury",
      component: JuryView,
    },
  ],
});

export default router;
