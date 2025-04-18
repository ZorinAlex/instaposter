import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prompt } from './schemas/prompt.schema';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';

@Injectable()
export class PromptsService {
  constructor(
    @InjectModel(Prompt.name) private promptModel: Model<Prompt>
  ) {}

  async findAll(): Promise<Prompt[]> {
    return this.promptModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Prompt | null> {
    return this.promptModel.findById(id).exec();
  }

  async create(createPromptDto: CreatePromptDto): Promise<Prompt> {
    const createdPrompt = new this.promptModel(createPromptDto);
    return createdPrompt.save();
  }

  async update(id: string, updatePromptDto: UpdatePromptDto): Promise<Prompt | null> {
    return this.promptModel
      .findByIdAndUpdate(id, updatePromptDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Prompt | null> {
    return this.promptModel.findByIdAndDelete(id).exec();
  }
} 