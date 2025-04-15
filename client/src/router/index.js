import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/CalendarView.vue')
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import('../views/PostsView.vue')
  },
  {
    path: '/posts/new',
    name: 'NewPost',
    component: () => import('../views/PostForm.vue')
  },
  {
    path: '/posts/:id/edit',
    name: 'EditPost',
    component: () => import('../views/PostForm.vue'),
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 