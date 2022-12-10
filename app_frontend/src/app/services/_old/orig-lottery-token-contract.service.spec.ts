import { TestBed } from '@angular/core/testing';

import { OrigLotteryTokenContractService } from './orig-lottery-token-contract.service';

describe('OrigLotteryTokenContractService', () => {
  let service: OrigLotteryTokenContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrigLotteryTokenContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
