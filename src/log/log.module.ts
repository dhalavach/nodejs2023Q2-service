import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { Logger } from './logging-service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [LogController],
  providers: [Logger],
  exports: [Logger],
})
export class LogModule {}
