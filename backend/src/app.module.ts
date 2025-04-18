import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { InstagramModule } from './instagram/instagram.module';
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PromptsModule } from './prompts/prompts.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('MONGODB_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    PostsModule,
    SchedulerModule,
    InstagramModule,
    UploadModule,
    AuthModule,
    UsersModule,
    PromptsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
