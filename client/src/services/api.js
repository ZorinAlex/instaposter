import axios from 'axios';
import authService from './auth';

const apiClient = axios.create({
  baseURL: '/api',
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
  }
}; 