<template>
  <div class="post-form">
    <div class="page-header">
      <h2>{{ isEditing ? 'Edit Post' : 'Create New Post' }}</h2>
      <div class="header-actions">
        <button @click="goBack" class="secondary-btn">
          <i class="fas fa-arrow-left"></i> Back
        </button>
      </div>
    </div>
    
    <div class="form-container card">
      <div v-if="loading" class="loading-indicator">
        <div class="loading-spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>
      
      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
        <button @click="goBack" class="secondary-btn">
          <i class="fas fa-arrow-left"></i> Go Back
        </button>
      </div>
      
      <form v-else @submit.prevent="submitForm" class="form">
        <div class="form-grid">
          <div class="form-left">
            <div class="form-group">
              <label for="caption">Caption</label>
              <div class="caption-container">
                <textarea 
                  id="caption" 
                  v-model="form.caption" 
                  rows="4" 
                  placeholder="Write your Instagram caption here..."
                  class="text-field"
                ></textarea>
                <div class="caption-actions">
                  <button 
                    type="button" 
                    @click="generateCaption" 
                    class="caption-btn ai-caption-btn"
                    title="Generate caption"
                  >
                    <i class="fas fa-magic"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="scheduledDate">Scheduled Date and Time *</label>
              <input 
                type="datetime-local" 
                id="scheduledDate" 
                v-model="form.scheduledDate" 
                required
                :min="minDateTime"
                class="text-field"
              >
            </div>
            
            <div class="form-group" v-if="isEditing && form.status">
              <label for="status">Status</label>
              <select id="status" v-model="form.status" class="text-field">
                <option value="pending">Pending</option>
                <option value="posted">Posted</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          
          <div class="form-right">
            <div class="image-upload-container">
              <template v-if="canReplaceImage">
                <div v-if="!rawImageData && !imagePreview">
                  <div v-if="isEditing && form.imageUrl" class="image-preview-existing">
                    <img :src="form.imageUrl" alt="Current post image" />
                    <label class="custom-file-upload replace-button">
                      <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*">
                      <span><i class="fas fa-sync-alt"></i> Replace Image</span>
                    </label>
                  </div>
                  <div v-else class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt fa-3x"></i>
                    <p>Click or drag to upload an image</p>
                    <span>JPG, PNG or GIF (Max 5MB)</span>
                    <label class="custom-file-upload">
                      <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" :required="!isEditing">
                      <span><i class="fas fa-upload"></i> Choose Image</span>
                    </label>
                  </div>
                </div>
                <div v-else-if="rawImageData && showCropper" class="cropper-area">
                  <div class="aspect-ratio-selector custom-select-group align-right">
                    <select
                      id="aspect-ratio"
                      v-model="selectedAspectRatio"
                      class="custom-select flat-select"
                    >
                      <option v-for="option in aspectRatioOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <div class="cropper-box">
                    <vue-cropper
                      :key="selectedAspectRatio"
                      ref="cropper"
                      :src="rawImageData"
                      :aspect-ratio="aspectRatio"
                      :view-mode="1"
                      :auto-crop-area="1"
                      :background="false"
                      :responsive="true"
                      :check-cross-origin="false"
                      style="width: 100%; height: 100%; display: block;"
                    />
                  </div>
                  <div class="cropper-actions">
                    <button type="button" class="secondary-btn" @click="resetImage">Remove</button>
                    <button type="button" class="create-btn" @click="cropImage">Crop & Use</button>
                  </div>
                </div>
                <div v-else-if="imagePreview">
                  <div class="image-preview">
                    <img :src="imagePreview" alt="Preview">
                  </div>
                  <div class="cropper-actions">
                    <button type="button" class="secondary-btn" @click="resetImage">Remove</button>
                  </div>
                </div>
              </template>
              <template v-else>
                <div v-if="form.imageUrl" class="image-preview">
                  <img :src="form.imageUrl" alt="Post image" />
                </div>
                <div v-else class="upload-placeholder">
                  <i class="fas fa-image fa-3x"></i>
                  <p>No image for this post</p>
                </div>
              </template>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button
            v-if="isEditing"
            type="button"
            @click="confirmDeletePost"
            class="delete-btn"
          >
            <i class="fas fa-trash-alt"></i> Delete Post
          </button>
          <button type="button" @click="goBack" class="secondary-btn">
            Cancel
          </button>
          <button type="submit" class="create-btn" :disabled="submitting">
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
import VueCropper from 'vue-cropperjs';
import '@/assets/cropper.css';

