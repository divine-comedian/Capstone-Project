import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'
import { Contract } from 'ethers';
//import { Provider } from '../../../core/services/tokens';

import lotteryTokenInterface  from '../../assets/OrigLotteryToken.json';

const LOTTERY_CONTRACT_ADDRESS       = environment.lotteryContractAddress; //just to test an already deployed contract for now
const LOTTERY_TOKEN_CONTRACT_ADDRESS = environment.lotteryTokenContractAddress;
@Injectable({
  providedIn: 'root'
})
export class LotteryTokenContract extends Contract {

  constructor() { super(LOTTERY_TOKEN_CONTRACT_ADDRESS, lotteryTokenInterface.abi); }
  /*
  constructor(provider: Provider) {
    super(LOTTERY_TOKEN_CONTRACT_ADDRESS, lotteryTokenInterface.abi, provider.getSigner());
  }
  */
}