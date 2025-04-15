import { Controller, Body, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './schemas/post.schema';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: any): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity | null> {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: any): Promise<PostEntity | null> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<PostEntity | null> {
    return this.postsService.remove(id);
  }
}
