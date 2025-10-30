import { Test, TestingModule } from '@nestjs/testing';
import { SitereviewsController } from './sitereviews.controller';

describe('SitereviewsController', () => {
  let controller: SitereviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SitereviewsController],
    }).compile();

    controller = module.get<SitereviewsController>(SitereviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
