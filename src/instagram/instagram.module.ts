import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InstagramApiService } from './instagram-api.service';

@Module({
  imports: [ConfigModule],
  providers: [InstagramApiService],
  exports: [InstagramApiService],
})
export class InstagramModule {} 