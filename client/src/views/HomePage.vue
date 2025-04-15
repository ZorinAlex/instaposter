<template>
  <div class="home">
    <div class="welcome-section">
      <h2>Welcome to Instagram Post Scheduler</h2>
      <p>Manage and schedule your Instagram posts with ease</p>
      
      <div class="action-buttons">
        <router-link to="/calendar" class="btn">
          <i class="fas fa-calendar-alt"></i> Calendar View
        </router-link>
        <router-link to="/posts" class="btn">
          <i class="fas fa-list"></i> Posts List
        </router-link>
        <router-link to="/posts/new" class="btn btn-primary">
          <i class="fas fa-plus"></i> Create New Post
        </router-link>
      </div>
    </div>
    
    <!-- Test Component -->
    <TestComponent />
    
    <div class="stats-section" v-if="loaded">
      <div class="stat-card">
        <h3>Pending Posts</h3>
        <div class="stat-value">{{ pendingCount }}</div>
      </div>
      <div class="stat-card">
        <h3>Posted</h3>
        <div class="stat-value">{{ postedCount }}</div>
      </div>
      <div class="stat-card">
        <h3>Failed</h3>
        <div class="stat-value">{{ failedCount }}</div>
      </div>
    </div>
    
    <div v-if="latestPosts.length > 0" class="recent-posts">
      <h3>Recent Posts</h3>
      <div class="posts-grid">
        <div 
          v-for="post in latestPosts" 
          :key="post._id" 
          class="post-card"
        >
          <div class="post-image">
            <img :src="post.imageUrl" :alt="post.caption">
            <div class="post-status" :style="{ backgroundColor: getStatusColor(post.status) }">
              {{ post.status }}
            </div>
          </div>
          <div class="post-details">
            <p class="post-caption">{{ truncateText(post.caption, 50) }}</p>
            <p class="post-date">
              <i class="fas fa-clock"></i> 
              {{ formatPostDate(post.scheduledDate) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import TestComponent from '@/components/TestComponent.vue';

export default {
  name: 'HomePage',
  components: {
    TestComponent
  },
  data() {
    return {
      posts: [],
      loaded: false
    };
  },
  computed: {
    pendingCount() {
      return this.posts.filter(post => post.status === 'pending').length;
    },
    postedCount() {
      return this.posts.filter(post => post.status === 'posted').length;
    },
    failedCount() {
      return this.posts.filter(post => post.status === 'failed').length;
    },
    latestPosts() {
      return this.posts.slice(0, 3);
    }
  },
  methods: {
    fetchPosts() {
      api.getPosts()
        .then(response => {
          this.posts = response.data;
          this.loaded = true;
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
          this.loaded = true;
        });
    },
    truncateText(text, length) {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    },
    formatPostDate(dateString) {
      return api.formatPostDate(dateString);
    },
    getStatusColor(status) {
      return api.getStatusColor(status);
    }
  },
  created() {
    this.fetchPosts();
  }
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.welcome-section {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-section p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: #f0f0f0;
  color: #333;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.2s;
}

.btn i {
  margin-right: 0.5rem;
}

.btn:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

.btn-primary {
  background-color: #405de6;
  color: white;
}

.btn-primary:hover {
  background-color: #304aa6;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #405de6;
}

.recent-posts h3 {
  margin-bottom: 1rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.post-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-image {
  position: relative;
  height: 200px;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.post-details {
  padding: 1rem;
}

.post-caption {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.post-date {
  color: #666;
  font-size: 0.9rem;
}
</style> 