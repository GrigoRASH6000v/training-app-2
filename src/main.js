import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'tailwindcss/index.css';
import './assets/common.scss';
import './assets/el-ui.scss';
import router from './router';
import { Vue3Mq } from 'vue3-mq';

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(ElementPlus);

import { useStore } from '~/store';

const store = useStore();

// Подписка на изменения стора — автосохранение в localStorage
store.$subscribe((mutation, state) => {
  try {
    localStorage.setItem('state', JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state to localStorage:', e);
  }
});

app.use(Vue3Mq, {
  breakpoints: {
    sm: 767,
    smLk: 959,
    md: 1023,
    mdLk: 1263,
    lg: 'Infinity'
  }
});
app.mount('#app');
