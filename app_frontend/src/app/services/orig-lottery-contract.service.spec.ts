import { TestBed } from '@angular/core/testing';

import { OrigLotteryContractService } from './orig-lottery-contract.service';

describe('LotteryContractService', () => {
  let service: OrigLotteryContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrigLotteryContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
