
import { Component } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import { SalesContractService } from "./services/sales-contract.service";

import salesContractInterface  from '../assets/SalesContractHere.json'; //Lottery/Auction
import salesFactoryContractInterface  from '../assets/SalesFactoryContractHere.json'; //Factory

const SALES_FACTORY_ADDRESS = "0x"; //move to a Service maybe?
const SALES_ADDRESS = "0x"; //move to a Service maybe?

const ALCHEMY_API_KEY="MwLDDsXrUc33uY_JtGf7si7uJbd0cyQy";
const ETHERSCAN_API_KEY="14KQ8F8MHK4JDKYIVAMEJDCWF88MYIHZ8J";
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
  title = 'Test Routing';
  //someRootVar = 'SharedRootVar';
  provider: ethers.providers.BaseProvider | undefined;
  signer: ethers.Signer | undefined;
  walletAddress: string | undefined;
  salesFactoryContract: ethers.Contract | undefined;
  salesContract: ethers.Contract | undefined;
  lastNetworkBlock: number | undefined; //remove this later, just testing connecting to Goerli

  constructor(
    private salesContractService: SalesContractService
  ) {
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

    //this.updateBlockchainInfo();
    //setInterval( this.updateBlockchainInfo.bind(this), 5000);
  }

}



