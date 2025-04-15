import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { PostsModule } from '../posts/posts.module';
import { InstagramModule } from '../instagram/instagram.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PostsModule,
    InstagramModule
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}
