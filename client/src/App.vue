<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Instagram Post Scheduler</h1>
      <div class="header-actions" v-if="isLoggedIn">
        <router-link to="/" class="nav-link" exact>
          <i class="fas fa-home"></i> Home
        </router-link>
        <router-link to="/calendar" class="nav-link">
          <i class="fas fa-calendar-alt"></i> Calendar
        </router-link>
        <router-link to="/posts" class="nav-link">
          <i class="fas fa-list"></i> Posts
        </router-link>
        <router-link to="/posts/new" class="create-btn">
          <i class="fas fa-plus"></i> New Post
        </router-link>
        <button @click="logout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>© {{ new Date().getFullYear() }} Instagram Post Scheduler</p>
    </footer>
  </div>
</template>

<script>
import authService from '@/services/auth';

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false
    };
  },
  methods: {
    logout() {
      authService.logout();
      this.$router.push('/login');
      this.isLoggedIn = false;
    },
    updateLoginStatus() {
      this.isLoggedIn = authService.isLoggedIn();
    }
  },
  created() {
    this.updateLoginStatus();
    // Listen for route changes to update login status
    this.$router.beforeEach((to, from, next) => {
      this.updateLoginStatus();
      next();
    });
  }
}
</script>

<style>
:root {
  --primary-color: #6200ee;
  --primary-dark: #3700b3;
  --primary-light: #bb86fc;
  --secondary-color: #03dac6;
  --background: #121212;
  --surface: #1e1e1e;
  --surface-2: #2d2d2d;
  --error: #cf6679;
  --on-primary: #ffffff;
  --on-secondary: #000000;
  --on-background: #e1e1e1;
  --on-surface: #e1e1e1;
  --on-error: #000000;
  --border-color: #333333;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', Arial, sans-serif;
  line-height: 1.6;
  color: var(--on-background);
  background-color: var(--background);
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: var(--surface);
  color: var(--on-surface);
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.app-header h1 {
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
  color: var(--primary-light);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  color: var(--on-surface);
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover, .nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--primary-light);
}

.create-btn {
  background-color: var(--primary-color);
  color: var(--on-primary);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.create-btn:hover {
  background-color: var(--primary-dark);
}

.logout-btn {
  background-color: transparent;
  color: var(--on-surface);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-left: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--error);
  border-color: var(--error);
}

main {
  flex: 1;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

footer {
  background-color: var(--surface);
  padding: 0.75rem;
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

h1, h2, h3 {
  margin-bottom: 1rem;
  color: var(--on-surface);
}

button {
  cursor: pointer;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: var(--on-primary);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.2s;
}

button:hover {
  background-color: var(--primary-dark);
}

button:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.btn-delete {
  background-color: var(--error);
  color: var(--on-error);
}

.btn-delete:hover {
  background-color: #b0516a;
}

.btn-edit {
  background-color: var(--secondary-color);
  color: var(--on-secondary);
}

.btn-edit:hover {
  background-color: #02b8a6;
}

/* Material design card style */
.card {
  background-color: var(--surface);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  margin-bottom: 1rem;
}

/* Material design text field */
.text-field {
  background-color: var(--surface-2);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.75rem;
  color: var(--on-surface);
  width: 100%;
}

.text-field:focus {
  border-color: var(--primary-color);
  outline: none;
}

/* Material design form label */
.form-label {
  color: var(--on-surface);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.75rem;
  }
  
  .header-actions {
    margin-top: 0.5rem;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  main {
    padding: 1rem;
  }
}
</style> 