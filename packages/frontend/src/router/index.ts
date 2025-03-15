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
      redirect: { name: "submit" },
    },
    {
      path: "/submit/:order?",
      name: "submit",
      props: true,
      component: SubmitView,
    },
    {
      path: "/cosplayers/all",
      name: "all_cosplayers",
      component: CosplayersView,
      props: {
        all: true,
      },
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
