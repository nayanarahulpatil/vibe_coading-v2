import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExpenseClaim, ExpenseClaimDocument } from './schemas/expense-claim.schema';

@Injectable()
export class ExpenseService {
  private readonly logger = new Logger(ExpenseService.name);

  constructor(
    @InjectModel(ExpenseClaim.name) private expenseClaimModel: Model<ExpenseClaimDocument>,
  ) {}

  async createClaim(userId: string, data: Partial<ExpenseClaim>): Promise<ExpenseClaimDocument> {
    // Mocking an OCR processing delay if a receipt URL is provided
    if (data.receiptUrl) {
      this.logger.log(`Mocking OCR processing for receipt: ${data.receiptUrl}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s simulated delay
      this.logger.log('Mock OCR processing complete.');
    }

    const createdClaim = new this.expenseClaimModel({ ...data, user: userId });
    return createdClaim.save();
  }

  async findMyClaims(userId: string): Promise<ExpenseClaimDocument[]> {
    return this.expenseClaimModel.find({ user: userId as any }).sort({ createdAt: -1 }).exec();
  }
}
