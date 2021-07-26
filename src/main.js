import { createApp } from 'vue'
import App from './App.vue'
import {firestorePlugin} from 'vuefire'
import router from "./router";


const app = createApp(App);
app.use(router);
app.use(firestorePlugin);
app.mount('#app');
