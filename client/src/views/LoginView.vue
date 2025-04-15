<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>Instagram Post Scheduler</h1>
        <h2>Login</h2>
      </div>
      
      <div v-if="message" class="alert" :class="{'alert-error': error, 'alert-success': !error}">
        {{ message }}
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="user.username" 
            class="text-field"
            required
            autofocus
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="user.password" 
            class="text-field"
            required
          />
        </div>
        
        <div class="form-actions">
          <button type="submit" :disabled="loading" class="login-btn">
            <span v-if="loading">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import authService from '@/services/auth';

export default {
  name: 'LoginView',
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      loading: false,
      message: '',
      error: false
    };
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.message = '';
      this.error = false;
      
      // Form validation
      if (!this.user.username || !this.user.password) {
        this.message = 'Username and password are required.';
        this.error = true;
        this.loading = false;
        return;
      }
      
      authService.login(this.user.username, this.user.password)
        .then(
          () => {
            this.$router.push({ path: '/' });
          },
          error => {
            this.loading = false;
            const errorMessage = (error.response && error.response.data && error.response.data.message) || 
                                'Failed to login. Please check your credentials.';
            this.message = errorMessage;
            this.error = true;
          }
        );
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background);
}

.login-container {
  width: 100%;
  max-width: 400px;
  background-color: var(--surface);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 1.5rem;
  color: var(--primary-light);
  margin-bottom: 0.5rem;
}

.login-header h2 {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--on-surface);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: var(--on-surface);
}

.text-field {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--surface-2);
  color: var(--on-surface);
  font-size: 1rem;
}

.text-field:focus {
  border-color: var(--primary-color);
  outline: none;
}

.form-actions {
  margin-top: 1rem;
}

.login-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: var(--on-primary);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: var(--primary-dark);
}

.login-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.alert {
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.alert-error {
  background-color: var(--error);
  color: var(--on-error);
}

.alert-success {
  background-color: #43a047;
  color: white;
}

@media (max-width: 480px) {
  .login-container {
    border-radius: 0;
    max-width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style> 