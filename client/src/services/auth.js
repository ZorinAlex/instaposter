import axios from 'axios';

const API_URL = '/api/auth';

const authService = {
  login(username, password) {
    return axios.post(`${API_URL}/login`, { username, password })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  },

  logout() {
    localStorage.removeItem('user');
  },

  register(username, email, password) {
    return axios.post(`${API_URL}/register`, {
      username,
      email,
      password
    });
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken() {
    const user = this.getCurrentUser();
    return user?.access_token;
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  // Add token to Authorization header for authenticated requests
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      config => {
        const token = this.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }
};

// Setup axios interceptors when this module is imported
authService.setupAxiosInterceptors();

export default authService; 