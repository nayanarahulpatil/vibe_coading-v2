import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('expense')
@UseGuards(AuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async createClaim(@Request() req, @Body() data: any) {
    const userId = req.user.sub;
    return this.expenseService.createClaim(userId, data);
  }

  @Get('my-claims')
  async getMyClaims(@Request() req) {
    const userId = req.user.sub;
    return this.expenseService.findMyClaims(userId);
  }
}
