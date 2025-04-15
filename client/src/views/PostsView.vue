<template>
  <div class="posts-view">
    <div class="page-header">
      <h2>All Posts</h2>
      <div class="header-actions">
        <div class="filter-container">
          <select v-model="statusFilter" class="status-filter">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="posted">Posted</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <router-link to="/posts/new" class="create-btn">
          <i class="fas fa-plus"></i> New Post
        </router-link>
      </div>
    </div>
    
    <div class="loading-indicator card" v-if="loading">
      <div class="loading-spinner"></div>
      <p>Loading posts...</p>
    </div>
    
    <div class="error-message card" v-else-if="error">
      <i class="fas fa-exclamation-circle"></i>
      <p>{{ error }}</p>
      <button @click="fetchPosts" class="retry-btn">
        <i class="fas fa-sync"></i> Retry
      </button>
    </div>
    
    <div class="post-list" v-else-if="filteredPosts.length > 0">
      <div class="post-item card" v-for="post in filteredPosts" :key="post._id">
        <div class="post-image">
          <img :src="post.imageUrl" :alt="post.caption">
          <div class="post-status" :style="{ backgroundColor: getStatusColor(post.status) }">
            {{ post.status }}
          </div>
        </div>
        <div class="post-details">
          <p class="post-date">
            <i class="fas fa-calendar-alt"></i> {{ formatDate(post.scheduledDate) }}
          </p>
          <p class="post-caption">{{ post.caption }}</p>
          <div class="post-meta" v-if="post.postedAt">
            <span class="posted-info">
              <i class="fas fa-check-circle"></i> Posted at {{ formatDate(post.postedAt) }}
            </span>
          </div>
          <div class="post-meta" v-if="post.instagramMediaId">
            <span class="instagram-info">
              <i class="fab fa-instagram"></i> Instagram ID: {{ post.instagramMediaId }}
            </span>
          </div>
        </div>
        <div class="post-actions">
          <router-link :to="`/posts/${post._id}/edit`" class="action-btn edit-btn">
            <i class="fas fa-edit"></i> Edit
          </router-link>
          <button @click="deletePost(post)" class="action-btn delete-btn">
            <i class="fas fa-trash-alt"></i> Delete
          </button>
        </div>
      </div>
    </div>
    
    <div class="empty-state card" v-else>
      <div class="empty-state-content">
        <i class="fas fa-inbox fa-3x"></i>
        <h3>No posts found</h3>
        <p v-if="statusFilter !== 'all'">
          There are no posts with "{{ statusFilter }}" status.
        </p>
        <p v-else>
          You haven't created any posts yet.
        </p>
        <router-link to="/posts/new" class="create-btn">
          <i class="fas fa-plus"></i> Create Your First Post
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'PostsView',
  data() {
    return {
      posts: [],
      loading: true,
      error: null,
      statusFilter: 'all'
    };
  },
  computed: {
    filteredPosts() {
      if (this.statusFilter === 'all') {
        return this.posts;
      }
      
      return this.posts.filter(post => post.status === this.statusFilter);
    }
  },
  methods: {
    fetchPosts() {
      this.loading = true;
      this.error = null;
      
      api.getPosts()
        .then(response => {
          this.posts = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
          this.error = 'Failed to load posts. Please try again.';
          this.loading = false;
        });
    },
    formatDate(dateString) {
      return api.formatPostDate(dateString);
    },
    getStatusColor(status) {
      return api.getStatusColor(status);
    },
    deletePost(post) {
      if (confirm(`Are you sure you want to delete this post with caption "${post.caption}"?`)) {
        api.deletePost(post._id)
          .then(() => {
            this.fetchPosts();
          })
          .catch(error => {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
          });
      }
    }
  },
  created() {
    this.fetchPosts();
  }
};
</script>

<style scoped>
.posts-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-container {
  display: flex;
  align-items: center;
}

.status-filter {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: var(--surface-2);
  color: var(--on-surface);
  transition: border-color 0.2s;
}

.status-filter:focus {
  border-color: var(--primary-color);
  outline: none;
}

.loading-indicator, .error-message {
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  color: var(--error);
}

.error-message i {
  font-size: 2rem;
}

.retry-btn {
  margin-top: 1rem;
  background-color: var(--surface-2);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: var(--surface-3);
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  display: flex;
  overflow: hidden;
  transition: transform 0.2s;
}

.post-item:hover {
  transform: translateY(-3px);
}

.post-image {
  position: relative;
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-status {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.post-details {
  flex: 1;
  padding: 1rem;
  border-right: 1px solid var(--border-color);
}

.post-date {
  color: var(--on-surface);
  opacity: 0.7;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.post-caption {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.post-meta {
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.posted-info {
  color: #43a047;
}

.instagram-info {
  color: #405de6;
}

.post-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  width: 120px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
  border: none;
}

.edit-btn {
  background-color: var(--surface-3);
  color: var(--on-surface);
}

.edit-btn:hover {
  background-color: var(--primary-light);
  color: var(--on-primary);
}

.delete-btn {
  background-color: var(--surface-3);
  color: var(--on-surface);
}

.delete-btn:hover {
  background-color: var(--error);
  color: white;
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
  border: none;
  cursor: pointer;
}

.create-btn:hover {
  background-color: var(--primary-dark);
}

.empty-state {
  padding: 3rem;
}

.empty-state-content {
  text-align: center;
  color: var(--on-surface);
  opacity: 0.7;
}

.empty-state-content i {
  margin-bottom: 1rem;
  color: var(--primary-light);
  opacity: 0.5;
}

.empty-state-content h3 {
  margin-bottom: 0.5rem;
  color: var(--on-surface);
}

.empty-state-content p {
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .post-item {
    flex-direction: column;
  }
  
  .post-image {
    width: 100%;
    height: 200px;
  }
  
  .post-details {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .post-actions {
    flex-direction: row;
    width: 100%;
    padding: 0.75rem;
  }
  
  .action-btn {
    flex: 1;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-container {
    width: 100%;
  }
  
  .status-filter {
    width: 100%;
  }
  
  .create-btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 