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
        <router-link to="/posts/new" class="btn btn-primary">
          <i class="fas fa-plus"></i> New Post
        </router-link>
      </div>
    </div>
    
    <div class="loading-indicator" v-if="loading">
      <p>Loading posts...</p>
    </div>
    
    <div class="error-message" v-else-if="error">
      <p>{{ error }}</p>
    </div>
    
    <div class="post-list" v-else-if="filteredPosts.length > 0">
      <div class="post-item" v-for="post in filteredPosts" :key="post._id">
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
          <router-link :to="`/posts/${post._id}/edit`" class="btn btn-edit">
            <i class="fas fa-edit"></i> Edit
          </router-link>
          <button @click="deletePost(post)" class="btn btn-delete">
            <i class="fas fa-trash-alt"></i> Delete
          </button>
        </div>
      </div>
    </div>
    
    <div class="empty-state" v-else>
      <div class="empty-state-content">
        <i class="fas fa-inbox fa-3x"></i>
        <h3>No posts found</h3>
        <p v-if="statusFilter !== 'all'">
          There are no posts with "{{ statusFilter }}" status.
        </p>
        <p v-else>
          You haven't created any posts yet.
        </p>
        <router-link to="/posts/new" class="btn btn-primary">
          Create Your First Post
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
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.loading-indicator, .error-message {
  background-color: white;
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: #e53935;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  border-right: 1px solid #eee;
}

.post-date {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.post-caption {
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.post-meta {
  font-size: 0.85rem;
  color: #777;
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

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
}

.empty-state-content {
  text-align: center;
  color: #777;
}

.empty-state-content i {
  margin-bottom: 1rem;
  color: #ccc;
}

.empty-state-content h3 {
  margin-bottom: 0.5rem;
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
  
  .post-actions {
    flex-direction: row;
    width: 100%;
    padding: 0.75rem;
  }
}
</style> 