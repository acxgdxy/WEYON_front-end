import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import "@icon-park/vue-next/styles/index.css";
import "highlight.js/styles/dark.css";


const pinia = createPinia()
const app = createApp(App);

app.use(router)
    .use(pinia)
    .mount("#app");
