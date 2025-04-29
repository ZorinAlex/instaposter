import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { ImageCaptionsService } from '../image-captions/image-captions.service';
import { InstagramApiService } from '../instagram/instagram-api.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly imageCaptionsService: ImageCaptionsService,
    private readonly instagramApiService: InstagramApiService,
    private readonly uploadService: UploadService
  ) {}

  async create(createPostDto: any): Promise<Post> {
    // If caption is empty or undefined, generate one using ImageCaptionsService
    if (!createPostDto.caption || createPostDto.caption.trim() === '') {
      createPostDto.caption = await this.imageCaptionsService.generateCaption(createPostDto.imageUrl);
    }
    
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().sort({ scheduledDate: 'desc' }).exec();
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postModel.findById(id).exec();
  }

  async update(id: string, updatePostDto: any): Promise<Post | null> {
    // If caption is empty or undefined, generate one using ImageCaptionsService
    if (!updatePostDto.caption || updatePostDto.caption.trim() === '') {
      const post = await this.postModel.findById(id).exec();
      if (post && updatePostDto.caption) {
        updatePostDto.caption = await this.imageCaptionsService.generateCaption(post.imageUrl);
      }
    }
    
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Post | null> {
    return this.postModel.findByIdAndDelete(id).exec();
  }

  async generateCaption(imageUrl?: string): Promise<string> {
    return this.imageCaptionsService.generateCaption(imageUrl || '');
  }

  private canRetry(post: Post): boolean {
    const attempts = post.attempts;
    const lastAttempt = post.lastAttempt;
    
    if (attempts >= post.maxRetryAttempts) {
      return false;
    }

    if (!lastAttempt) {
      return true;
    }

    const timeSinceLastAttempt = Date.now() - lastAttempt.getTime();
    return timeSinceLastAttempt >= post.retryDelay;
  }

  async updateById(id: string, update: Partial<Post>): Promise<Post | null> {
    const result = await this.postModel.findByIdAndUpdate(id, update, { new: true }).exec();
    this.logger.log(`Updated post ${id} with: ${JSON.stringify(update)}. Result: ${JSON.stringify(result)}`);
    return result;
  }

  private async handleInstagramPublish(post: Post, attempts: number): Promise<void> {
    this.logger.log(`handleInstagramPublish called for post ${post._id} with attempts ${attempts}`);
    const lastAttempt = new Date();
    await this.updateById(String(post._id), { attempts, lastAttempt });
    // Fetch the updated post to ensure we have the latest state
    const updatedPost = await this.postModel.findById(post._id).exec();
    if (updatedPost) {
      post.attempts = updatedPost.attempts;
      post.lastAttempt = updatedPost.lastAttempt;
    }

    try {
      const igResult = await this.instagramApiService.publishPost(post);

      const updateData: Partial<Post> = {
        status: 'posted',
        instagramMediaId: igResult.mediaId,
      };
      if (igResult.instagramImageUrl) {
        // Extract filename from the local image URL
        const urlParts = post.imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        await this.uploadService.deleteFile(filename);
        this.logger.log(`Deleted local image file: ${filename} (replaced with Instagram URL)`);
        updateData.imageUrl = igResult.instagramImageUrl;
      }
      await this.updateById(String(post._id), updateData);

      post.status = 'posted';
      post.instagramMediaId = igResult.mediaId;
      if (igResult.instagramImageUrl) post.imageUrl = igResult.instagramImageUrl;

    } catch (error) {
      this.logger.error(
        `Instagram publish attempt ${attempts} failed:`,
        error.message
      );
      await this.updateById(String(post._id), { status: 'failed' });
      post.status = 'failed';
    }
  }

  async publishToInstagram(post: Post): Promise<void> {
    this.logger.log(`publishToInstagram called for post ${post._id}`);
    if (post.attempts && post.attempts > 0) {
      throw new Error('publishToInstagram should only be called for first-time posts');
    }
    await this.handleInstagramPublish(post, 1);
  }

  async publishToInstagramRetry(post: Post): Promise<void> {
    this.logger.log(`publishToInstagramRetry called for post ${post._id}`);
    if (!post.attempts || post.attempts === 0) {
      throw new Error('publishToInstagramRetry should only be called for retries');
    }
    if (!this.canRetry(post)) {
      this.logger.warn(`Max retry attempts reached for Instagram post ${post._id}`);
      return;
    }
    await this.handleInstagramPublish(post, post.attempts + 1);
  }

  async publishPost(post: Post): Promise<Post> {
    // Only publish to Instagram
    if (!post.attempts || post.attempts === 0) {
      await this.publishToInstagram(post);
    } else {
      await this.publishToInstagramRetry(post);
    }

    // Refresh and return the post
    const updatedPost = await this.postModel.findById(post._id).exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${post._id} not found after publishing`);
    }
    return updatedPost;
  }

  public async findPendingPostsForSchedule(): Promise<Post[]> {
    const now = new Date();
    return this.postModel.find({
      scheduledDate: { $lte: now },
      status: 'pending',
      attempts: { $eq: 0 },
    }).exec();
  }

  public async findFailedPostsForRetry(): Promise<Post[]> {
    const now = new Date();
    const retryCandidates = await this.postModel.find({
      scheduledDate: { $lte: now },
      status: 'failed',
      lastAttempt: { $exists: true },
    }).exec();
    // Filter retry posts by retryDelay in JS (since retryDelay is per-post)
    return retryCandidates.filter(post => {
      if (post.maxRetryAttempts <= post.attempts) return false;
      return (now.getTime() - post.lastAttempt.getTime()) >= post.retryDelay;
    });
  }
}
