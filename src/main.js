import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'normalize.css';
import './style.css';
import router from './router';
import store from './store';
import { Vue3Mq } from 'vue3-mq';

store.subscribe((mutation, state) => {
  if (state) {
    localStorage.setItem('state', JSON.stringify(state))
  }
});

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(Vue3Mq, {
    breakpoints: {
      sm: 767,
      smLk: 959,
      md: 1023,
      mdLk: 1263,
      lg: 'Infinity'
    }
  })
  .mount('#app');
