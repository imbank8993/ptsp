import { Controller, Get, Param } from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('ptsp')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('track/:tokenOrCode')
  track(@Param('tokenOrCode') tokenOrCode: string) {
    return this.trackingService.track(tokenOrCode);
  }
}
