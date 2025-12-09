import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'tailwindcss/index.css';
import './style.css';
import router from './router';
import store from './store';
import { Vue3Mq } from 'vue3-mq';

store.subscribe((mutation, state) => {
  if (state) {
    const excludedKeys = [];
    const filteredState = Object.keys(state).reduce((acc, key) => {
      if (!excludedKeys.includes(key)) {
        acc[key] = state[key]
      }
      return acc;
    }, {})
    localStorage.setItem('state', JSON.stringify(filteredState))
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
