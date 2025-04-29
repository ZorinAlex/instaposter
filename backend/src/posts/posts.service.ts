import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { ImageCaptionsService } from '../image-captions/image-captions.service';
import { InstagramApiService } from '../instagram/instagram-api.service';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);
  private readonly maxRetryAttempts = 3;

  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly imageCaptionsService: ImageCaptionsService,
    private readonly instagramApiService: InstagramApiService
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

  private async updatePostStatus(post: Post): Promise<void> {
    // Update overall post status based on status only
    if (post.status === 'posted') {
      post.postedAt = new Date();
    }
    await post.save();
  }

  async publishToInstagram(post: Post): Promise<void> {
    if (!this.canRetry(post)) {
      this.logger.warn(`Max retry attempts reached for Instagram post ${post._id}`);
      return;
    }

    try {
      post.attempts = (post.attempts || 0) + 1;
      post.lastAttempt = new Date();
      await post.save();

      const igResult = await this.instagramApiService.publishPost(post);
      
      post.instagramMediaId = igResult.mediaId;
      if (igResult.instagramImageUrl) {
        post.instagramPostUrl = igResult.instagramImageUrl;
      }
      post.status = 'posted';
      
    } catch (error) {
      this.logger.error(`Instagram publish attempt ${post.attempts} failed:`, error.message);
      post.status = (post.attempts >= post.maxRetryAttempts) ? 'failed' : 'pending';
    }

    await post.save();
    await this.updatePostStatus(post);
  }

  async publishPost(post: Post): Promise<Post> {
    // Only publish to Instagram
    await this.publishToInstagram(post);

    // Refresh and return the post
    const updatedPost = await this.postModel.findById(post._id).exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${post._id} not found after publishing`);
    }
    return updatedPost;
  }

  async findPendingPosts(): Promise<Post[]> {
    try {
      const now = new Date();
      const posts = await this.postModel.find({
        scheduledDate: { $lte: now },
        status: { $ne: 'posted' },
        attempts: { $lt: this.maxRetryAttempts },
      }).exec();

      return posts;
    } catch (error) {
      this.logger.error('Error finding pending posts:', error);
      return [];
    }
  }

  async findFailedPosts(): Promise<Post[]> {
    return this.postModel.find({
      status: 'failed'
    }).exec();
  }
}
