import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: false, default: '' })
  caption: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop({ default: 'pending', enum: ['pending', 'posted', 'failed'] })
  status: string;

  @Prop()
  postedAt: Date;
  
  // Instagram fields
  @Prop({ default: 'pending', enum: ['pending', 'posted', 'failed'] })
  instagramStatus: string;
  
  @Prop({ default: 0 })
  instagramAttempts: number;
  
  @Prop({ default: 0 })
  instagramLastAttempt: Date;
  
  @Prop()
  instagramMediaId: string;
  
  @Prop()
  instagramContainerId: string;

  @Prop()
  instagramPostUrl: string;
  
  // Facebook fields
  @Prop({ default: 'pending', enum: ['pending', 'posted', 'failed'] })
  facebookStatus: string;
  
  @Prop({ default: 0 })
  facebookAttempts: number;
  
  @Prop({ default: 0 })
  facebookLastAttempt: Date;
  
  @Prop()
  facebookPostId: string;

  @Prop()
  facebookPostUrl: string;
  
  // Retry configuration
  @Prop({ default: 5 })
  maxRetryAttempts: number;
  
  @Prop({ default: 60000 }) // 1 minute in milliseconds
  retryDelay: number;
  
  @Prop({ type: Object, default: {} })
  metaData: Record<string, any>;
}

export const PostSchema = SchemaFactory.createForClass(Post); 