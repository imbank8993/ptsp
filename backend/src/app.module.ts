import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { StorageModule } from './storage/storage.module';
import { PtspModule } from './ptsp/ptsp.module';
import { TrackingModule } from './tracking/tracking.module';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'PTSP MAN Insan Cendekia Gowa API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('throttle.ttl'),
          limit: config.get<number>('throttle.limit'),
        },
      ],
    }),
    DatabaseModule,
    StorageModule,
    PtspModule,
    TrackingModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
