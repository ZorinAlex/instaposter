import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenRouterService {
  private readonly logger = new Logger(OpenRouterService.name);
  private readonly openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    
    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey || 'default_key'
    });
  }

  async generateCaption(imageUrl?: string): Promise<string> {
    try {
      if (!imageUrl) {
        this.logger.warn('No image URL provided for caption generation');
        return this.getFallbackCaption();
      }

      const completion = await this.openai.chat.completions.create({
        model: "meta-llama/llama-3.2-11b-vision-instruct:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: 'text',
                text: 'Write a short, flirty, and stylish Instagram caption for a sexy female model photo. Make it captivating and confident. Add popular hashtags and emojis to boost engagement. Return only the caption text — no explanation'
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
        max_tokens: 150
      });

      const generatedMessage = completion.choices?.[0]?.message?.content;
      if (generatedMessage) {
        return generatedMessage.trim().replace(/['"]/g, '');
      } else {
        throw new Error('Invalid response from OpenRouter API');
      }
    } catch (error) {
      this.logger.error(`Failed to generate caption: ${error.message}`);
      return this.getFallbackCaption();
    }
  }

  private getFallbackCaption(): string {
    const captions = [
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
    
    const randomIndex = Math.floor(Math.random() * captions.length);
    return captions[randomIndex];
  }
} 