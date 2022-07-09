import { TestBed } from '@angular/core/testing';

import { EndOfGameService } from './end-of-game.service';

describe('EndOfGameService', () => {
  let service: EndOfGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndOfGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
