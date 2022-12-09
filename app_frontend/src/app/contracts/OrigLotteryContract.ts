import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { Contract } from 'ethers';
//import { Provider } from '../../../core/services/tokens';
//import { Provider } from '@ethersproject/providers';

import lotteryInterface  from '../../assets/OrigLottery.json';


const LOTTERY_CONTRACT_ADDRESS       = environment.lotteryContractAddress; //just to test an already deployed contract for now
const LOTTERY_TOKEN_CONTRACT_ADDRESS = environment.lotteryTokenContractAddress;
@Injectable({
  providedIn: 'root'
})
export class LotteryContract extends Contract {

  constructor() { super(LOTTERY_CONTRACT_ADDRESS, lotteryInterface.abi); }
  /*
  constructor(provider: Provider) {
    super(LOTTERY_CONTRACT_ADDRESS, lotteryInterface.abi, provider.getSigner());
  }
  */
}