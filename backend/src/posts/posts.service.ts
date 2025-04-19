import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { ImageCaptionsService } from '../image-captions/image-captions.service';
import { InstagramApiService } from '../instagram/instagram-api.service';
import { FacebookApiService } from '../facebook/facebook-api.service';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly imageCaptionsService: ImageCaptionsService,
    private readonly instagramApiService: InstagramApiService,
    private readonly facebookApiService: FacebookApiService
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
      if (post) {
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

  private canRetry(post: Post, platform: 'instagram' | 'facebook'): boolean {
    const attempts = platform === 'instagram' ? post.instagramAttempts : post.facebookAttempts;
    const lastAttempt = platform === 'instagram' ? post.instagramLastAttempt : post.facebookLastAttempt;
    
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
    // Update overall post status based on Instagram and Facebook status
    if (post.instagramStatus === 'posted' && post.facebookStatus === 'posted') {
      post.status = 'posted';
      post.postedAt = new Date();
    } else if (post.instagramStatus === 'failed' && post.facebookStatus === 'failed') {
      post.status = 'failed';
    } else {
      post.status = 'pending';
    }
    await post.save();
  }

  async publishToInstagram(post: Post): Promise<void> {
    if (!this.canRetry(post, 'instagram')) {
      this.logger.warn(`Max retry attempts reached for Instagram post ${post._id}`);
      return;
    }

    try {
      post.instagramAttempts += 1;
      post.instagramLastAttempt = new Date();
      await post.save();

      const igResult = await this.instagramApiService.publishPost(post);
      
      post.instagramMediaId = igResult.mediaId;
      if (igResult.instagramImageUrl) {
        post.instagramPostUrl = igResult.instagramImageUrl;
      }
      post.instagramStatus = 'posted';
      
    } catch (error) {
      this.logger.error(`Instagram publish attempt ${post.instagramAttempts} failed:`, error.message);
      post.instagramStatus = post.instagramAttempts >= post.maxRetryAttempts ? 'failed' : 'pending';
    }

    await post.save();
    await this.updatePostStatus(post);
  }

  async publishToFacebook(post: Post): Promise<void> {
    if (!this.canRetry(post, 'facebook')) {
      this.logger.warn(`Max retry attempts reached for Facebook post ${post._id}`);
      return;
    }

    try {
      post.facebookAttempts += 1;
      post.facebookLastAttempt = new Date();
      await post.save();

      const fbResult = await this.facebookApiService.publishPost(post);
      
      post.facebookPostId = fbResult.postId;
      if (fbResult.facebookPostUrl) {
        post.facebookPostUrl = fbResult.facebookPostUrl;
      }
      post.facebookStatus = 'posted';
      
    } catch (error) {
      this.logger.error(`Facebook publish attempt ${post.facebookAttempts} failed:`, error.message);
      post.facebookStatus = post.facebookAttempts >= post.maxRetryAttempts ? 'failed' : 'pending';
    }

    await post.save();
    await this.updatePostStatus(post);
  }

  async publishPost(post: Post): Promise<Post> {
    // Start both publishing processes independently
    await Promise.all([
      this.publishToInstagram(post),
      this.publishToFacebook(post)
    ]);

    // Refresh and return the post
    const updatedPost = await this.postModel.findById(post._id).exec();
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${post._id} not found after publishing`);
    }
    return updatedPost;
  }

  async findPendingPosts(date: Date): Promise<Post[]> {
    return this.postModel.find({
      scheduledDate: { $lte: date },
      $or: [
        { instagramStatus: 'pending', instagramAttempts: { $lt: '$maxRetryAttempts' } },
        { facebookStatus: 'pending', facebookAttempts: { $lt: '$maxRetryAttempts' } }
      ]
    }).exec();
  }

  async findFailedPosts(): Promise<Post[]> {
    return this.postModel.find({
      $or: [
        { instagramStatus: 'failed' },
        { facebookStatus: 'failed' }
      ]
    }).exec();
  }
}
