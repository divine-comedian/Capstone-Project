import { Injectable } from '@angular/core';
import { ethers, Signer } from 'ethers';
import { environment } from 'src/environments/environment';
//import { LotteryContract } from '../contracts/OrigLotteryContract';
//import { LotteryTokenContract } from '../contracts/OrigLotteryTokenContract';

///import { SalesFactoryContract } from '../contracts/SalesFactoryContract';
import salesFactoryContractInterface from '../../assets/SaleFactory.json';
import lotteryContractInterface from '../../assets/Lottery.json';
import auctionContractInterface from '../../assets/Auction.json';
import { Provider } from '@ethersproject/providers';
import detectEthereumProvider from '@metamask/detect-provider';
//import { SalesFactoryContract } from '../contracts/SalesFactoryContract';


@Injectable({
  providedIn: 'root'
})
export class SalesContractService {

  public provider: Provider | undefined;
  public signer: Signer | undefined;

  constructor() { }

  private static async getContract(contract_addr:string, jsonInterfaceABI:any, bySigner=false) {
    const provider = await this.getWebProvider(true); //true or false?
    const signer = provider.getSigner();

    const wallet_addr = (await signer.getAddress());
    console.log('Your address for contract connection is: '+ wallet_addr);
    //this.provider = provider;
    //this.signer = signer;

    //const lotteryContract = new ethers.Contract( "0x85bc5257EBCb612bb552B8DF2645F17FE5C80845", lotteryContractInterface.abi, signer);
    //const betPrice1 = await lotteryContract['betPrice']();
    //console.log('inside getcontract:'+ betPrice1);

    return new ethers.Contract(
      contract_addr, //make re-usable otehr contracts can maybe call this class //environment.salesFactoryContractAddress,
      jsonInterfaceABI, //make re-usable otehr contracts can maybe call this class //salesFactoryContractInterface.abi,
      bySigner ? signer : provider,
    );
    
    //couldn't get working, return new SalesFactoryContract(bySigner ? signer : provider);
  }

  private static async getWebProvider(requestAccounts = true) {
    //const provider: any =  new ethers.providers.Web3Provider(window.ethereum, "any"); //await detectEthereumProvider()
    const provider: any = await detectEthereumProvider(); //plugin I saw to make smoother with all plugins including metamask

    if (requestAccounts) {
      await provider.request({ method: 'eth_requestAccounts' });
    }

    return new ethers.providers.Web3Provider(provider);
  }

  //Lottery specific
  public async getLotteryInfoBetsOpen(lottery_addr:string, json_interface:any, bySigner:boolean): Promise<boolean> {
    console.log('########################## inside getLotteryInfoBetsOpen()');
    console.log(lottery_addr, json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( lottery_addr, json_interface.abi, bySigner );
  
    return await contract['betsOpen']();
  }
  public async getLotteryInfoBetPrice(lottery_addr:string, json_interface:any, bySigner:boolean): Promise<number> {
    console.log('########################## inside getLotteryInfoBetPrice()');
    console.log(lottery_addr, json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( lottery_addr, json_interface.abi, bySigner );
  
    return await contract['betPrice']();
  }
  public async getLotteryInfoClosingTime(lottery_addr:string, json_interface:any, bySigner:boolean): Promise<number> {
    console.log('########################## inside getLotteryInfoClosingTime()');
    console.log(lottery_addr, json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( lottery_addr, json_interface.abi, bySigner );
  
    return await contract['lotteryClosingTime']();
  }
  public async getLotteryInfoOwnerPool(lottery_addr:string, json_interface:any, bySigner:boolean): Promise<number> {
    console.log('########################## inside getLotteryInfOwnerPool()');
    console.log(lottery_addr, json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( lottery_addr, json_interface.abi, bySigner );
  
    return await contract['ownerPool']();
  }

  //Auction specific
  public async getAuctionInfoAuctionOpen(lottery_addr:string, json_interface:any, bySigner:boolean): Promise<boolean> {
    console.log('########################## inside getAuctionInfoAuctionOpen()');
    console.log(lottery_addr, json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( lottery_addr, json_interface.abi, bySigner );
  
    return await contract['auctionOpen']();
  }
  public async getAuctionInfoHighestBid(auction_addr:string, json_interface:any, bySigner:boolean): Promise<number> {
    console.log('########################## inside getAuctionInfoHighestBid()');
    console.log(auction_addr, json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( auction_addr, json_interface.abi, bySigner );
  
    return await contract['highestBid']();
  }
  public async getAuctionInfoHighestBidder(auction_addr:string, json_interface:any, bySigner:boolean): Promise<string> {
    console.log('########################## inside getAuctionInfoHighestBidder()');
    console.log(auction_addr, json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( auction_addr, json_interface.abi, bySigner );
  
    return await contract['highestBidder']();
  }
  public async getAuctionInfoClosingTime(auction_addr:string, json_interface:any, bySigner:boolean): Promise<number> {
    console.log('########################## inside getAuctionInfoClosingTime()');
    console.log(auction_addr, json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( auction_addr, json_interface.abi, bySigner );
  
    return await contract['auctionClosingTime']();
  }

  
   
  //#######################
  public async launchLottery(bet_price:number, payment_token:string, ipfs_url:string, recipient_addr:string, converted_to_seconds_after_epoch:number, bySigner:boolean): Promise<number> {
    console.log('########################## inside launchLottery()');
    console.log(environment.salesFactoryContractAddress, salesFactoryContractInterface.abi, bySigner);
    const contract = await SalesContractService.getContract( environment.salesFactoryContractAddress, salesFactoryContractInterface.abi, bySigner );
ipfs_url

    contract.on("SaleCreated", (new_contract_addr, sale_type, saleOwner, uri) => {
      console.log('########################## SaleCreated() emitted solidty event')
      console.log('new_contract_addr:',new_contract_addr,',sale_type:', sale_type, ',saleOwner:', saleOwner, ',nftJsonURI:', uri);
      return new_contract_addr; //don't think can get to this code
    });
    try {
      const lottery_instance = await contract['launchLottery'](bet_price, payment_token, ipfs_url, recipient_addr, converted_to_seconds_after_epoch);
      return lottery_instance;
    } catch(error) {
      console.log('error:'+ error);
      return 0;
    }
    
  }
  
  public async launchAuction(starting_bid:number, payment_token:string, ipfs_url:string, recipient_addr:string, converted_to_seconds_after_epoch:number, bySigner:boolean): Promise<number> {
    console.log('########################## inside launchAuction()');
    console.log(environment.salesFactoryContractAddress, salesFactoryContractInterface.abi, bySigner);
    const contract = await SalesContractService.getContract( environment.salesFactoryContractAddress, salesFactoryContractInterface.abi, bySigner );
  
    contract.on("SaleCreated", (new_contract_addr, sale_type, saleOwner, uri) => {
      console.log('########################## SaleCreated() emitted solidty event')
      console.log('new_contract_addr:',new_contract_addr,',sale_type:', sale_type, ',saleOwner:', saleOwner, ',nftJsonURI:', uri);
      return new_contract_addr; //don't think can get to this code
    });

    try {
      const auction_instance = await contract['launchAuction']( starting_bid, payment_token, ipfs_url, recipient_addr, converted_to_seconds_after_epoch );
      return auction_instance;
    } catch(error) {
      console.log('error:'+ error);
      return 0;
    }
    

  }
  



}
