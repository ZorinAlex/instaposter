<template>
  <div class="prompts-view">
    <div class="page-header">
      <h2>Prompts</h2>
      <button @click="showAddPrompt = true" class="create-btn">
        <i class="fas fa-plus"></i> New Prompt
      </button>
    </div>

    <div class="prompts-list">
      <div v-for="prompt in prompts" :key="prompt._id" class="prompt-card">
        <div class="prompt-content">
          <p class="prompt-text">{{ prompt.text }}</p>
          <p class="prompt-date">Added {{ formatDate(prompt.createdAt) }}</p>
        </div>
        <div class="prompt-actions">
          <button @click="editPrompt(prompt)" class="btn-icon">
            <i class="fas fa-edit"></i>
          </button>
          <button @click="deletePrompt(prompt)" class="btn-icon btn-delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      <div v-if="prompts.length === 0" class="empty-state">
        <i class="fas fa-comment-dots"></i>
        <h3>No Prompts Yet</h3>
        <p>Add some prompts to help generate captions for your posts.</p>
      </div>
    </div>

    <!-- Add/Edit Prompt Modal -->
    <div v-if="showAddPrompt || editingPrompt" class="modal">
      <div class="modal-content">
        <h3>{{ editingPrompt ? 'Edit Prompt' : 'Add New Prompt' }}</h3>
        <form @submit.prevent="savePrompt">
          <div class="form-group">
            <label for="promptText">Prompt Text</label>
            <textarea
              id="promptText"
              v-model="promptForm.text"
              rows="4"
              class="text-field"
              placeholder="Enter your prompt text..."
              required
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="cancelEdit" class="secondary-btn">
              Cancel
            </button>
            <button type="submit" class="create-btn">
              {{ editingPrompt ? 'Update' : 'Add' }} Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { format } from 'date-fns';

export default {
  name: 'PromptsView',
  data() {
    return {
      prompts: [],
      showAddPrompt: false,
      editingPrompt: null,
      promptForm: {
        text: ''
      }
    };
  },
  methods: {
    fetchPrompts() {
      api.getPrompts()
        .then(response => {
          this.prompts = response.data;
        })
        .catch(error => {
          console.error('Error fetching prompts:', error);
        });
    },
    editPrompt(prompt) {
      this.editingPrompt = prompt;
      this.promptForm.text = prompt.text;
    },
    cancelEdit() {
      this.showAddPrompt = false;
      this.editingPrompt = null;
      this.promptForm.text = '';
    },
    savePrompt() {
      const promise = this.editingPrompt
        ? api.updatePrompt(this.editingPrompt._id, this.promptForm)
        : api.createPrompt(this.promptForm);

      promise
        .then(() => {
          this.fetchPrompts();
          this.cancelEdit();
        })
        .catch(error => {
          console.error('Error saving prompt:', error);
        });
    },
    deletePrompt(prompt) {
      if (confirm('Are you sure you want to delete this prompt?')) {
        api.deletePrompt(prompt._id)
          .then(() => {
            this.fetchPrompts();
          })
          .catch(error => {
            console.error('Error deleting prompt:', error);
          });
      }
    },
    formatDate(date) {
      return format(new Date(date), 'MMM d, yyyy');
    }
  },
  created() {
    this.fetchPrompts();
  }
};
</script>

<style scoped>
.prompts-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.prompts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.prompt-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: var(--surface);
  border-radius: 8px;
  padding: 1rem;
  gap: 1rem;
}

.prompt-content {
  flex: 1;
}

.prompt-text {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.prompt-date {
  font-size: 0.85rem;
  color: var(--on-surface);
  opacity: 0.7;
}

.prompt-actions {
  display: flex;
  gap: 0.5rem;
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
}

.btn-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.btn-delete:hover {
  color: var(--error);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--on-surface);
  opacity: 0.7;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-light);
  opacity: 0.5;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--surface);
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  margin: 1rem;
}

.modal-content h3 {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.text-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--surface-2);
  color: var(--on-surface);
  font-size: 1rem;
  resize: vertical;
}

.text-field:focus {
  border-color: var(--primary-color);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.secondary-btn {
  background-color: var(--surface-2);
  color: var(--on-surface);
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.secondary-btn:hover {
  background-color: var(--surface-3);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .create-btn {
    width: 100%;
    justify-content: center;
  }

  .prompt-card {
    flex-direction: column;
  }

  .prompt-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style> 