import { Test, TestingModule } from '@nestjs/testing';
import { CanvaService } from './canva.service';

describe('CanvaService', () => {
  let service: CanvaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanvaService],
    }).compile();

    service = module.get<CanvaService>(CanvaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
