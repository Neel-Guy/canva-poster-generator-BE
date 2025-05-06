import { Module } from '@nestjs/common';
import { CanvaService } from './canva.service';
import { CanvaController } from './canva.controller';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [CanvaController],
  providers: [CanvaService],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname + '-' + Date.now());
        },
      }),
    }),
  ],
})
export class CanvaModule {}
