import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    return this.usersService.validateUser(username, password);
  }

  async login(user: any) {
    if (!user || !user._id) {
      throw new BadRequestException('Invalid user data');
    }

    const payload: JwtPayload = { 
      sub: user._id.toString(), 
      username: user.username 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async register(username: string, password: string, email?: string) {
    try {
      // Check if user already exists
      const existingUser = await this.usersService.findOne(username);
      if (existingUser) {
        throw new BadRequestException('Username already exists');
      }
      
      // Create the user
      const user = await this.usersService.create(username, password, email);
      
      // Return login info
      return this.login({ 
        _id: user._id, 
        username: user.username, 
        email: user.email 
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Registration failed: ${error.message}`);
    }
  }

  generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }

  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }
} 