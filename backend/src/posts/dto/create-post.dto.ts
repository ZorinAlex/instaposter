import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  caption: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  scheduledDate: Date;

  @IsString()
  @IsOptional()
  status?: string;
} 