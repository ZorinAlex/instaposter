import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly postsService: PostsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledPosts() {
    try {
      const pendingPosts = await this.postsService.findPendingPostsForSchedule();
      for (const post of pendingPosts) {
        try {
          await this.postsService.publishToInstagram(post);
          this.logger.log(`Post ${post._id} published successfully`);
        } catch (error) {
          this.logger.error(`Failed to publish post ${post._id}: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error handling scheduled posts: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleRetryPosts() {
    try {
      const retryPosts = await this.postsService.findFailedPostsForRetry();
      for (const post of retryPosts) {
        try {
          await this.postsService.publishToInstagramRetry(post);
          this.logger.log(`Retry for post ${post._id} attempted`);
        } catch (error) {
          this.logger.error(`Retry failed for post ${post._id}: ${error.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error handling retry posts: ${error.message}`);
    }
  }
}
