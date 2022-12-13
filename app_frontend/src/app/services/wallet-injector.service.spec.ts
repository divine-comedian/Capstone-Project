import { TestBed } from '@angular/core/testing';

import { WalletInjectorService } from './wallet-injector.service';

describe('WalletInjectorService', () => {
  let service: WalletInjectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WalletInjectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
