import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Together from 'together-ai';

@Injectable()
export class TogetherAIService {
  private readonly logger = new Logger(TogetherAIService.name);
  private readonly together: Together;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('TOGETHERAI_API_KEY');
    if (!apiKey) {
      throw new Error('TOGETHERAI_API_KEY is not set');
    }
    this.together = new Together({ apiKey });
  }

  async generateCaption(imageUrl: string, prompt: string): Promise<string> {
      const response = await this.together.chat.completions.create({
        model: "meta-llama/Llama-Vision-Free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 250
      });

      const generatedMessage = response.choices?.[0]?.message?.content;
      if (generatedMessage) {
        return generatedMessage.trim().replace(/['"]/g, '');
      } else {
        throw new Error('Invalid response from TogetherAI API');
      }
  }
} 