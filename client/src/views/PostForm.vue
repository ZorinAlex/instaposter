<template>
  <div class="post-form">
    <div class="page-header">
      <h2>{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h2>
    </div>
    
    <div class="form-container">
      <div v-if="loading" class="loading-indicator">
        <p>{{ loadingMessage }}</p>
      </div>
      
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="goBack" class="btn">Go Back</button>
      </div>
      
      <form v-else @submit.prevent="submitForm" class="form">
        <div class="form-grid">
          <div class="form-left">
            <div class="form-group">
              <label for="caption">Caption *</label>
              <textarea 
                id="caption" 
                v-model="form.caption" 
                rows="4" 
                required
                placeholder="Write your Instagram caption here..."
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="scheduledDate">Scheduled Date and Time *</label>
              <input 
                type="datetime-local" 
                id="scheduledDate" 
                v-model="form.scheduledDate" 
                required
                :min="minDateTime"
              >
            </div>
            
            <div class="form-group" v-if="isEditing && form.status">
              <label for="status">Status</label>
              <select id="status" v-model="form.status">
                <option value="pending">Pending</option>
                <option value="posted">Posted</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          
          <div class="form-right">
            <div class="image-upload-container">
              <div class="upload-placeholder" v-if="!imagePreview && !form.imageUrl">
                <i class="fas fa-cloud-upload-alt fa-3x"></i>
                <p>Click or drag to upload an image</p>
                <span>JPG, PNG or GIF (Max 5MB)</span>
              </div>
              
              <div class="image-preview" v-else>
                <img :src="imagePreview || form.imageUrl" alt="Preview">
              </div>
              
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileChange" 
                accept="image/*" 
                :required="!isEditing"
              >
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="goBack" class="btn btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <i class="fas fa-spinner fa-spin" v-if="submitting"></i>
            {{ isEditing ? 'Update Post' : 'Create Post' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { format } from 'date-fns';

export default {
  name: 'PostForm',
  props: {
    id: String
  },
  data() {
    return {
      form: {
        caption: '',
        scheduledDate: this.getDefaultDate(),
        status: 'pending',
        imageUrl: ''
      },
      selectedFile: null,
      imagePreview: null,
      isEditing: false,
      loading: false,
      submitting: false,
      loadingMessage: '',
      error: null
    };
  },
  computed: {
    minDateTime() {
      // Format current date and time as required by datetime-local input
      const now = new Date();
      return format(now, "yyyy-MM-dd'T'HH:mm");
    }
  },
  methods: {
    getDefaultDate() {
      // Use date from query params if available, or current date + 1 hour
      if (this.$route.query.date) {
        return format(new Date(this.$route.query.date), "yyyy-MM-dd'T'HH:mm");
      }
      
      const date = new Date();
      date.setHours(date.getHours() + 1);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        this.$refs.fileInput.value = '';
        return;
      }
      
      this.selectedFile = file;
      this.createImagePreview(file);
    },
    createImagePreview(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    fetchPost() {
      if (!this.id) return;
      
      this.isEditing = true;
      this.loading = true;
      this.loadingMessage = 'Loading post details...';
      
      api.getPost(this.id)
        .then(response => {
          const post = response.data;
          
          // Format the date for the datetime-local input
          const scheduledDate = new Date(post.scheduledDate);
          post.scheduledDate = format(scheduledDate, "yyyy-MM-dd'T'HH:mm");
          
          this.form = post;
          this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching post:', error);
          this.error = 'Failed to load post. It may have been deleted or you have insufficient permissions.';
          this.loading = false;
        });
    },
    submitForm() {
      if (this.submitting) return;
      
      this.submitting = true;
      
      if (this.isEditing) {
        this.updatePost();
      } else {
        this.createPost();
      }
    },
    createPost() {
      const formData = new FormData();
      formData.append('caption', this.form.caption);
      formData.append('scheduledDate', new Date(this.form.scheduledDate).toISOString());
      formData.append('status', this.form.status);
      formData.append('image', this.selectedFile);
      
      api.createPost(formData)
        .then(response => {
          this.$router.push('/posts');
        })
        .catch(error => {
          console.error('Error creating post:', error);
          alert('Failed to create post. Please try again.');
          this.submitting = false;
        });
    },
    updatePost() {
      const formData = new FormData();
      formData.append('caption', this.form.caption);
      formData.append('scheduledDate', new Date(this.form.scheduledDate).toISOString());
      formData.append('status', this.form.status);
      
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      
      api.updatePost(this.id, formData)
        .then(response => {
          this.$router.push('/posts');
        })
        .catch(error => {
          console.error('Error updating post:', error);
          alert('Failed to update post. Please try again.');
          this.submitting = false;
        });
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    if (this.$route.query.date) {
      this.form.scheduledDate = this.getDefaultDate();
    }
    
    if (this.id) {
      this.fetchPost();
    }
  }
};
</script>

<style scoped>
.post-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.loading-indicator, .error-message {
  text-align: center;
  padding: 2rem 0;
}

.error-message {
  color: #e53935;
}

.error-message button {
  margin-top: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

input, textarea, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

textarea {
  resize: vertical;
}

.image-upload-container {
  position: relative;
  height: 300px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.image-upload-container:hover {
  border-color: #aaa;
}

.image-upload-container input[type="file"] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.upload-placeholder {
  text-align: center;
  color: #777;
}

.upload-placeholder i {
  margin-bottom: 1rem;
  color: #aaa;
}

.upload-placeholder span {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.image-preview {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #333;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-container {
    padding: 1.5rem;
  }
  
  .image-upload-container {
    height: 250px;
    margin-bottom: 1.5rem;
  }
}
</style> 