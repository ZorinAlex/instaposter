.dashboard-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dashboard-header {
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

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.section {
  background-color: var(--surface);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--on-surface);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-all {
  font-size: 0.85rem;
  color: var(--primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.view-all:hover {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--on-surface-variant);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-text {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.empty-subtext {
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* Recent posts */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--surface-variant);
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.post-content {
  flex: 1;
}

.post-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--on-surface);
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--on-surface-variant);
  margin-bottom: 0.5rem;
}

.post-status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-published {
  background-color: var(--success-container);
  color: var(--on-success-container);
}

.status-scheduled {
  background-color: var(--tertiary-container);
  color: var(--on-tertiary-container);
}

.status-draft {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.post-action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--on-surface-variant);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.post-action-btn:hover {
  background-color: var(--surface);
  color: var(--primary);
}

/* Calendar */
.calendar-container {
  background-color: var(--surface-variant);
  border-radius: 8px;
  padding: 1rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-title {
  font-weight: 500;
  color: var(--on-surface);
}

.calendar-nav {
  display: flex;
  gap: 0.5rem;
}

.calendar-nav-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--on-surface-variant);
  transition: background-color 0.2s, color 0.2s;
}

.calendar-nav-btn:hover {
  background-color: var(--surface);
  color: var(--primary);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  padding: 0.5rem 0;
}

.calendar-day {
  aspect-ratio: 1/1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  position: relative;
  color: var(--on-surface);
}

.calendar-day.current-month {
  background-color: var(--surface);
}

.calendar-day.other-month {
  color: var(--on-surface-variant);
  opacity: 0.5;
}

.calendar-day.today {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
  font-weight: 500;
}

.calendar-day.has-posts::after {
  content: "";
  position: absolute;
  bottom: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--primary);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-card {
  background-color: var(--surface-variant);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.stat-title {
  font-size: 0.85rem;
  color: var(--on-surface-variant);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--on-surface);
}

.stat-change {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stat-increase {
  color: var(--success);
}

.stat-decrease {
  color: var(--error);
}

/* Activity */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-post {
  background-color: var(--primary-container);
  color: var(--on-primary-container);
}

.icon-engagement {
  background-color: var(--secondary-container);
  color: var(--on-secondary-container);
}

.icon-analytics {
  background-color: var(--tertiary-container);
  color: var(--on-tertiary-container);
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin-bottom: 0.25rem;
  color: var(--on-surface);
}

.activity-text strong {
  font-weight: 500;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--on-surface-variant);
}

@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .post-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .post-image {
    width: 100%;
    height: 160px;
  }
} 