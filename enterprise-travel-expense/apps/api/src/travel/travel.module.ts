import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelController } from './travel.controller';
import { TravelService } from './travel.service';
import { TravelRequest, TravelRequestSchema } from './schemas/travel-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TravelRequest.name, schema: TravelRequestSchema }]),
  ],
  controllers: [TravelController],
  providers: [TravelService],
})
export class TravelModule {}
