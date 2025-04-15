<template>
  <div class="calendar-view">
    <div class="page-header">
      <h2>Post Calendar</h2>
      <div class="header-controls">
        <div class="navigation">
          <button @click="previousMonth" class="nav-btn"><i class="fas fa-chevron-left"></i></button>
          <h3>{{ currentMonthName }} {{ currentYear }}</h3>
          <button @click="nextMonth" class="nav-btn"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="view-controls">
          <button @click="viewMode = 'month'" :class="['view-btn', viewMode === 'month' ? 'active' : '']">Month</button>
          <button @click="viewMode = 'week'" :class="['view-btn', viewMode === 'week' ? 'active' : '']">Week</button>
          <button @click="viewMode = 'day'" :class="['view-btn', viewMode === 'day' ? 'active' : '']">Today</button>
        </div>
        <router-link to="/posts/new" class="btn btn-primary">
          <i class="fas fa-plus"></i> New Post
        </router-link>
      </div>
    </div>
    
    <div class="calendar-container">
      <div class="calendar-grid">
        <div class="weekday-headers">
          <div class="weekday-header">Mon</div>
          <div class="weekday-header">Tue</div>
          <div class="weekday-header">Wed</div>
          <div class="weekday-header">Thu</div>
          <div class="weekday-header">Fri</div>
          <div class="weekday-header">Sat</div>
          <div class="weekday-header">Sun</div>
        </div>
        
        <div class="calendar-days">
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
                :style="{ borderColor: getStatusColor(post.status) }"
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
import { format, isSameDay, startOfMonth, endOfMonth, addDays, 
         subDays, isSameMonth, eachDayOfInterval, startOfWeek, 
         endOfWeek, addMonths, subMonths } from 'date-fns';

export default {
  name: 'CalendarView',
  data() {
    return {
      posts: [],
      selectedDate: null,
      currentDate: new Date(),
      viewMode: 'month'
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
  gap: 1rem;
}

.nav-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  color: #555;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background-color: #f0f0f0;
}

.view-controls {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.view-btn {
  background-color: #f9f9f9;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn.active {
  background-color: #405de6;
  color: white;
}

.view-btn:not(:last-child) {
  border-right: 1px solid #ddd;
}

.calendar-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.weekday-headers {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.5rem;
}

.weekday-header {
  text-align: center;
  font-weight: bold;
  padding: 0.5rem;
  color: #666;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day {
  min-height: 120px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  border-color: #aaa;
  background-color: #f9f9f9;
}

.calendar-day.selected {
  border-color: #405de6;
  box-shadow: 0 0 0 1px #405de6;
}

.calendar-day.today {
  background-color: #f0f7ff;
}

.other-month {
  opacity: 0.5;
}

.day-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.day-number {
  font-weight: bold;
}

.today .day-number {
  color: #405de6;
}

.post-count {
  font-size: 0.8rem;
  background-color: #405de6;
  color: white;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
}

.day-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
}

.post-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  border-left: 3px solid;
  font-size: 0.8rem;
}

.post-preview-image {
  width: 25px;
  height: 25px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.post-preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-preview-time {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
}

.more-posts {
  font-size: 0.75rem;
  color: #666;
  text-align: center;
  padding: 0.25rem;
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

@media (max-width: 768px) {
  .calendar-days {
    gap: 0.25rem;
  }
  
  .calendar-day {
    min-height: 80px;
    padding: 0.25rem;
  }
  
  .weekday-header {
    font-size: 0.8rem;
    padding: 0.25rem;
  }
  
  .post-preview-image {
    width: 20px;
    height: 20px;
  }
  
  .post-item {
    flex-direction: column;
  }
  
  .post-image {
    width: 100%;
    height: 150px;
  }
  
  .post-actions {
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
  }
}
</style> 