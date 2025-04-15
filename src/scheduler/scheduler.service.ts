import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PostsService } from '../posts/posts.service';
import { InstagramApiService } from '../instagram/instagram-api.service';
import { Post } from '../posts/schemas/post.schema';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly postsService: PostsService,
    private readonly instagramApiService: InstagramApiService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledPosts() {
    this.logger.debug('Checking for posts to publish...');
    try {
      const now = new Date();
      const pendingPosts = await this.postsService.findPendingPosts(now);

      for (const post of pendingPosts) {
        try {
          const mediaId = await this.instagramApiService.publishPost(post);
          await this.postsService.update(String(post._id), {
            status: 'posted',
            postedAt: new Date(),
            instagramMediaId: mediaId,
          });
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
