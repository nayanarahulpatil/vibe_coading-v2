import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelModule } from './travel/travel.module';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/enterprise-te'),
    UsersModule,
    AuthModule,
    TravelModule,
    ExpenseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
