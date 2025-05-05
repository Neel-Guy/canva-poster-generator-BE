import { Module } from '@nestjs/common';
import { CanvaService } from './canva.service';
import { CanvaController } from './canva.controller';

@Module({
  controllers: [CanvaController],
  providers: [CanvaService],
})
export class CanvaModule {}
