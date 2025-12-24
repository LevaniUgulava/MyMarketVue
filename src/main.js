import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vue3GoogleLogin from "vue3-google-login";
import store from './store';
import { createHead } from "@vueuse/head";
import Pusher from "pusher-js";
import Echo from "laravel-echo";

let usertoken =localStorage.getItem('token');
let guest_token = localStorage.getItem('guest_token')
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'local', 
    wsHost: window.location.hostname, 
    wsPort: 6001,
    forceTLS: false,
    cluster: 'mt1',
    disableStats: true,
    encrypted: false,
    authEndpoint: 'http://127.0.0.1:8000/broadcasting/auth',
    auth: {
        headers: usertoken ?  {
            Authorization: `Bearer ${usertoken}`,
        } : {},
         params: guest_token  && !usertoken ? {
            guest_uuid: guest_token 
        } : {}
    },
});

const app = createApp(App);
app.use(createHead());

app.use(router);
app.use(store);
app.use(vue3GoogleLogin, {
  clientId:
    "868744132635-jqungrc7ie38a590q0opgrj03hc3v4sa.apps.googleusercontent.com",
});

app.mount("#app");
