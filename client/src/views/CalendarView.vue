<template>
  <div class="calendar-view">
    <div class="page-header">
      <h2>Post Calendar</h2>
      <div class="header-controls">
        <div class="navigation">
          <button @click="previousMonth" class="nav-btn"><i class="fas fa-chevron-left"></i></button>
          <div class="month-display">{{ currentMonthName }} {{ currentYear }}</div>
          <button @click="nextMonth" class="nav-btn"><i class="fas fa-chevron-right"></i></button>
        </div>
        <router-link to="/posts/new" class="create-btn">
          <i class="fas fa-plus"></i> New Post
        </router-link>
      </div>
    </div>
    
    <div class="calendar-container card">
      <div class="weekday-headers">
        <div class="weekday-header">Mon</div>
        <div class="weekday-header">Tue</div>
        <div class="weekday-header">Wed</div>
        <div class="weekday-header">Thu</div>
        <div class="weekday-header">Fri</div>
        <div class="weekday-header">Sat</div>
        <div class="weekday-header">Sun</div>
      </div>
      
      <div class="calendar-grid">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index" 
          :class="['calendar-day', 
            !day.isCurrentMonth ? 'other-month' : '',
            day.isToday ? 'today' : '',
            day.date.getTime() === selectedDate?.getTime() ? 'selected' : ''
          ]"
          @click="selectDay(day.date)"
        >
          <div class="day-header">
            <span class="day-number">{{ day.date.getDate() }}</span>
            <span v-if="day.posts.length > 0" class="post-count">{{ day.posts.length }}</span>
          </div>
          
          <div class="day-content">
            <div 
              v-for="post in day.posts.slice(0, 2)" 
              :key="post._id" 
              class="post-preview"
              :style="{ borderLeftColor: getStatusColor(post.status) }"
              @click.stop="viewPostDetails(post._id)"
            >
              <div class="post-preview-image">
                <img :src="post.imageUrl" :alt="post.caption">
              </div>
              <div class="post-preview-time">{{ formatTime(post.scheduledDate) }}</div>
            </div>
            
            <div v-if="day.posts.length > 2" class="more-posts">
              +{{ day.posts.length - 2 }} more
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="selectedDayPosts.length > 0" class="day-posts card">
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
    
    <div v-else-if="selectedDate" class="no-posts card">
      <p>No posts scheduled for {{ formatSelectedDate }}</p>
      <router-link :to="{
        path: '/posts/new', 
        query: { date: selectedDate.toISOString() }
      }" class="create-btn">
        <i class="fas fa-plus"></i> Add Post for This Day
      </router-link>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { format, isSameDay, startOfMonth, endOfMonth, 
         isSameMonth, eachDayOfInterval, startOfWeek, 
         endOfWeek, addMonths, subMonths } from 'date-fns';

export default {
  name: 'CalendarView',
  data() {
    return {
      posts: [],
      selectedDate: null,
      currentDate: new Date()
    };
  },
  computed: {
    currentMonthName() {
      return format(this.currentDate, 'MMMM');
    },
    currentYear() {
      return format(this.currentDate, 'yyyy');
    },
    calendarDays() {
      // Get all days for the current month view
      const monthStart = startOfMonth(this.currentDate);
      const monthEnd = endOfMonth(this.currentDate);
      const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
      const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 }); // End on Sunday
      
      const daysInView = eachDayOfInterval({ start: startDate, end: endDate });
      
      return daysInView.map(date => {
        const dayPosts = this.posts.filter(post => {
          const postDate = new Date(post.scheduledDate);
          return isSameDay(date, postDate);
        });
        
        return {
          date,
          isCurrentMonth: isSameMonth(date, this.currentDate),
          isToday: isSameDay(date, new Date()),
          posts: dayPosts
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
    selectDay(date) {
      this.selectedDate = date;
    },
    previousMonth() {
      this.currentDate = subMonths(this.currentDate, 1);
    },
    nextMonth() {
      this.currentDate = addMonths(this.currentDate, 1);
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
            if (this.selectedDayPosts.length <= 1) {
              this.selectedDate = null;
            }
          })
          .catch(error => {
            console.error('Error deleting post:', error);
          });
      }
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
.calendar-view {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.month-display {
  font-size: 1.2rem;
  font-weight: 500;
  min-width: 180px;
  text-align: center;
}

.nav-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  color: var(--on-surface);
  border-radius: 50%;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.calendar-container {
  padding: 1rem;
  margin-bottom: 1rem;
}

.weekday-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekday-header {
  text-align: center;
  padding: 0.5rem;
  font-weight: 500;
  color: var(--on-surface);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  min-height: 120px;
  background-color: var(--surface-2);
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.calendar-day:hover {
  background-color: var(--surface-3);
  transform: translateY(-2px);
}

.calendar-day.selected {
  border: 2px solid var(--primary-color);
}

.calendar-day.other-month {
  opacity: 0.6;
  background-color: var(--surface);
}

.calendar-day.today .day-number {
  background-color: var(--primary-color);
  color: var(--on-primary);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.1);
}

.day-number {
  font-weight: 500;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.post-count {
  background-color: var(--primary-light);
  color: var(--on-primary);
  border-radius: 12px;
  padding: 0.1rem 0.5rem;
  font-size: 0.75rem;
  font-weight: bold;
}

.day-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  overflow-y: auto;
  margin-top: 0.25rem;
}

.post-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--surface);
  border-radius: 4px;
  border-left: 3px solid;
  font-size: 0.8rem;
  transition: transform 0.15s;
  cursor: pointer;
  width: 100%;
}

.post-preview:hover {
  transform: translateX(3px);
}

.post-preview-image {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-preview-time {
  font-size: 0.7rem;
  color: var(--on-surface);
  opacity: 0.8;
  margin-left: auto;
}

.more-posts {
  text-align: center;
  font-size: 0.7rem;
  color: var(--primary-light);
  padding: 0.25rem;
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

.day-posts, .no-posts {
  padding: 1.5rem;
}

.day-posts h3 {
  margin-bottom: 1rem;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  display: flex;
  gap: 1rem;
  background-color: var(--surface-2);
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
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
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
  font-size: 0.8rem;
  color: var(--on-surface);
  opacity: 0.8;
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
  color: var(--on-surface);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-delete:hover {
  color: var(--error);
}

.no-posts {
  text-align: center;
  padding: 2rem;
}

.no-posts p {
  margin-bottom: 1.5rem;
  color: var(--on-surface);
  opacity: 0.8;
}

@media (max-width: 768px) {
  .calendar-grid {
    grid-template-columns: 1fr;
  }
  
  .weekday-headers {
    display: none;
  }
  
  .calendar-day {
    min-height: auto;
    margin-bottom: 8px;
  }
  
  .day-header {
    padding: 0.75rem;
  }
  
  .day-content {
    max-height: none;
  }
  
  .header-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .navigation {
    justify-content: space-between;
  }
  
  .create-btn {
    text-align: center;
  }
  
  .month-display {
    min-width: 140px;
    font-size: 1rem;
  }
}
</style> 