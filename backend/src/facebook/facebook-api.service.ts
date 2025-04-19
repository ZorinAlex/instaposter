import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Post } from '../posts/schemas/post.schema';

interface PublishResult {
  postId: string;
  facebookPostUrl?: string;
}

@Injectable()
export class FacebookApiService {
  private readonly logger = new Logger(FacebookApiService.name);

  constructor(private configService: ConfigService) {}

  async publishPost(post: Post): Promise<PublishResult> {
    this.logger.log(`Publishing post to Facebook with caption: ${post.caption}`);

    try {
      const pageId = this.configService.get<string>('FB_PAGE_ID');
      const accessToken = this.configService.get<string>('FB_ACCESS_TOKEN');

      if (!pageId || !accessToken) {
        throw new Error('Facebook credentials are not set in the environment variables.');
      }

      // Publish photo with caption to Facebook page
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${pageId}/photos`,
        null,
        {
          params: {
            url: post.imageUrl,
            caption: post.caption,
            access_token: accessToken,
            published: true
          }
        }
      );

      if (!response.data || !response.data.id) {
        throw new Error('Failed to publish post to Facebook');
      }

      const postId = response.data.id;
      
      // Get the post URL
      let facebookPostUrl: string | undefined;
      try {
        const postInfo = await axios.get(
          `https://graph.facebook.com/v18.0/${postId}`,
          {
            params: {
              fields: 'permalink_url',
              access_token: accessToken
            }
          }
        );
        facebookPostUrl = postInfo.data?.permalink_url;
      } catch (error) {
        this.logger.warn(`Could not fetch Facebook post URL: ${error.message}`);
      }

      this.logger.log(`Successfully published to Facebook with ID: ${postId}`);
      return { postId, facebookPostUrl };

    } catch (error) {
      this.logger.error(`Failed to publish post to Facebook: ${error.message}`);
      if (error.response) {
        this.logger.error(`Error response: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
} 