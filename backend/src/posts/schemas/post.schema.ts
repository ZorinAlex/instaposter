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

  // Retry configuration
  @Prop({ default: 5 })
  maxRetryAttempts: number;

  @Prop({ default: 60000 }) // 1 minute in milliseconds
  retryDelay: number;

  @Prop({ type: Object, default: {} })
  metaData: Record<string, any>;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ default: null })
  lastAttempt: Date;
  
  @Prop()
  instagramMediaId: string;
  
  @Prop()
  instagramPostUrl: string;
}

export const PostSchema = SchemaFactory.createForClass(Post); 