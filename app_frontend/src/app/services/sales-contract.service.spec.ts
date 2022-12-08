import { TestBed } from '@angular/core/testing';

import { SalesContractService } from './sales-contract.service';

describe('SalesContractService', () => {
  let service: SalesContractService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesContractService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
