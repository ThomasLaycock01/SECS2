import './assets/main.css'
import {createPinia} from "pinia";

import { createApp } from 'vue'
import App from './App.vue'

import Buefy from 'buefy';
import "buefy/dist/buefy.min.css";

const pinia = createPinia();

createApp(App).use(pinia).use(Buefy).mount('#app')
