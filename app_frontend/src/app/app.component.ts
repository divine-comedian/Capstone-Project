
import { Component } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import { SalesContractService } from "./services/sales-contract.service";

import { environment } from 'src/environments/environment'

import salesFactoryContractInterface  from '../assets/SaleFactory.json'; //Factory
import saleTokenContractInterface  from '../assets/IERC20.json';

import auctionContractInterface  from '../assets/Auction.json'; //Lottery/Auction
import lotteryContractInterface  from '../assets/Lottery.json';


const SALES_FACTORY_ADDRESS = environment.salesFactoryContractAddress; //move to a Service maybe?

const ALCHEMY_API_KEY   = environment.ALCHEMY_API_KEY;
const ETHERSCAN_API_KEY = environment.ETHERSCAN_API_KEY;

declare global {
  interface Window {
    ethereum: any
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '';
  //someRootVar = 'SharedRootVar';
  provider: ethers.providers.BaseProvider | undefined;
  signer: ethers.Signer | undefined;
  walletAddress: string | undefined;
  salesFactoryContract: ethers.Contract | undefined;
    lotteryContract: ethers.Contract | undefined; //trying to get these to be under correct child components, but temporary adding here
    auctionContract: ethers.Contract | undefined;  //trying to get these to be under correct child components, but temporary adding here
  salesTokenContract: ethers.Contract | undefined;
  lastNetworkBlock: number | undefined; //remove this later, just testing connecting to Goerli

  constructor(
    private salesContractService: SalesContractService
  ) {
    this.title = 'Pixels for Peace NFT Project';
    const provider = ethers.getDefaultProvider("goerli", {alchemy: ALCHEMY_API_KEY, etherscan: ETHERSCAN_API_KEY});
    this.provider = provider; //maybe get a default provider so can get some meta-data initially without user connecting... like read-only info about Contracts
    this.getLastBlock(); //prove it works without MetaMask Connecting
  }

  async getLastBlock() {
    const lastBlock = await this?.provider?.getBlock("latest"); //remove this later, just testing connecting to Goerli
    console.log('last block on network is: '+ lastBlock?.number);
    this.lastNetworkBlock = lastBlock?.number;
  }
  
  async connectWallet(){
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();    
    this.signer = signer;
    this.walletAddress = await this.signer.getAddress();
    console.log("walletAddress is: "+ this.walletAddress);
    const connectedAccountAddr = await signer.getAddress();
    console.log("Account:", connectedAccountAddr);    
    

    //just a test... get most updated block after Connecting
    this.provider = provider; //ethers.getDefaultProvider("goerli", {alchemy: ALCHEMY_API_KEY, etherscan: ETHERSCAN_API_KEY});
    const lastBlock = await provider.getBlock("latest"); //remove this later, just testing connecting to Goerli
    console.log('last block on network is: '+ lastBlock.number);
    this.lastNetworkBlock = lastBlock.number;

    //this.salesFactoryContractAddress = SALES_FACTORY_ADDRESS;
    //this.salesContractAddress = SALES_ADDRESS;
    //this.salesFactoryContract = new ethers.Contract( SALES_FACTORY_ADDRESS, salesFactoryContractInterface.abi, signer);
    //this.salesContract = new ethers.Contract( SALES_ADDRESS , salesFactoryContractInterface.abi, signer); //could be hardcoded vs returning from API

    /*
    this.lotteryContract = new ethers.Contract( "0x85bc5257EBCb612bb552B8DF2645F17FE5C80845", lotteryContractInterface.abi, signer);
    const betPrice1 = await this.lotteryContract['betPrice']();
    console.log('betPrice1:'+ betPrice1 );  
    const betsOpen1 = await this.lotteryContract['betsOpen']();
    console.log('betsOpen:'+ betsOpen1 );
    const window1 = await this.lotteryContract['window']();
    console.log('window1:'+ window1 );
    const lotteryClosingTime1 = await this.lotteryContract['lotteryClosingTime']();
    console.log('lotteryClosingTime1:'+ lotteryClosingTime1 );
    */


    //this.updateBlockchainInfo();
    //setInterval( this.updateBlockchainInfo.bind(this), 5000);
  }

  createSale() {
    console.log('test');
  }

}