export default {
  name: 'PostForm',
  components: { 'vue-cropper': VueCropper },
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
      rawImageData: null,
      imagePreview: null,
      isEditing: false,
      loading: false,
      submitting: false,
      loadingMessage: '',
      error: null,
      showCropper: false,
      selectedAspectRatio: '1',
      aspectRatioOptions: [
        { label: 'Square (1:1)', value: '1' },
        { label: 'Portrait (4:5)', value: '0.8' },
        { label: 'Landscape (1.91:1)', value: '1.91' }
      ]
    };
  },
  computed: {
    minDateTime() {
      const now = new Date();
      return format(now, "yyyy-MM-dd'T'HH:mm");
    },
    aspectRatio() {
      return parseFloat(this.selectedAspectRatio);
    },
    canReplaceImage() {
      return !this.isEditing || (this.isEditing && this.form.status === 'pending');
    }
  },
  methods: {
    getDefaultDate() {
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
      this.rawImageData = URL.createObjectURL(file);
      this.showCropper = true;
      this.imagePreview = null;
    },
    cropImage() {
      if (!this.$refs.cropper) return;
      const canvas = this.$refs.cropper.getCroppedCanvas({
        fillColor: '#fff',
        imageSmoothingQuality: 'high'
      });
      if (canvas) {
        this.imagePreview = canvas.toDataURL('image/jpeg');
        // Convert dataURL to Blob for upload
        canvas.toBlob(blob => {
          this.selectedFile = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
        }, 'image/jpeg', 0.95);
        this.showCropper = false;
      }
    },
    resetImage() {
      this.selectedFile = null;
      this.rawImageData = null;
      this.imagePreview = null;
      this.showCropper = false;
      if (this.$refs.fileInput) this.$refs.fileInput.value = '';
    },
    createImagePreview(file) {
      // Not used anymore, handled by cropper
    },
    fetchPost() {
      if (!this.id) return;
      this.isEditing = true;
      this.loading = true;
      this.loadingMessage = 'Loading post details...';
      api.getPost(this.id)
        .then(response => {
          const post = response.data;
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
    confirmDeletePost() {
      if (confirm('Are you sure you want to permanently delete this post? This action cannot be undone.')) {
        this.deletePost();
      }
    },
    deletePost() {
      if (!this.id) return;
      this.submitting = true; // Use submitting state to disable buttons
      api.deletePost(this.id)
        .then(() => {
          alert('Post deleted successfully.');
          this.$router.push('/posts');
        })
        .catch(error => {
          console.error('Error deleting post:', error);
          alert('Failed to delete post. Please try again.');
          this.submitting = false;
        });
    },
    goBack() {
      this.$router.go(-1);
    },
    generateCaption() {
      // Use either the existing post image URL or the newly uploaded image preview
      let imageUrl = '';
      
      if (this.imagePreview) {
        // Use the cropped image preview
        imageUrl = this.imagePreview;
      } else if (this.isEditing && this.form.imageUrl) {
        // Use the existing image URL if editing a post
        imageUrl = this.form.imageUrl;
      } else if (this.rawImageData) {
        // Use the raw image data before cropping
        imageUrl = this.rawImageData;
      } else {
        alert('Please upload an image first to generate a caption');
        return;
      }
      
      api.getCaption(imageUrl)
        .then(response => {
          this.form.caption = response.data.caption;
        })
        .catch(error => {
          console.error('Error generating caption:', error);
          alert('Failed to generate caption. Please try again.');
        });
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

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-container {
  padding: 2rem;
}

.loading-indicator, .error-message {
  text-align: center;
  padding: 2rem 0;
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
  font-weight: 500;
  color: var(--on-surface);
}

.text-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  background-color: var(--surface-2);
  color: var(--on-surface);
  transition: border-color 0.2s;
}

.text-field:focus {
  border-color: var(--primary-color);
  outline: none;
}

textarea.text-field {
  resize: vertical;
}

.image-upload-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--surface-2);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  padding: 1rem 0;
  min-height: 320px;
  max-width: 420px;
  margin: 0 auto;
}

.cropper-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cropper-box {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1 / 1;
  background: #111;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  min-height: 250px;
  max-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cropper-box .cropper-container,
.cropper-box .cropper-canvas,
.cropper-box .cropper-drag-box,
.cropper-box .cropper-crop-box,
.cropper-box .cropper-view-box {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  box-sizing: border-box;
}

.image-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  position: static;
  z-index: 1;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  align-items: center;
}

/* Unified Visual Styles for Primary Buttons */
.create-btn,
.custom-file-upload {
  /* Core Layout */
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  /* Visual Appearance */
  background-color: var(--primary-color);
  color: var(--on-primary);
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 1rem; /* Explicit font size */
  border: none;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

/* Unified Hover State */
.create-btn:hover,
.custom-file-upload:hover {
  background-color: var(--primary-dark);
}

/* Specifics needed only for file upload */
.custom-file-upload {
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin-top: 1rem; /* Keep spacing */
}

/* Specifics needed only for form submit button */
.create-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
}

/* --- Keep these as they are --- */

/* Hide the actual file input visually but keep it accessible */
.custom-file-upload input[type="file"] {
  position: absolute;
  left: 0; top: 0; width: 100%; height: 100%;
  opacity: 0; cursor: pointer; z-index: 1;
}

/* Style for the text inside the button */
.custom-file-upload span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 0;
}

.secondary-btn {
  background-color: var(--surface-3);
  color: var(--on-surface);
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.secondary-btn:hover {
  background-color: var(--surface-4);
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
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .create-btn, .secondary-btn {
    width: 100%;
    justify-content: center;
  }
}

.aspect-ratio-selector {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--surface-3);
  border-radius: 999px;
  padding: 0.5rem 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.aspect-ratio-selector label {
  font-weight: 500;
  color: var(--on-surface);
  margin-bottom: 0;
  font-size: 1rem;
}

.aspect-ratio-selector select.text-field {
  background: var(--surface-2);
  color: var(--on-surface);
  border: 1.5px solid var(--primary-color);
  border-radius: 999px;
  padding: 0.4rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  box-shadow: none;
}

.aspect-ratio-selector select.text-field:focus {
  border-color: var(--primary-dark);
  box-shadow: 0 0 0 2px var(--primary-light);
}

.flat-select {
  border-radius: 0 !important;
  background: var(--surface-2);
  color: var(--on-surface);
  border: 1.5px solid var(--primary-color);
  font-size: 1rem;
  font-weight: 500;
  padding: 0.6rem 2.2rem 0.6rem 1rem;
  box-shadow: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.flat-select:focus {
  border-color: var(--primary-dark);
  background: var(--surface-3);
}

.flat-select option {
  color: var(--on-surface);
  background: var(--surface-2);
}

.custom-select-group::after {
  right: 1.2rem;
  top: 1.4rem;
}

.image-preview-existing {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}
.image-preview-existing img {
  max-width: 100%;
  max-height: 250px;
  border-radius: 8px;
  object-fit: contain;
}
.replace-button {
  margin-top: 0;
}

.delete-btn {
  background-color: transparent;
  color: var(--error);
  border: 1px solid var(--error);
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.delete-btn:hover {
  background-color: var(--error);
  color: white;
}

.upload-placeholder {
  text-align: center;
  color: var(--on-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
}

.upload-placeholder i {
  margin-bottom: 0.5rem;
}

.upload-placeholder span {
  font-size: 1rem;
  margin-top: 0;
}

.caption-container {
  position: relative;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.caption-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.caption-btn {
  padding: 0.5rem;
  background-color: var(--primary-color);
  color: var(--on-primary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.caption-btn:hover {
  background-color: var(--primary-dark);
}


.ai-provider-select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--surface-2);
  color: var(--on-surface);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.ai-provider-select:hover {
  border-color: var(--primary-color);
}

.ai-provider-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-light);
}
</style> 