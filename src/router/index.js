import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '~/views/Home';
import Exercises from '~/views/Exercises';
import Workouts from '~/views/Workouts';
import Diary from '~/views/Diary';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/exercises',
    name: 'exercises',
    component: Exercises
  },
  {
    path: '/workouts',
    name: 'workouts',
    component: Workouts
  },
  {
    path: '/diary',
    name: 'diary',
    component: Diary
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
