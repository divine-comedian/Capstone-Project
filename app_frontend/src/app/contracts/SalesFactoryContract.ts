import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { Contract, Signer } from 'ethers';
//import { Provider } from '../../../core/services/tokens';
//import { Provider } from '@ethersproject/providers';

import salesFactoryInterface  from '../../assets/SalesFactoryContract.json';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';


const SALES_FACTORY_CONTRACT_ADDRESS = environment.salesFactoryContractAddress;//or Lottery and Auction separate
@Injectable({
  providedIn: 'root'
})
export class SalesFactoryContract extends Contract {

  constructor() { super(SALES_FACTORY_CONTRACT_ADDRESS, salesFactoryInterface.abi); }
  //constructor(signer: Web3Provider | JsonRpcSigner) { super(SALES_FACTORY_CONTRACT_ADDRESS, salesFactoryInterface.abi, signer); }
  //Arian: i added signer above
  /*
  constructor(provider: Provider) {
    super(LOTTERY_CONTRACT_ADDRESS, lotteryInterface.abi, provider.getSigner());
  }
  */
}