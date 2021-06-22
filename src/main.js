import { createApp } from 'vue'
import App from './App.vue'
import {firestorePlugin} from 'vuefire'


const app = createApp(App);
app.use(firestorePlugin);
app.mount('#app');
