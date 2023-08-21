import { Test, TestingModule } from '@nestjs/testing';
import { Favorites } from './favorites';

describe('Favorites', () => {
  let provider: Favorites;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Favorites],
    }).compile();

    provider = module.get<Favorites>(Favorites);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
