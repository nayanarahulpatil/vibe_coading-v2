import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { ExpenseClaim, ExpenseClaimSchema } from './schemas/expense-claim.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ExpenseClaim.name, schema: ExpenseClaimSchema }]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
