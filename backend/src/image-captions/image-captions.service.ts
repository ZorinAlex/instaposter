import { Injectable, Logger } from '@nestjs/common';
import { OpenRouterService } from './openrouter.service';
import { TogetherAIService } from './togetherai.service';
import { RandomCaptionsService } from './random-captions.service';

@Injectable()
export class ImageCaptionsService {
  private readonly logger = new Logger(ImageCaptionsService.name);

  constructor(
    private readonly openRouterService: OpenRouterService,
    private readonly togetherAIService: TogetherAIService,
    private readonly randomCaptionsService: RandomCaptionsService,
  ) {}

  async generateCaption(imageUrl: string): Promise<string> {
    try {
      // First try OpenRouter
      const openRouterCaption = await this.openRouterService.generateCaption(imageUrl);
      if (openRouterCaption) {
        this.logger.log('Caption generated using OpenRouter');
        return openRouterCaption;
      }
    } catch (error) {
      this.logger.warn('OpenRouter caption generation failed:', error.message);
    }

    try {
      // Fallback to TogetherAI
      const togetherAICaption = await this.togetherAIService.generateCaption(imageUrl);
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