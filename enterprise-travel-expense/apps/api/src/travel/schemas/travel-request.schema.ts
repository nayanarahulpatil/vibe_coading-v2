import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type TravelRequestDocument = TravelRequest & Document;

@Schema({ timestamps: true })
export class TravelRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  departureCity: string;

  @Prop({ required: true })
  destinationCity: string;

  @Prop({ required: true })
  departureDate: Date;

  @Prop({ required: true })
  returnDate: Date;

  @Prop({ required: true })
  purpose: string;

  @Prop({ required: true })
  costCenter: string;

  @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] })
  status: string;
}

export const TravelRequestSchema = SchemaFactory.createForClass(TravelRequest);
