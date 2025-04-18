import { 
  Controller, 
  Body, 
  Delete, 
  Get, 
  Param, 
  Post, 
  Put, 
  UseInterceptors, 
  UploadedFile,
  BadRequestException,
  UseGuards,
  Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './schemas/post.schema';
import { UploadService } from '../upload/upload.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Express } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly uploadService: UploadService
  ) {}

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get('caption')
  async generateCaption(@Query('imageUrl') imageUrl?: string) {
    const caption = await this.postsService.generateCaption(imageUrl);
    return { caption };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity | null> {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<PostEntity> {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Get the public URL for the uploaded image
    const imageUrl = this.uploadService.getFileUrl(file.filename);
    
    // Create the post with the image URL
    return this.postsService.create({
      ...createPostDto,
      imageUrl
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: any): Promise<PostEntity | null> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<PostEntity | null> {
    return this.postsService.delete(id);
  }
}
