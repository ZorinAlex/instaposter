import { Injectable, Logger } from '@nestjs/common';
import { OpenRouterService } from './openrouter.service';
import { TogetherAIService } from './togetherai.service';
import { RandomCaptionsService } from './random-captions.service';
import { PromptsService } from '../prompts/prompts.service';

@Injectable()
export class ImageCaptionsService {
  private readonly logger = new Logger(ImageCaptionsService.name);

  constructor(
    private readonly openRouterService: OpenRouterService,
    private readonly togetherAIService: TogetherAIService,
    private readonly randomCaptionsService: RandomCaptionsService,
    private readonly promptsService: PromptsService,
  ) {}

  private async getRandomPrompt(): Promise<string> {
    try {
      const prompts = await this.promptsService.findAll();
      if (prompts.length === 0) {
        throw new Error('No prompts found in database. Please add some prompts first.');
      }
      const randomIndex = Math.floor(Math.random() * prompts.length);
      return prompts[randomIndex].text;
    } catch (error) {
      this.logger.error('Failed to get random prompt:', error.message);
      throw error;
    }
  }

  async generateCaption(imageUrl: string): Promise<string> {
    const prompt = await this.getRandomPrompt();
    this.logger.log(`prompt: ${prompt}`);
    try {
      // First try OpenRouter
      const openRouterCaption = await this.openRouterService.generateCaption(imageUrl, prompt);
      if (openRouterCaption) {
        this.logger.log('Caption generated using OpenRouter');
        return openRouterCaption;
      }
    } catch (error) {
      this.logger.warn('OpenRouter caption generation failed:', error.message);
    }

    try {
      // Fallback to TogetherAI
      const togetherAICaption = await this.togetherAIService.generateCaption(imageUrl, prompt);
      if (togetherAICaption) {
        this.logger.log('Caption generated using TogetherAI');
        return togetherAICaption;
      }
    } catch (error) {
      this.logger.warn('TogetherAI caption generation failed:', error.message);
    }

    // Final fallback to random captions
    this.logger.log('Using random caption as fallback');
    return this.randomCaptionsService.generateCaption();
  }
} 