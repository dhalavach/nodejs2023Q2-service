import { Test, TestingModule } from '@nestjs/testing';
import { Artist } from './artist';

describe('Artist', () => {
  let provider: Artist;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Artist],
    }).compile();

    provider = module.get<Artist>(Artist);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
