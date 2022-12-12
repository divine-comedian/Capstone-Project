import { Injectable, InjectionToken, Inject } from '@angular/core'
import { providers } from 'ethers';


export const MetamaskWeb3Provider = new InjectionToken('Metamask Web3 provider', {
    providedIn: 'root',
    factory: () => (window as any).ethereum
});


@Injectable({ providedIn: 'root' })
export class MetamaskProvider extends providers.Web3Provider {
    constructor(@Inject(MetamaskWeb3Provider) web3Provider: any) {
        super(web3Provider);
    }
};