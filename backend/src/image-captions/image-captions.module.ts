import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenRouterService } from "./openrouter.service";
import { TogetherAIService } from "./togetherai.service";
import { RandomCaptionsService } from "./random-captions.service";
import { ImageCaptionsService } from "./image-captions.service";
import { PromptsModule } from '../prompts/prompts.module';

@Module({
  imports: [
    ConfigModule,
    PromptsModule
  ],
  providers: [
    OpenRouterService,
    TogetherAIService,
    RandomCaptionsService,
    ImageCaptionsService
  ],
  exports: [ImageCaptionsService]
})
export class ImageCaptionsModule {} 