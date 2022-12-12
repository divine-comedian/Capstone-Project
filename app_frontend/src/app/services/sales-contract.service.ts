import { Injectable } from '@angular/core';
import { ethers, Signer } from 'ethers';
import { environment } from 'src/environments/environment';
//import { LotteryContract } from '../contracts/OrigLotteryContract';
//import { LotteryTokenContract } from '../contracts/OrigLotteryTokenContract';

///import { SalesFactoryContract } from '../contracts/SalesFactoryContract';
import salesFactoryContractInterface from '../../assets/SaleFactory.json';
import lotteryContractInterface from '../../assets/Lottery.json';
import saleTokenInterface  from '../../assets/IERC20.json';
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
  public async getLotteryInfoPaymentToken(lottery_addr:string, json_interface:any, bySigner:boolean): Promise<string> {
    console.log('########################## inside getLotteryInfoPaymentToken()');
    console.log(lottery_addr, json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( lottery_addr, json_interface.abi, bySigner );
  
    return await contract['paymentToken']();
  }
  public async getLotteryTokenBalance(lottery_token_addr:string, token_json_interface:any, bySigner:boolean): Promise<number> {
    console.log('########################## inside getLotteryInfOwnerPool()');
    console.log(lottery_token_addr, token_json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( lottery_token_addr, token_json_interface.abi, bySigner );
  
    const wallet_addr = await contract.signer.getAddress();//popup will prob come up, until we can re-use signer

    const bal = await contract["balanceOf"](wallet_addr); //this.walletAddress
    console.log(`The Lottery Token balance for wallet XYZ is ${bal}`);
    return bal;
  }
  public async getLotteryTokenBalanceOfContract(lottery_token_addr:string, lottery_contract_token_addr:string, token_json_interface:any, bySigner:boolean): Promise<number> {
    console.log('########################## inside getLotteryInfOwnerPool()');
    console.log(lottery_token_addr, token_json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( lottery_token_addr, token_json_interface.abi, bySigner );
  
    //const wallet_addr = contract.signer.getAddress();//popup will prob come up, until we can re-use signer
    const bal = await contract["balanceOf"](lottery_contract_token_addr); //this.walletAddress
    console.log(`The Lottery Token balance for wallet XYZ is ${bal}`);
    return bal;
  }
  public async postLotteryBet(lottery_addr:string, lottery_json_interface:any, payment_token_addr:string, payment_token_interface:any, bet_price:number,  bySigner:boolean): Promise<string> {
    console.log('########################## inside postLotteryBet()');
    const lottery_contract = await SalesContractService.getContract( lottery_addr, lottery_json_interface.abi, bySigner );
    const lottery_token_contract = await SalesContractService.getContract( payment_token_addr, payment_token_interface.abi, bySigner );

    const allowTx = await lottery_token_contract["approve"]( lottery_contract.address, bet_price ); //ethers.constants.MaxUint256
    await allowTx.wait();
    const tx = await lottery_contract["bet"]();
    const receipt = await tx.wait();
    console.log(`Bets placed (${receipt.transactionHash})\n`);
    return receipt.transactionHash;
  }
  public async postLotteryBetMany(lottery_addr:string, lottery_json_interface:any, payment_token_addr:string, payment_token_interface:any, bet_price:number, number_of_bets:number,  bySigner:boolean): Promise<string> {
    console.log('########################## inside postLotteryBetMany()');
    const lottery_contract = await SalesContractService.getContract( lottery_addr, lottery_json_interface.abi, bySigner );
    const lottery_token_contract = await SalesContractService.getContract( payment_token_addr, payment_token_interface.abi, bySigner );

    const spending_limit = (bet_price * number_of_bets);
    const allowTx = await lottery_token_contract["approve"]( lottery_contract.address, spending_limit ); //ethers.constants.MaxUint256
    await allowTx.wait();
    const tx = await lottery_contract["betMany"](number_of_bets);
    const receipt = await tx.wait();
    console.log(`Bets placed (${receipt.transactionHash})\n`);
    return receipt.transactionHash;
  }
  



  

  //Auction specific
  public async getAuctionInfoAuctionOpen(auction_addr:string, json_interface:any, bySigner:boolean): Promise<boolean> {
    console.log('########################## inside getAuctionInfoAuctionOpen()');
    console.log(auction_addr, json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( auction_addr, json_interface.abi, bySigner );
  
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
  public async getAuctionInfoPaymentToken(auction_addr:string, json_interface:any, bySigner:boolean): Promise<string> {
    console.log('########################## inside getAuctionInfoPaymentToken()');
    console.log(auction_addr, json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( auction_addr, json_interface.abi, bySigner );
  
    return await contract['paymentToken']();
  }
  public async getAuctionTokenBalance(auction_token_addr:string, token_json_interface:any, bySigner:boolean): Promise<number> {
    console.log('########################## inside getAuctionTokenBalance()');
    console.log(auction_token_addr, token_json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( auction_token_addr, token_json_interface.abi, bySigner );
  
    const wallet_addr = await contract.signer.getAddress();//popup will prob come up, until we can re-use signer
    //console.log('wallet_addr:'+wallet_addr);
    const bal = await contract["balanceOf"](wallet_addr); //this.walletAddress
    console.log(`The Auction Token balance for wallet XYZ is ${bal}`);
    return bal;
  }
  public async getAuctionTokenBalanceOfContract(auction_token_addr:string, auction_contract_token_addr:string, token_json_interface:any, bySigner:boolean): Promise<number> {
    console.log('########################## inside getAuctionTokenBalanceOfContract()');
    console.log(auction_token_addr, token_json_interface.abi, bySigner);
    const contract = await SalesContractService.getContract( auction_token_addr, token_json_interface.abi, bySigner );
  
    //const wallet_addr = contract.signer.getAddress();//popup will prob come up, until we can re-use signer
    const bal = await contract["balanceOf"](auction_contract_token_addr); //this.walletAddress
    console.log(`The Auction Token balance for wallet XYZ is ${bal}`);
    return bal;
  }
  public async postAuctionBid(auction_addr:string, auction_json_interface:any, payment_token_addr:string, payment_token_interface:any, bid_price:number, bySigner:boolean): Promise<string> {
    console.log('########################## inside postAuctionBid()');
    const lottery_contract = await SalesContractService.getContract( auction_addr, auction_json_interface.abi, bySigner );
    const lottery_token_contract = await SalesContractService.getContract( payment_token_addr, payment_token_interface.abi, bySigner );

    const allowTx = await lottery_token_contract["approve"]( lottery_contract.address, bid_price ); //approve contrct to spend your bid ammount (prob should change )
    await allowTx.wait();
    const tx = await lottery_contract["bid"](bid_price);
    const receipt = await tx.wait();
    console.log(`Bets placed (${receipt.transactionHash})\n`);
    return receipt.transactionHash;
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
