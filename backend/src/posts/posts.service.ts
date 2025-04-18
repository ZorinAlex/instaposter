import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { OpenRouterService } from '../services/openrouter.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private openRouterService: OpenRouterService
  ) {}

  private captionTemplates = [
    "✨ Living my best life\n\n#lifestyle #happy #blessed",
    "🌟 Making memories that last forever\n\n#memories #moments #life",
    "🎯 Goals in progress\n\n#motivation #goals #progress",
    "💫 Every day is a new opportunity\n\n#opportunity #growth #mindset",
    "🌈 Finding beauty in the little things\n\n#beauty #mindfulness #gratitude",
    "🎨 Creating my own path\n\n#creativity #journey #inspiration",
    "🌺 Blooming where I'm planted\n\n#growth #positivity #life",
    "⭐ Shining bright today and always\n\n#shine #positivevibes #happiness",
    "🌙 Dreams becoming reality\n\n#dreams #goals #achievement",
    "🎉 Celebrating life's moments\n\n#celebrate #joy #happiness"
  ];

  generateRandomCaption(): string {
    const randomIndex = Math.floor(Math.random() * this.captionTemplates.length);
    return this.captionTemplates[randomIndex];
  }

  async generateAICaption(imageUrl?: string): Promise<string> {
    return this.openRouterService.generateCaption(imageUrl);
  }

  async create(createPostDto: any): Promise<Post> {
    // If caption is empty or undefined, generate a random one
    if (!createPostDto.caption || createPostDto.caption.trim() === '') {
      createPostDto.caption = this.generateRandomCaption();
    }
    
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postModel.findById(id).exec();
  }

  async update(id: string, updatePostDto: any): Promise<Post | null> {
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Post | null> {
    return this.postModel.findByIdAndDelete(id).exec();
  }

  async findPendingPosts(date: Date): Promise<Post[]> {
    return this.postModel.find({
      scheduledDate: { $lte: date },
      status: 'pending',
    }).exec();
  }
}
