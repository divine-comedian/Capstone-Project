import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';

const ALCHEMY_API_KEY   = environment.ALCHEMY_API_KEY;
const ETHERSCAN_API_KEY = environment.ETHERSCAN_API_KEY;

@Injectable({
  providedIn: 'root'
})
export class WalletInjectorService {

  provider: ethers.providers.BaseProvider | undefined;
  signer: ethers.Signer | undefined;

  constructor() {
    const provider = ethers.getDefaultProvider("goerli", {alchemy: ALCHEMY_API_KEY, etherscan: ETHERSCAN_API_KEY}); //default provider for getting read-only data
   }

   setProvider(_provider: ethers.providers.BaseProvider) {
    this.provider = _provider; //change to signer to read AND write data
   }
   setSigner(_signer: ethers.Signer) {
    this.signer = _signer;
   }
   getProvider() {
    return this.provider;
   }
   getSigner() {
    return this.signer;
   }

}
