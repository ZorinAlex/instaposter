import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Prompt extends Document {
  @Prop({ required: true })
  text: string;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt); 