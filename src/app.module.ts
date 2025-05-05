import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CanvaModule } from './canva/canva.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CanvaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
