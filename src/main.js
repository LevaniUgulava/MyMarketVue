import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import vue3GoogleLogin from "vue3-google-login";
import store from './store';
axios.defaults.baseURL = "http://192.168.0.101:8001/api/";

const app = createApp(App);

app.use(router);
app.use(store)
app.use(vue3GoogleLogin, {
  clientId:
    "868744132635-jqungrc7ie38a590q0opgrj03hc3v4sa.apps.googleusercontent.com",
});

app.mount("#app");
