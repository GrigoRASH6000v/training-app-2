import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '~/views/Home';
import Exercises from '~/views/Exercises';
import Workouts from '~/views/Workouts';
import Diary from '~/views/Diary';
import Settings from '~/views/Settings';

const routes = [
  {
    path: '/',
    redirect: '/diary'
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
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
