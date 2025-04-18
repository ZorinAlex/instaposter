import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomCaptionsService {
  private readonly captions = [
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

  generateCaption(): string {
    const randomIndex = Math.floor(Math.random() * this.captions.length);
    return this.captions[randomIndex];
  }
} 