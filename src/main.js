import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import axios from "axios";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import vue3GoogleLogin from "vue3-google-login";
import { createI18n } from "vue-i18n";
import en from "./locales/en";
import ka from "./locales/ka";
axios.defaults.baseURL = "http://192.168.0.103:8001/api/";

const app = createApp(App);

const i18n = createI18n({
  locale: "ka",
  fallbackLocale: "ka",
  messages: {
    en,
    ka,
  },
});

app.use(i18n);
app.use(router);
app.use(PrimeVue);
app.use(vue3GoogleLogin, {
  clientId:
    "868744132635-jqungrc7ie38a590q0opgrj03hc3v4sa.apps.googleusercontent.com",
});

app.mount("#app");
