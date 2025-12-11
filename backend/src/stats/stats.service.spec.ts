import { Test, TestingModule } from '@nestjs/testing';
import { SellerStatsService } from './stats.service';

describe('StatsService', () => {
  let service: SellerStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerStatsService],
    }).compile();

    service = module.get<SellerStatsService>(SellerStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
