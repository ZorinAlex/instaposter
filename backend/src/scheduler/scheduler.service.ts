import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PostsService } from '../posts/posts.service';
import { InstagramApiService } from '../instagram/instagram-api.service';
import { UploadService } from '../upload/upload.service';
import { Post } from '../posts/schemas/post.schema';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly postsService: PostsService,
    private readonly instagramApiService: InstagramApiService,
    private readonly uploadService: UploadService
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledPosts() {
    this.logger.debug('Checking for posts to publish...');
    try {
      const pendingPosts = await this.postsService.findPendingPosts();

      for (const post of pendingPosts) {
        try {
          const result = await this.instagramApiService.publishPost(post);
          
          // Extract filename from the local image URL
          const urlParts = post.imageUrl.split('/');
          const filename = urlParts[urlParts.length - 1];
          
          // Update post data
          const updateData: any = {
            status: 'posted',
            postedAt: new Date(),
            instagramMediaId: result.mediaId,
          };
          
          // If Instagram provided a media URL, use it and delete local file
          if (result.instagramImageUrl) {
            updateData.imageUrl = result.instagramImageUrl;
            // Delete the local file since we now have the Instagram URL
            await this.uploadService.deleteFile(filename);
            this.logger.log(`Deleted local image file: ${filename} (replaced with Instagram URL)`);
          }
          
          await this.postsService.update(String(post._id), updateData);
          this.logger.log(`Post ${post._id} published successfully`);
        } catch (error) {
          await this.postsService.update(String(post._id), {
            status: 'failed',
          });
          this.logger.error(`Failed to publish post ${post._id}: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error handling scheduled posts: ${error.message}`);
    }
  }
}
