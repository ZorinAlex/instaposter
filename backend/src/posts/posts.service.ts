import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { ImageCaptionsService } from '../image-captions/image-captions.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly imageCaptionsService: ImageCaptionsService
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
    return this.postModel.find().sort({ scheduledDate: 'asc' }).exec();
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

  async findPendingPosts(date: Date): Promise<Post[]> {
    return this.postModel.find({
      scheduledDate: { $lte: date },
      status: 'pending',
    }).exec();
  }
}
