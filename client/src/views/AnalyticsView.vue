.analytics-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--on-background);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: var(--surface);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.stat-title {
  font-size: 0.9rem;
  color: var(--on-surface-variant);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--on-surface);
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.trend-up {
  color: var(--success);
}

.trend-down {
  color: var(--error);
}

.trend-neutral {
  color: var(--on-surface-variant);
}

.chart-container {
  background-color: var(--surface);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--on-surface);
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
}

.time-filter {
  display: flex;
  background-color: var(--surface-variant);
  border-radius: 20px;
  overflow: hidden;
}

.filter-option {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  border: none;
  background: none;
  color: var(--on-surface-variant);
  transition: background-color 0.2s;
}

.filter-option.active {
  background-color: var(--primary);
  color: var(--on-primary);
}

.filter-option:hover:not(.active) {
  background-color: var(--surface-light);
}

.engagement-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--surface);
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.post-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.post-details {
  display: flex;
  flex-direction: column;
}

.post-date {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}

.post-engagement {
  display: flex;
  gap: 1.5rem;
}

.engagement-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.engagement-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--on-surface);
}

.engagement-label {
  font-size: 0.8rem;
  color: var(--on-surface-variant);
}

.view-post-button {
  padding: 0.5rem 1rem;
  background-color: var(--primary);
  color: var(--on-primary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.view-post-button:hover {
  background-color: var(--primary-light);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: var(--surface);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--on-surface-variant);
}

.empty-message {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: var(--on-surface);
}

.empty-description {
  color: var(--on-surface-variant);
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .engagement-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .post-engagement {
    width: 100%;
    justify-content: space-between;
  }
  
  .view-post-button {
    width: 100%;
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .chart-controls {
    width: 100%;
  }
  
  .time-filter {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-option {
    flex: 1;
    text-align: center;
  }
} 