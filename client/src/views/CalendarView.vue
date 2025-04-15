<template>
  <div class="calendar-view">
    <div class="page-header">
      <h2>Schedule Calendar</h2>
      <router-link to="/posts/new" class="btn btn-primary">
        <i class="fas fa-plus"></i> New Post
      </router-link>
    </div>
    
    <div class="calendar-container">
      <v-calendar
        :attributes="calendarAttributes"
        :theme-styles="themeStyles"
        @dayclick="onDayClick"
        :min-date="new Date()"
      />
    </div>
    
    <div v-if="selectedDayPosts.length > 0" class="day-posts">
      <h3>Posts for {{ formatSelectedDate }}</h3>
      <div class="posts-list">
        <div v-for="post in selectedDayPosts" :key="post._id" class="post-item">
          <div class="post-image">
            <img :src="post.imageUrl" :alt="post.caption">
            <div class="post-status" :style="{ backgroundColor: getStatusColor(post.status) }">
              {{ post.status }}
            </div>
          </div>
          <div class="post-content">
            <p class="post-time">
              <i class="fas fa-clock"></i> {{ formatTime(post.scheduledDate) }}
            </p>
            <p class="post-caption">{{ post.caption }}</p>
          </div>
          <div class="post-actions">
            <router-link :to="`/posts/${post._id}/edit`" class="btn-icon">
              <i class="fas fa-edit"></i>
            </router-link>
            <button @click="deletePost(post)" class="btn-icon btn-delete">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="selectedDate" class="no-posts">
      <p>No posts scheduled for {{ formatSelectedDate }}</p>
      <router-link :to="{
        path: '/posts/new', 
        query: { date: selectedDate.toISOString() }
      }" class="btn">
        <i class="fas fa-plus"></i> Add Post for This Day
      </router-link>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { format, isSameDay } from 'date-fns';

export default {
  name: 'CalendarView',
  data() {
    return {
      posts: [],
      selectedDate: null,
      themeStyles: {
        wrapper: {
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        },
        dayContent: {
          height: '40px'
        }
      }
    };
  },
  computed: {
    calendarAttributes() {
      if (!this.posts.length) return [];
      
      // Group posts by date
      const postsByDate = this.posts.reduce((acc, post) => {
        const date = new Date(post.scheduledDate);
        const dateKey = date.toDateString();
        
        if (!acc[dateKey]) {
          acc[dateKey] = { date, posts: [] };
        }
        
        acc[dateKey].posts.push(post);
        return acc;
      }, {});
      
      // Create attributes for each date
      return Object.values(postsByDate).map(({ date, posts }) => {
        return {
          dot: {
            color: this.getDotColor(posts),
            class: 'post-dot'
          },
          dates: date,
          popover: {
            label: `${posts.length} post${posts.length > 1 ? 's' : ''} scheduled`
          }
        };
      });
    },
    selectedDayPosts() {
      if (!this.selectedDate) return [];
      
      return this.posts.filter(post => {
        const postDate = new Date(post.scheduledDate);
        return isSameDay(postDate, this.selectedDate);
      }).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
    },
    formatSelectedDate() {
      if (!this.selectedDate) return '';
      return format(this.selectedDate, 'MMMM d, yyyy');
    }
  },
  methods: {
    fetchPosts() {
      api.getPosts()
        .then(response => {
          this.posts = response.data;
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
        });
    },
    onDayClick(day) {
      this.selectedDate = day.date;
    },
    getDotColor(posts) {
      // If any post is failed, show red dot
      if (posts.some(post => post.status === 'failed')) {
        return '#e53935';
      }
      
      // If all posts are posted, show green dot
      if (posts.every(post => post.status === 'posted')) {
        return '#43a047';
      }
      
      // Otherwise, pending
      return '#f9a825';
    },
    getStatusColor(status) {
      return api.getStatusColor(status);
    },
    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    deletePost(post) {
      if (confirm(`Are you sure you want to delete this post?`)) {
        api.deletePost(post._id)
          .then(() => {
            this.fetchPosts();
          })
          .catch(error => {
            console.error('Error deleting post:', error);
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
.calendar-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-container {
  margin-bottom: 2rem;
}

.post-dot {
  height: 8px;
  width: 8px;
  border-radius: 50%;
}

.day-posts, .no-posts {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.post-item {
  display: flex;
  gap: 1rem;
  background-color: #f9f9f9;
  border-radius: 6px;
  overflow: hidden;
}

.post-image {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-status {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
}

.post-content {
  flex: 1;
  padding: 0.75rem 0;
  overflow: hidden;
}

.post-time {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.post-caption {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 1rem;
}

.btn-icon {
  background: none;
  border: none;
  color: #666;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #eee;
}

.btn-delete:hover {
  color: #e53935;
}

.no-posts {
  text-align: center;
  padding: 2rem;
}

.no-posts p {
  margin-bottom: 1rem;
  color: #666;
}
</style> 