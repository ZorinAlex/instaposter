# Instagram Post Scheduler Frontend

A Vue.js frontend for the Instagram Post Scheduler application.

## Features

- Calendar view for post scheduling
- List view for managing posts
- Create, edit, and delete scheduled posts
- Upload images for Instagram posts
- Status tracking for each post

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## API Integration

The frontend connects to the NestJS backend API running on port 3000. The Vite development server proxies API requests to avoid CORS issues.

## Usage

1. Navigate to the home page to view stats and recent posts
2. Use the Calendar view to schedule posts on specific dates
3. Use the Posts list to view and manage all posts
4. Click "New Post" to create a new scheduled post
5. Upload an image, add a caption, and set a date/time
6. The post will be published to Instagram automatically at the scheduled time

## Technology Stack

- Vue 3 with Composition API
- Vue Router for navigation
- Axios for API requests
- V-Calendar for calendar functionality
- FontAwesome for icons 

## Environment Variables

- `VITE_API_BASE_URL`: The base URL for all API requests from the frontend. Set this to your backend server address (e.g., `http://localhost:3333`) in your `.env` file for local development.

Example `.env`:
```
VITE_API_BASE_URL=http://localhost:3333
``` 