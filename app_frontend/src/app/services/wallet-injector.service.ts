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
  walletConnected: boolean = false;

  constructor() {
    const provider = ethers.getDefaultProvider(environment.network, {alchemy: ALCHEMY_API_KEY, etherscan: ETHERSCAN_API_KEY}); //default provider for getting read-only data
    this.provider = provider;
   }

   setProvider(_provider: ethers.providers.BaseProvider) {
    this.provider = _provider; //change to signer to read AND write data
   }
   setSigner(_signer: ethers.Signer) {
    this.signer = _signer;
    this.walletConnected = true; //this.setWalletConnected(_bool:boolean)
   }
   setWalletConnected(_bool:boolean){
    this.walletConnected = _bool;
   }
   getProvider() {
    return this.provider;
   }
   getSigner() {
    return this.signer;
   }
   getWalletConnected(){
    return this.walletConnected;
   }
}
