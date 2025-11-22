import { Test, TestingModule } from '@nestjs/testing';
import { SitereviewsService } from './sitereviews.service';

describe('SitereviewsService', () => {
  let service: SitereviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SitereviewsService],
    }).compile();

    service = module.get<SitereviewsService>(SitereviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
