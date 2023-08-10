import { Test, TestingModule } from '@nestjs/testing';
import { Track } from './track';

describe('Track', () => {
  let provider: Track;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Track],
    }).compile();

    provider = module.get<Track>(Track);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
