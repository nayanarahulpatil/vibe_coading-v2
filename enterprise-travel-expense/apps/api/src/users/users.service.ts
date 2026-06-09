import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Temporary method to seed a mock user if one doesn't exist for SSO simulation
  async findOrCreateMockUser(email: string): Promise<UserDocument> {
    let user = await this.findByEmail(email);
    if (!user) {
      user = await this.userModel.create({
        email,
        name: 'Demo SSO User',
        role: 'Employee',
        grade: 'Band 5',
        costCenter: 'ENG-101',
      });
    }
    return user;
  }
}
