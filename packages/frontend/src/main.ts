import "./assets/main.css";
import "@mdi/font/css/materialdesignicons.css";
import "@catppuccin/palette/css/catppuccin.css";

import { flavors } from "@catppuccin/palette";
const { frappe: { colors } } = flavors;

import { createApp } from "vue";
import { createPinia } from "pinia";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import { VNumberInput } from "vuetify/labs/VNumberInput";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(createVuetify({
  components: {
    VNumberInput,
    ...components,
  },
  directives,
  theme: {
    defaultTheme: "catppuccin",
    themes: {
      catppuccin: {
        dark: true,
        colors: {
          background: colors.base.hex,
          surface: colors.surface0.hex,
          primary: colors.mauve.hex,
          "primary-darken-1": colors.pink.hex,
          secondary: colors.flamingo.hex,
          "secondary-darken-1": colors.rosewater.hex,
          error: colors.red.hex,
          info: colors.sky.hex,
          success: colors.green.hex,
          warning: colors.peach.hex,
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
}));
app.use(router);

app.mount("#app");
