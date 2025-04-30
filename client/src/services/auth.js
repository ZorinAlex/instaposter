import api from './api';

const authService = {
  login(username, password) {
    return api.login({ username, password })
      .then(response => {
        if (response.access_token) {
          localStorage.setItem('user', JSON.stringify(response));
        }
        return response;
      });
  },

  logout() {
    localStorage.removeItem('user');
  },

  register(username, email, password) {
    return api.register({
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
  }
};

export default authService; 