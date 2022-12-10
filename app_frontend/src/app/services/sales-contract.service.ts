import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
//import { LotteryContract } from '../contracts/OrigLotteryContract';
//import { LotteryTokenContract } from '../contracts/OrigLotteryTokenContract';

///import { SalesFactoryContract } from '../contracts/SalesFactoryContract';
import salesFactoryContractInterface from '../../assets/SalesFactoryContract.json';


@Injectable({
  providedIn: 'root'
})
export class SalesContractService {

  constructor() { }
  /*  
  public async createContract(){
    const contract = await GalleryService.getContract(true)
    const transaction = await contract['store'](
      title,
      fileUrl
    )
    const tx = await transaction.wait()
  }

  private static async getContract(bySigner=false) {
    const provider = await SalesContractService.getWebProvider()
    const signer = provider.getSigner()

    return new ethers.Contract(
      environment.salesFactoryContractAddress,
      salesFactoryContractInterface.abi,
      bySigner ? signer : provider,
    )//signer will let you write, vs provider just read
  }

  private static async getWebProvider(requestAccounts = true) {
    const provider: any = new ethers.providers.Web3Provider(window.ethereum, "any"); //await detectEthereumProvider()

    if (requestAccounts) {
      await provider.request({ method: 'eth_requestAccounts' })
    }

    return new ethers.providers.Web3Provider(provider)
  }
  */
}
