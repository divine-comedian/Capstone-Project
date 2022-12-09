import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { Contract } from 'ethers';
//import { Provider } from '../../../core/services/tokens';
//import { Provider } from '@ethersproject/providers';

import saleLotteryInterface  from '../../assets/SaleAuctionContractHere.json';


const SALES_LOTTERY_CONTRACT_ADDRESS = environment.saleLotteryContractAddress;//or Lottery and Auction separate
@Injectable({
  providedIn: 'root'
})
export class SaleLotteryContract extends Contract {

  constructor() { super(SALES_LOTTERY_CONTRACT_ADDRESS, saleLotteryInterface.abi); }
  /*
  constructor(provider: Provider) {
    super(LOTTERY_CONTRACT_ADDRESS, lotteryInterface.abi, provider.getSigner());
  }
  */
}