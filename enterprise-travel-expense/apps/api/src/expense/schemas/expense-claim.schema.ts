import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { TravelRequest } from '../../travel/schemas/travel-request.schema';

export type ExpenseClaimDocument = ExpenseClaim & Document;

@Schema({ timestamps: true })
export class ExpenseClaim {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TravelRequest', required: false })
  travelRequest: TravelRequest;

  @Prop({ required: true })
  merchant: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: false })
  receiptUrl: string;

  @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Rejected', 'Paid'] })
  status: string;
}

export const ExpenseClaimSchema = SchemaFactory.createForClass(ExpenseClaim);
