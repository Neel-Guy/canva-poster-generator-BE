import { Test, TestingModule } from '@nestjs/testing';
import { CanvaController } from './canva.controller';
import { CanvaService } from './canva.service';

describe('CanvaController', () => {
  let controller: CanvaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CanvaController],
      providers: [CanvaService],
    }).compile();

    controller = module.get<CanvaController>(CanvaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
