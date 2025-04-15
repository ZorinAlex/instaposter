.editor-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--on-background);
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.form-container {
  background-color: var(--surface);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--on-surface);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--on-surface-variant);
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background-color: var(--surface-variant);
  border: 1px solid var(--outline);
  border-radius: 4px;
  color: var(--on-surface);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
}

.form-control::placeholder {
  color: var(--on-surface-variant);
  opacity: 0.7;
}

textarea.form-control {
  min-height: 120px;
  resize: vertical;
}

.error-text {
  color: var(--error);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.image-uploader {
  margin-bottom: 1.5rem;
}

.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  border: 2px dashed var(--outline);
  border-radius: 8px;
  background-color: var(--surface-variant);
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.dropzone:hover {
  border-color: var(--primary);
  background-color: rgba(var(--primary-rgb), 0.05);
}

.dropzone-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--on-surface-variant);
}

.dropzone-text {
  font-size: 1rem;
  color: var(--on-surface);
  margin-bottom: 0.5rem;
}

.dropzone-subtext {
  font-size: 0.85rem;
  color: var(--on-surface-variant);
}

.preview-container {
  margin-top: 1.5rem;
}

.image-preview {
  position: relative;
  display: inline-block;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.preview-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid var(--outline);
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--error);
  color: var(--on-error);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
  border-radius: 16px;
  font-size: 0.85rem;
}

.tag-remove {
  margin-left: 0.5rem;
  cursor: pointer;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(var(--on-secondary-container-rgb), 0.2);
}

.tag-input {
  display: flex;
  align-items: center;
}

.tag-input-control {
  flex: 1;
}

.add-tag-btn {
  padding: 0.75rem 1rem;
  margin-left: 0.5rem;
  background-color: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.schedule-toggle {
  margin-bottom: 1.5rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-right: 0.75rem;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--outline);
  border-radius: 34px;
  transition: 0.4s;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: var(--surface);
  border-radius: 50%;
  transition: 0.4s;
}

input:checked + .toggle-slider {
  background-color: var(--primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.schedule-fields {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.schedule-field {
  flex: 1;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-btn {
  background-color: var(--primary);
  color: var(--on-primary);
}

.primary-btn:hover {
  background-color: var(--primary-light);
}

.secondary-btn {
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

.secondary-btn:hover {
  background-color: rgba(var(--primary-rgb), 0.1);
}

.danger-btn {
  background-color: var(--error);
  color: var(--on-error);
}

.danger-btn:hover {
  background-color: var(--error-light);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .form-container {
    padding: 1.5rem 1rem;
  }
  
  .schedule-fields {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-btn {
    width: 100%;
  }
} 