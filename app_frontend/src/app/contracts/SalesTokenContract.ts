import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { Contract } from 'ethers';
//import { Provider } from '../../../core/services/tokens';
//import { Provider } from '@ethersproject/providers';

import salesTokenInterface  from '../../assets/LotteryToken.json';


const SALES_TOKEN_CONTRACT_ADDRESS = environment.salesTokenContractAddress;//or Lottery and Auction separate
@Injectable({
  providedIn: 'root'
})
export class SalesTokenContract extends Contract {

  constructor() { super(SALES_TOKEN_CONTRACT_ADDRESS, salesTokenInterface.abi); }
  /*
  constructor(provider: Provider) {
    super(LOTTERY_CONTRACT_ADDRESS, lotteryInterface.abi, provider.getSigner());
  }
  */
}