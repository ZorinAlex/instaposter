# Instagram Post Scheduler

A full-stack application for scheduling and automatically publishing Instagram posts using the official Instagram Content Publishing API.

## Features

- Schedule Instagram posts with images and captions for future dates
- Automatically publish posts at scheduled times
- Track post status (pending, posted, failed)
- Modern Vue.js frontend with calendar and list views
- Secure API with JWT authentication
- Image upload and storage

## Requirements

- Node.js (v14+)
- MongoDB
- Instagram Professional Account (Business or Creator)
- Facebook Page connected to your Instagram account
- Facebook Developer Account and App

## Project Structure

- `src/` - NestJS backend application
- `client/` - Vue.js frontend application

## Setup

### 1. Install dependencies

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client && npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGO_URI=mongodb://localhost:27017/instagram_scheduler
IG_USER_ID=your_instagram_user_id
IG_ACCESS_TOKEN=your_long_lived_access_token
JWT_SECRET=your_super_secret_jwt_key
```

### 3. Setting up Instagram API Access

1. **Create a Facebook Developer App**:
   - Go to [Facebook for Developers](https://developers.facebook.com/)
   - Create a new app with the "Business" type
   - Add the "Instagram Graph API" product

2. **Configure Instagram Graph API**:
   - Connect your app to a Facebook Page that's linked to your Instagram Professional account
   - Request the following permissions:
     - `instagram_basic`
     - `instagram_content_publish`
     - `pages_read_engagement`

3. **Get Your Instagram User ID**:
   - Make a GET request to `https://graph.facebook.com/v22.0/me/accounts?access_token=YOUR_USER_ACCESS_TOKEN`
   - Find your Page ID in the response
   - Make a GET request to `https://graph.facebook.com/v22.0/{page-id}?fields=instagram_business_account&access_token=YOUR_USER_ACCESS_TOKEN`
   - The `instagram_business_account.id` is your Instagram User ID

4. **Generate a Long-Lived Access Token**:
   - Make a GET request to `https://graph.facebook.com/v22.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=YOUR_SHORT_LIVED_ACCESS_TOKEN`
   - This will give you a long-lived token that's valid for 60 days

### 4. Run the Application

```bash
# Run backend in development mode
npm run start:dev

# In a separate terminal, run frontend
cd client && npm run dev
```

## Frontend Usage

Navigate to `http://localhost:5173` in your browser to access the frontend. From there you can:

1. View the calendar to see scheduled posts
2. Create new posts with images and captions
3. Edit existing posts
4. Delete posts
5. Track post status

## API Endpoints

### Posts

- `POST /posts` - Create a new scheduled post with image upload
- `GET /posts` - Get all scheduled posts
- `GET /posts/:id` - Get a specific post
- `PUT /posts/:id` - Update a scheduled post
- `DELETE /posts/:id` - Delete a scheduled post

## How It Works

1. The application runs a cron job every minute to check for posts that are scheduled to be published
2. When a post's scheduled time arrives, the app:
   - Creates a media container using the Instagram Graph API
   - Checks the container's status
   - Publishes the container when ready
   - Updates the post status in the database

## Limitations

- Instagram accounts are limited to 50 API-published posts within a 24-hour period
- Only JPEG images are supported
- Shopping tags, branded content tags, and filters are not supported
- Images must be hosted on a publicly accessible server

## License

MIT
