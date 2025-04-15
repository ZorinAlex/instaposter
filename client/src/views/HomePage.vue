<template>
  <div class="home">
    <div class="page-header">
      <h2>Instagram Post Scheduler</h2>
      <p>Monitor and manage your Instagram post schedule</p>
    </div>
    
    <div class="stats-section" v-if="loaded">
      <div class="stat-card card">
        <h3>Pending Posts</h3>
        <div class="stat-value">{{ pendingCount }}</div>
      </div>
      <div class="stat-card card">
        <h3>Posted</h3>
        <div class="stat-value">{{ postedCount }}</div>
      </div>
      <div class="stat-card card">
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
          class="post-card card"
          @click="viewPostDetails(post._id)"
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
    
    <div v-else-if="loaded" class="empty-state card">
      <i class="fas fa-image empty-icon"></i>
      <h3>No posts yet</h3>
      <p>Create your first Instagram post to get started</p>
      <router-link to="/posts/new" class="create-post-btn">
        <i class="fas fa-plus"></i> Create New Post
      </router-link>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'HomePage',
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
      return this.posts.slice(0, 6);
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
    },
    viewPostDetails(id) {
      this.$router.push(`/posts/${id}/edit`);
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

.page-header {
  text-align: center;
  margin-bottom: 1rem;
}

.page-header p {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: var(--on-surface);
  opacity: 0.8;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  padding: 1.5rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: default;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--primary-light);
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
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
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
  font-weight: 500;
}

.post-date {
  color: var(--on-surface);
  opacity: 0.7;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  margin: 2rem auto;
  max-width: 500px;
}

.empty-icon {
  font-size: 4rem;
  color: var(--primary-light);
  opacity: 0.5;
  margin-bottom: 1rem;
}

.create-post-btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: var(--on-primary);
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.create-post-btn:hover {
  background-color: var(--primary-dark);
}

@media (max-width: 768px) {
  .stats-section {
    grid-template-columns: 1fr;
  }
}
</style> 