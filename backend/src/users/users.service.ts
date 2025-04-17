import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(username: string, password: string, email?: string): Promise<User> {
    try {
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      const newUser = new this.userModel({
        username,
        password: hashedPassword,
        email,
      });
      
      return newUser.save();
    } catch (error) {
      throw new BadRequestException(`Error creating user: ${error.message}`);
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.findOne(username);
      
      if (user && await bcrypt.compare(password, user.password)) {
        const { password, ...result } = user.toObject();
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }
} 