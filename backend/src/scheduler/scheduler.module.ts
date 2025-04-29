import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { PostsModule } from '../posts/posts.module';
import { InstagramModule } from '../instagram/instagram.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    ScheduleModule,
    PostsModule,
    InstagramModule,
    UploadModule
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
