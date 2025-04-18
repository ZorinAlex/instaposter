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
  
  @Prop()
  instagramMediaId: string;
  
  @Prop()
  instagramContainerId: string;
  
  @Prop({ type: Object, default: {} })
  metaData: Record<string, any>;
}

export const PostSchema = SchemaFactory.createForClass(Post); 