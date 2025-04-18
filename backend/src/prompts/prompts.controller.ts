import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { Prompt } from './schemas/prompt.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('prompts')
@UseGuards(JwtAuthGuard)
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  async findAll(): Promise<Prompt[]> {
    return this.promptsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Prompt | null> {
    return this.promptsService.findOne(id);
  }

  @Post()
  async create(@Body() createPromptDto: CreatePromptDto): Promise<Prompt> {
    return this.promptsService.create(createPromptDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePromptDto: UpdatePromptDto
  ): Promise<Prompt | null> {
    return this.promptsService.update(id, updatePromptDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Prompt | null> {
    return this.promptsService.delete(id);
  }
} 