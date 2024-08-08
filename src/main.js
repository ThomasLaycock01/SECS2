import './assets/main.css'
import {createPinia} from "pinia";

import { createApp } from 'vue'
import App from './App.vue'

import Buefy from 'buefy';
import "buefy/dist/buefy.min.css";

import VueClickAwayPlugin from 'vue3-click-away';

const pinia = createPinia();

createApp(App).use(pinia).use(Buefy).use(VueClickAwayPlugin).mount('#app')
