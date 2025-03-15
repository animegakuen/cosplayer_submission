import { createRouter, createWebHistory } from "vue-router";
import CosplayersView from "@/views/CosplayersView.vue";
import SubmitView from "@/views/SubmitView.vue";
import JuryView from "@/views/JuryView.vue";
import WinnersView from "@/views/WinnersView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/submit",
      name: "home",
      component: SubmitView,
    },
    {
      path: "/cosplayers",
      name: "cosplayers",
      component: CosplayersView,
    },
    {
      path: "/jury",
      name: "jury",
      component: JuryView,
    },
    {
      path: "/winners",
      name: "winners",
      component: WinnersView,
    },
  ],
});

export default router;
