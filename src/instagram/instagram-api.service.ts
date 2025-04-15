import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Post } from '../posts/schemas/post.schema';

@Injectable()
export class InstagramApiService {
  private readonly logger = new Logger(InstagramApiService.name);

  constructor(private configService: ConfigService) {}

  async publishPost(post: Post): Promise<string> {
    this.logger.log(`Publishing post with caption: ${post.caption}`);

    try {
      const igUserId = this.configService.get<string>('IG_USER_ID');
      const accessToken = this.configService.get<string>('IG_ACCESS_TOKEN');

      if (!igUserId || !accessToken) {
        throw new Error('Instagram credentials are not set in the environment variables.');
      }

      // Step 1: Create a media container
      const containerId = await this.createMediaContainer(igUserId, accessToken, post);
      this.logger.log(`Created media container with ID: ${containerId}`);

      // Step 2: Wait for container to be ready
      await this.waitForContainerReady(containerId, accessToken);

      // Step 3: Publish the container
      const mediaId = await this.publishContainer(igUserId, accessToken, containerId);
      this.logger.log(`Post published to Instagram with ID: ${mediaId}`);
      
      return mediaId;
    } catch (error) {
      this.logger.error(`Failed to publish post to Instagram: ${error.message}`);
      if (error.response) {
        this.logger.error(`Error response: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  private async createMediaContainer(igUserId: string, accessToken: string, post: Post): Promise<string> {
    const createContainerUrl = `https://graph.facebook.com/v22.0/${igUserId}/media`;
    const containerResponse = await axios.post(
      createContainerUrl, 
      null, 
      {
        params: {
          image_url: post.imageUrl,
          caption: post.caption,
          access_token: accessToken
        }
      }
    );

    if (!containerResponse.data || !containerResponse.data.id) {
      throw new Error('Failed to create media container');
    }

    return containerResponse.data.id;
  }

  private async waitForContainerReady(containerId: string, accessToken: string): Promise<void> {
    let statusResponse = await this.checkContainerStatus(containerId, accessToken);
    
    let attempts = 0;
    while (statusResponse.status_code !== 'FINISHED' && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      statusResponse = await this.checkContainerStatus(containerId, accessToken);
      attempts++;
    }

    if (statusResponse.status_code !== 'FINISHED') {
      throw new Error(`Container status is not ready: ${statusResponse.status_code}`);
    }
  }

  private async checkContainerStatus(containerId: string, accessToken: string) {
    const response = await axios.get(
      `https://graph.facebook.com/v22.0/${containerId}`,
      {
        params: {
          fields: 'status_code',
          access_token: accessToken
        }
      }
    );
    return response.data;
  }

  private async publishContainer(igUserId: string, accessToken: string, containerId: string): Promise<string> {
    const publishUrl = `https://graph.facebook.com/v22.0/${igUserId}/media_publish`;
    const publishResponse = await axios.post(
      publishUrl, 
      null, 
      {
        params: {
          creation_id: containerId,
          access_token: accessToken
        }
      }
    );

    if (!publishResponse.data || !publishResponse.data.id) {
      throw new Error('Failed to publish media');
    }

    return publishResponse.data.id;
  }
} 