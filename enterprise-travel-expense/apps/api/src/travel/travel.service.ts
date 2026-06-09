import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TravelRequest, TravelRequestDocument } from './schemas/travel-request.schema';

@Injectable()
export class TravelService {
  constructor(
    @InjectModel(TravelRequest.name) private travelRequestModel: Model<TravelRequestDocument>,
  ) {}

  async createRequest(userId: string, data: Partial<TravelRequest>): Promise<TravelRequestDocument> {
    const createdRequest = new this.travelRequestModel({ ...data, user: userId });
    return createdRequest.save();
  }

  async findMyRequests(userId: string): Promise<TravelRequestDocument[]> {
    return this.travelRequestModel.find({ user: userId as any }).sort({ createdAt: -1 }).exec();
  }
}
