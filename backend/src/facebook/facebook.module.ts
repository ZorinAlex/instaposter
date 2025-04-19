import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FacebookApiService } from './facebook-api.service';

@Module({
  imports: [ConfigModule],
  providers: [FacebookApiService],
  exports: [FacebookApiService]
})
export class FacebookModule {} 