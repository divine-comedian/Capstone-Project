import { TestBed } from '@angular/core/testing';

import { SalesMongoService } from './sales-mongo-service';

describe('SalesMongoService', () => {
  let service: SalesMongoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesMongoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
