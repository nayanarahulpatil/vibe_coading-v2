import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { TravelService } from './travel.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('travel')
@UseGuards(AuthGuard)
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Post()
  async createRequest(@Request() req, @Body() data: any) {
    const userId = req.user.sub;
    return this.travelService.createRequest(userId, data);
  }

  @Get('my-requests')
  async getMyRequests(@Request() req) {
    const userId = req.user.sub;
    return this.travelService.findMyRequests(userId);
  }
}
