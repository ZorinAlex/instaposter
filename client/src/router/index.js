import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { 
      public: true  // Public route, no auth needed
    }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: { 
      requiresAuth: true  // Protected route
    }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('../views/CalendarView.vue'),
    meta: { 
      requiresAuth: true  // Protected route
    }
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import('../views/PostsView.vue'),
    meta: { 
      requiresAuth: true  // Protected route
    }
  },
  {
    path: '/posts/new',
    name: 'NewPost',
    component: () => import('../views/PostForm.vue'),
    meta: { 
      requiresAuth: true  // Protected route
    }
  },
  {
    path: '/posts/:id/edit',
    name: 'EditPost',
    component: () => import('../views/PostForm.vue'),
    props: true,
    meta: { 
      requiresAuth: true  // Protected route
    }
  },
  {
    path: '/prompts',
    name: 'Prompts',
    component: () => import('../views/PromptsView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for auth
router.beforeEach((to, from, next) => {
  const isLoggedIn = authService.isLoggedIn();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isPublic = to.matched.some(record => record.meta.public);

  if (requiresAuth && !isLoggedIn) {
    // If route requires auth and user is not logged in, redirect to login
    next('/login');
  } else if (isLoggedIn && to.path === '/login') {
    // If user is already logged in and tries to access login page, redirect to home
    next('/');
  } else {
    // Otherwise proceed normally
    next();
  }
});

export default router; 