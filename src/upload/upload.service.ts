import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    
    // Get the base URL from environment variables or use default
    this.baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
  }

  /**
   * Get the full server URL to an uploaded file
   */
  getFileUrl(filename: string): string {
    return `${this.baseUrl}/uploads/${filename}`;
  }

  /**
   * Delete a file from the uploads directory
   */
  async deleteFile(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        await unlinkAsync(filePath);
        this.logger.log(`Deleted file: ${filename}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Failed to delete file ${filename}: ${error.message}`);
      return false;
    }
  }
} 