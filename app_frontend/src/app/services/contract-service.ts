import { Injectable } from '@angular/core';
import { ethers, Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor() { }

  
  public static getContract(provider:Provider, signer:Signer | undefined, jsonInterfaceABI:any, contract_addr:string, bySigner=false ) {
    
    //const provider = await this.getWebProvider(true); //true or false?
    //const signer = provider.getSigner();

    //const wallet_addr = (await signer.getAddress());
    //console.log('Your address for contract connection is: '+ wallet_addr +'and connecting to:'+ contract_addr);
        
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
  /*
  //keep as a reference for now in case want to bring something like this back. for now i have simpler code in the WalletInjectorService
  private static async getWebProvider(requestAccounts = true) {
    //const provider: any =  new ethers.providers.Web3Provider(window.ethereum, "any"); //await detectEthereumProvider()
    const provider: any = await detectEthereumProvider(); //plugin I saw to make smoother with all plugins including metamask

    if (requestAccounts) {
      await provider.request({ method: 'eth_requestAccounts' });
    }

    return new ethers.providers.Web3Provider(provider);
  }
  */
  //############################################################################################################
  public async launchLottery(salesContract:ethers.Contract, bet_price:number, payment_token:string, ipfs_url:string, recipient_addr:string, converted_to_seconds_after_epoch:number): Promise<number> {
    console.log('########################## inside launchLottery()');    
    try {
      const bet_price_times_10_x_18  = ethers.utils.parseUnits( bet_price.toString(), 18 );
      const lottery_instance = await salesContract['launchLottery']( bet_price_times_10_x_18, payment_token, ipfs_url, recipient_addr, converted_to_seconds_after_epoch );
      return lottery_instance;
    } catch(error) {
      console.log('error:'+ error);
      return 0;
    }    
  }

  
  public async launchAuction(salesContract:ethers.Contract, starting_bid:number, payment_token:string, ipfs_url:string, recipient_addr:string, converted_to_seconds_after_epoch:number): Promise<number> {
    console.log('########################## inside launchAuction()');
    try {
      const starting_bid_times_10_x_18  = ethers.utils.parseEther(starting_bid.toString());
      console.log(starting_bid_times_10_x_18)
      const auction_instance = await salesContract['launchAuction']( starting_bid_times_10_x_18, payment_token, ipfs_url, recipient_addr, converted_to_seconds_after_epoch );
      return auction_instance;
    } catch(error) {
      console.log('error:'+ error);
      return 0;
    }
  }
  public async postLotteryClose(lotteryContract:ethers.Contract){
    console.log('########################## inside postLotteryClose()');
  
    const allowTx = await lotteryContract["closeLottery"]();
    const receipt = await allowTx.wait();

    return receipt.transactionHash;
  }
  public async postAuctionClose(auctionContract:ethers.Contract){
    console.log('########################## inside postAuctionClose()');
  
    const allowTx = await auctionContract["end"]();
    const receipt = await allowTx.wait();

    return receipt.transactionHash;
  }
  

  //###############################################################################################################################
  public async getInfoSalesToken(saleTokenContract:ethers.Contract, wallet_addr:string, wallet_desc:string ){
    //wallet_addr = await saleTokenContract.signer.getAddress();//popup will prob come up, until we can re-use signer
    const balance = await saleTokenContract["balanceOf"](wallet_addr); //this.walletAddress
    //console.log(`The Token balance for ${wallet_desc} wallet ${wallet_addr} is ${balance}`);

    return balance;
  }
  //############################################################################################################
  //Lottery specific

  public async getLotteryInfoGeneral(lotteryContract:ethers.Contract ){
    const saleOwner = await lotteryContract['saleOwner'](); //boolean
    const betsOpen = await lotteryContract['betsOpen'](); //boolean
    const betPrice = await lotteryContract['betPrice'](); //number
    const lotteryClosingTime = await lotteryContract['lotteryClosingTime'](); //number
    const ownerPool = await lotteryContract['ownerPool'](); //number
    const paymentToken = await lotteryContract['paymentToken'](); //string
    let saleWinner = '';
    if(!betsOpen) {
      try {
        saleWinner = await lotteryContract['saleWinner'](); //string
      } catch (error) {
        console.log(error)
      }
    }

    return { saleOwner, betsOpen, betPrice, lotteryClosingTime, ownerPool, paymentToken, saleWinner };
    //return { betsOpen, betPrice, lotteryClosingTime, ownerPool, paymentToken };
  }
  public async getAuctionInfoGeneral(auctionContract:ethers.Contract ){
    const saleOwner = await auctionContract['saleOwner'](); //boolean
    const highestBid = await auctionContract['highestBid'](); //boolean
    const highestBidder = await auctionContract['highestBidder'](); //number
    const auctionClosingTime = await auctionContract['auctionClosingTime'](); //number
    const auctionOpen = await auctionContract['auctionOpen'](); //number
    const paymentToken = await auctionContract['paymentToken'](); //string
    let saleWinner = '';
    if(!auctionOpen) {
      try {
        saleWinner = await auctionContract['saleWinner'](); //string
      } catch (error) {
        console.log(error)
      }
    }

    return { saleOwner, highestBid, highestBidder, auctionClosingTime, auctionOpen, paymentToken, saleWinner };
    //return { highestBid, highestBidder, auctionClosingTime, auctionOpen, paymentToken };
  }
  public async postLotteryBet(lotteryContract:ethers.Contract, lotteryTokenContract:ethers.Contract, bet_price:number ){
    console.log('########################## inside postLotteryBet()');

    const betPriceTimes_10_x_18 = ethers.utils.parseUnits( bet_price.toString(), 18 );
    const allowTx = await lotteryTokenContract["approve"]( lotteryContract.address, betPriceTimes_10_x_18 ); //ethers.constants.MaxUint256
    await allowTx.wait();
    const tx = await lotteryContract["bet"]();
    const receipt = await tx.wait();
    console.log(`Bets placed (${receipt.transactionHash})\n`);
    return receipt.transactionHash;
  }
  public async postLotteryBetManyTimes(lotteryContract:ethers.Contract, lotteryTokenContract:ethers.Contract, bet_price:number, number_of_bets:number){
    console.log('########################## inside postLotteryBetMany()');

    const betPriceTimes_10_x_18 = ethers.utils.parseUnits( bet_price.toString(), 18 );
    const spending_limit = betPriceTimes_10_x_18.mul(number_of_bets);
    const allowTx = await lotteryTokenContract["approve"]( lotteryContract.address, spending_limit ); //give approval to the contract to spend up to X of your token, ethers.constants.MaxUint256
    await allowTx.wait();
    const tx = await lotteryContract["betMany"](number_of_bets);
    const receipt = await tx.wait();
    console.log(`Bets placed (${receipt.transactionHash})\n`);
    return receipt.transactionHash;
  }
  //############################################################################################################
  //Auction specific  
  
  public async postAuctionBid(lotteryContract:ethers.Contract, lotteryTokenContract:ethers.Contract, bid_price:number ){
    console.log('########################## inside postAuctionBid()');

    const bidPriceTimes_10_x_18 = ethers.utils.parseUnits( bid_price.toString(), 18 );
    const allowTx = await lotteryTokenContract["approve"]( lotteryContract.address, bid_price ); //approve contrct to spend your bid ammount (prob should change )
    await allowTx.wait();
    const tx = await lotteryContract["bid"](bid_price);
    const receipt = await tx.wait();
    console.log(`Bets placed (${receipt.transactionHash})\n`);
    return receipt.transactionHash;
  }
  public async postWithdrawAuctionBid(lotteryContract:ethers.Contract){
    console.log('########################## inside postWithdrawBid()');
  
    const allowTx = await lotteryContract["withdraw"]();
    const receipt = await allowTx.wait();

    return receipt.transactionHash;
  }
    /*
    //Auction specific
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
    public async postWithdrawBid(auction_addr:string, json_interface:any, bySigner:boolean): Promise<string> {
      console.log('########################## inside postWithdrawBid()');
      console.log(auction_addr, json_interface.abi, bySigner);
      const contract = await SalesContractService.getContract( auction_addr, json_interface.abi, bySigner );
    
      const allowTx = await contract["withdraw"]();
      const receipt = await allowTx.wait();
  
      return receipt.transactionHash;
    }
    */    



  
}
