import { Api, type Cosplayer } from "@/api";
import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export const useCosplayerStore = defineStore("cosplayer", () => {
  const cosplayers: Ref<Cosplayer[]> = ref([]);

  Api.getCosplayers().then((v) => cosplayers.value = v);

  return { cosplayers };
});
