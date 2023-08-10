import { Test, TestingModule } from '@nestjs/testing';
import { Album } from './album';

describe('Album', () => {
  let provider: Album;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Album],
    }).compile();

    provider = module.get<Album>(Album);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
