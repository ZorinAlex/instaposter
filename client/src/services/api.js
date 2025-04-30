import axios from 'axios';
import authService from './auth';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Add request interceptor to include authentication token
apiClient.interceptors.request.use(
  config => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, redirect to login
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  // Posts
  getPosts() {
    return apiClient.get('/posts');
  },
  
  getRandomCaption() {
    return apiClient.get('/posts/random-caption');
  },
  
  getPost(id) {
    return apiClient.get(`/posts/${id}`);
  },
  
  createPost(formData) {
    return apiClient.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  updatePost(id, data) {
    return apiClient.put(`/posts/${id}`, data);
  },
  
  deletePost(id) {
    return apiClient.delete(`/posts/${id}`);
  },
  
  getCaption(imageUrl) {
    return apiClient.get('/posts/caption', {
      params: { imageUrl }
    });
  },
  
  // Prompts
  getPrompts() {
    return apiClient.get('/prompts');
  },
  
  createPrompt(data) {
    return apiClient.post('/prompts', data);
  },
  
  updatePrompt(id, data) {
    return apiClient.put(`/prompts/${id}`, data);
  },
  
  deletePrompt(id) {
    return apiClient.delete(`/prompts/${id}`);
  },
  
  // Helper methods
  formatPostDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  getStatusColor(status) {
    const colors = {
      'pending': '#f9a825',
      'posted': '#43a047',
      'failed': '#e53935'
    };
    
    return colors[status] || '#9e9e9e';
  },
  
  // Auth
  login(data) {
    return apiClient.post('/auth/login', data).then(res => res.data);
  },

  register(data) {
    return apiClient.post('/auth/register', data).then(res => res.data);
  }
}; 