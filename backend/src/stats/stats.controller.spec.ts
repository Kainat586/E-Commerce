import { Test, TestingModule } from '@nestjs/testing';
import { SellerStatsController } from './stats.controller';

describe('StatsController', () => {
  let controller: SellerStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerStatsController],
    }).compile();

    controller = module.get<SellerStatsController>(SellerStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
