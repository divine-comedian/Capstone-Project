import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
//import { SalesContractService } from 'src/app/services/sales-contract.service';
import { WalletInjectorService } from 'src/app/services/wallet-injector.service';
import { ContractService } from 'src/app/services/contract-service';

import saleAuctionInterface  from '../../../assets/Auction.json';
import saleTokenInterface  from '../../../assets/IERC20.json';

import { BigNumber, Contract, ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import axios from 'axios';
@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit {

  contract_addr: string | undefined | null = "";
  auctionContract: ethers.Contract | undefined;
  saleTokenContract: ethers.Contract | undefined;

  provider: ethers.providers.BaseProvider | undefined;
  signer: ethers.Signer | undefined;
  walletAddress: string | undefined;

  saleOwner: string | undefined;
  auctionOpen: boolean | undefined;  
  highestBid: number | undefined ; //getting from blockchain to test
  highestBid4UI: string | undefined;
  highestBidder: string | undefined ; 
  closingTime: number | undefined; 
  closingTimeDateLocalized: Date | undefined;
  paymentToken: string | undefined;
  tokenBalanceOfUser: number | undefined;
  tokenBalanceOfUserSmallerUnits:  number | undefined;
  tokenBalanceOfContract: number | undefined;
  tokenBalanceOfContractSmallerUnits:  number | undefined;
  saleWinner: string | undefined;
  intervalUpdatePage: number | ReturnType<typeof setInterval> | undefined;
  previewImage: string | undefined;
  recipient_addr: string | undefined;
  recipient_link: string | undefined;
  recipient_desc: string | undefined;
  
  showBidUI : boolean = false;
  closeAuctionUI : boolean = false;
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    //private salesContractService: SalesContractService,
    private walletInjectorService: WalletInjectorService,
    private contractService: ContractService
  ) {}
  async ngOnInit() { //made async and removed :void
    //this.getContractAddress();
    this.provider = this.walletInjectorService.getProvider(); //read provider
    if( this.walletInjectorService.getSigner() ) {
      this.provider = this.walletInjectorService.getProvider(); //read+write provider
      this.signer   = this.walletInjectorService.getSigner();
      if(this.signer){
        this.walletAddress = await this.signer.getAddress();
      }
    } //else leave as undefined so we can tell user they need to connect


    this.activatedRoute.params.subscribe(({ contract_addr }) =>{
      this.getContractAddress()
      if( this.contract_addr ) {

        this.getInfoFromMongoDB();


        if(this.contract_addr && this.provider ) {
            const bySigner = this.signer ? true : false;
            const auctionContract = ContractService.getContract(this.provider, this.signer, saleAuctionInterface.abi, contract_addr, bySigner);
            this.auctionContract = auctionContract;            

            this.contractService.getAuctionInfoGeneral( auctionContract ).then((x)=>{
              console.log(x);
              this.saleOwner = x.saleOwner;
              this.highestBid = x.highestBid;
              this.highestBid4UI = ethers.utils.formatUnits( x.highestBid , 18 );
              this.highestBidder = x.highestBidder;
              this.auctionOpen = x.auctionOpen;
              //this.saleWinner = x.saleWinner;
              this.closingTime = x.auctionClosingTime.toNumber();;
              this.closingTimeDateLocalized = new Date ( x.auctionClosingTime * 1000 ); //convert seconds to  milliseconds              

              const nowDate = new Date();
              const now_converted_to_seconds_after_epoch = nowDate.getTime() / 1000;
              if(this.auctionOpen && this.closingTime && (this.closingTime > now_converted_to_seconds_after_epoch)) {
                this.showBidUI = true;
              } else {
                this.showBidUI = false;
              }
              if(this.auctionOpen && this.closingTime && (this.closingTime < now_converted_to_seconds_after_epoch)) {
                this.closeAuctionUI = true;
              } else {
                this.closeAuctionUI = false;
              }
              

              this.paymentToken = x.paymentToken;
              let saleTokenContract;
              if (this.provider && this.paymentToken) { //only need signer for finding your balance vs contract's balance
                saleTokenContract = ContractService.getContract(this.provider, this.signer, saleTokenInterface.abi, this.paymentToken, bySigner);
              
                this.saleTokenContract = saleTokenContract;
                if(saleTokenContract && this.contract_addr) {
                  this.contractService.getInfoSalesToken( saleTokenContract, this.contract_addr, 'LotteryContract' ).then((x)=>{
                    this.tokenBalanceOfContract = parseFloat( ethers.utils.formatUnits(x, 18) ); //TODO: double-check units for this token are 18
                    this.tokenBalanceOfContractSmallerUnits = parseFloat( x.toString() );              
                  });
                  
                  if(this.signer && this.walletAddress){//have user's address so can get their balance as well
                    const wallet_addr = this.walletAddress; //why can't i put await this.signer.getAddress() ???
                    //const wallet_addr = await this.signer.getAddress();
                    this.contractService.getInfoSalesToken( saleTokenContract, this.walletAddress, 'User' ).then((x)=>{
                      this.tokenBalanceOfUser = parseFloat( ethers.utils.formatUnits(x, 18) ); //TODO: double-check units for this token are 18
                      this.tokenBalanceOfUserSmallerUnits = parseFloat( x.toString() );
                    });
                  }                  
                }
              }

            });
            //any on events needed here?
            //{ betsOpen, betPrice, lotteryClosingTime, ownerPool, paymentToken, lotteryTokenBalance, lotteryTokenBalanceOfContract };
        }

        this.intervalUpdatePage = window.setInterval( ()=>{this.updatePage();} , 1000);
      }
    });
    /* alternate way
    this.activatedRoute.paramMap
      .subscribe( (params) => {
          this.contract_addr = params.get('contract_addr');
          console.log(params);
    });
    */
  }
  getContractAddress() {
    const contract_addr = this.activatedRoute.snapshot.paramMap.get('contract_addr');
    //if(contract_addr===null) { this.contract_addr = ""};

    this.contract_addr = contract_addr;
  }
  async updatePage (){    
    console.log('updatePage');
    if( !this.signer && this.walletInjectorService.getSigner() ) { //figure out how to do this once vs every second, as I also want to replace the auctionContractWithoutSinger with auctionContractWITHSinger if they just connected
      console.log('updatePage, user just signed in, set this.signer');
      this.provider = this.walletInjectorService.getProvider(); //read+write provider
      this.signer   = this.walletInjectorService.getSigner();
      if(this.contract_addr && this.provider && this.signer){
        this.walletAddress = await this.signer.getAddress();

        const bySigner = this.signer ? true : false;
        const auctionContract = ContractService.getContract(this.provider, this.signer, saleAuctionInterface.abi, this.contract_addr, bySigner);
        this.auctionContract = auctionContract; //can write now since has signer
        
        //get this.saleTokenContract later because ... dependant on data
      }
    }
    
    if(this.provider && this.auctionContract) { //if signer is available now, look at updated data 
      const bySigner = this.signer ? true : false;
      const x = this.contractService.getAuctionInfoGeneral( this.auctionContract ).then((x)=>{
        //console.log(x);
        this.saleOwner = x.saleOwner;
        this.highestBid = x.highestBid;
        this.highestBid4UI = ethers.utils.formatUnits( x.highestBid , 18 );
        this.highestBidder = x.highestBidder;
        this.auctionOpen = x.auctionOpen;
        this.saleWinner = x.saleWinner;
        this.closingTime = x.auctionClosingTime.toNumber();;
        this.closingTimeDateLocalized = new Date ( x.auctionClosingTime * 1000 ); //convert seconds to  milliseconds
        
        const nowDate = new Date();
        const now_converted_to_seconds_after_epoch = nowDate.getTime() / 1000;
        if(this.auctionOpen && this.closingTime && (this.closingTime > now_converted_to_seconds_after_epoch)) {
          this.showBidUI = true;
        }
        if(this.auctionOpen && this.closingTime && (this.closingTime < now_converted_to_seconds_after_epoch)) {
          this.closeAuctionUI = true;
        }

        //*
        this.paymentToken = x.paymentToken;
        if (this.provider && this.paymentToken) { //only need signer for finding your balance vs contract's balance
          const saleTokenContract = ContractService.getContract(this.provider, this.signer, saleTokenInterface.abi, this.paymentToken, bySigner);
          this.saleTokenContract = saleTokenContract;
  
          if(saleTokenContract && this.contract_addr) {
            this.contractService.getInfoSalesToken( saleTokenContract, this.contract_addr, 'AuctionContract' ).then((x)=>{
              this.tokenBalanceOfContract = parseFloat( ethers.utils.formatUnits(x, 18) ); //TODO: double-check units for this token are 18
              this.tokenBalanceOfContractSmallerUnits = parseFloat( x.toString() );              
            });
            
            if(this.signer && this.walletAddress){//have user's address so can get their balance as well
              const wallet_addr = this.walletAddress; //why can't i put await this.signer.getAddress() ???
              //const wallet_addr = await this.signer.getAddress();
              this.contractService.getInfoSalesToken( saleTokenContract, this.walletAddress, 'User' ).then((x)=>{
                this.tokenBalanceOfUser = parseFloat( ethers.utils.formatUnits(x, 18) ); //TODO: double-check units for this token are 18
                this.tokenBalanceOfUserSmallerUnits = parseFloat( x.toString() );
              });
            }                  
          }
        }
        //*/

      });
      //any on events needed here?
      //
    }

  }

  bid (bid_price:string){
    this.showModal();
    console.log('auction.bid()');
    if(this.auctionContract && this.saleTokenContract && this.paymentToken) {
      const bidPriceInt = parseInt(bid_price);   
      /*this.salesContractService.postAuctionBid(this.contract_addr, saleAuctionInterface, this.paymentToken, saleTokenInterface, parseInt( bid_price ), true).then((x:string)=>{
        console.log('bid transaction done:'+ x);
        alert('You have bid successfully!');
      });*/
      this.contractService.postAuctionBid( this.auctionContract, this.saleTokenContract, bidPriceInt ).then((x)=>{
        console.log('bet transaction done:'+ x);
        this.hideModal();
        alert('You have bid successfully!');

        //this.writeHighestBidToDB(bidPriceInt);
        
      }).catch((error)=>{
        this.hideModal();
        alert('An error occured! Please try again or contact our support department.')
      });
    }
  }
  withdraw(){
    this.showModal();
    console.log('auction.bid()');
    if(this.auctionContract && this.contract_addr) {
      /*this.salesContractService.postWithdrawBid(this.contract_addr, saleAuctionInterface, true).then((x:string)=>{
        console.log('bid transaction done:'+ x);
        alert('You have withdraw your bid successfully!');
      });*/
      this.contractService.postAuctionClose( this.auctionContract).then((x)=>{
        console.log('bet transaction done:'+ x);
        this.hideModal();
        alert('You have closed auction successfully!');
      }).catch((error)=>{
        this.hideModal();
        alert('An error occured! Please try again or contact our support department.')
      });
    }
  }
  closeAuction() {
    this.showModal();
    if(this.contract_addr && this.auctionContract) {
      this.contractService.postAuctionClose(this.auctionContract).then((x)=>{
        console.log('bet transaction done:'+ x);
        this.hideModal();
        alert('You have closed lottery successfully!');
      }).catch((error)=>{
        this.hideModal();
        alert('An error occured! Please try again or contact our support department.')
      });
    }
  }

  async getInfoFromMongoDB(){
    const response = await axios({
      method: "get",
      url: environment.base_api_url + "/sales/"+ this.contract_addr,
      headers: {
          "Content-Type": "application/json"
      },
    });

    this.previewImage = response.data.image_ipfs_url; 
    this.recipient_addr = response.data.recipient.recipient_addr;
    this.recipient_link = response.data.recipient.recipient_link;
    this.recipient_desc = response.data.recipient.recipient_desc;

    //console.log(response.data.image_ipfs_url);
    //console.log(response[0].name_of_sale);
    //return response.data.image_ipfs_url;
  }
  /*
  when Paul gets Patch working then this updates the highest bid in db
   async writeHighestBidToDB(bidPriceInt:number){
    console.log('writeToDB');

    const update_bid_json = {"highest_bid":  bidPriceInt };
    const resFile = await axios({
      method: "patch",
      url: environment.base_api_url +'/sales/'+ this.contract_addr,
      data: update_bid_json,
      headers: {
          "Content-Type": "application/json"
      },
    });

  }
  */

  showModal(){
    const spinner = document.getElementById('spinner-super-wrapper');
    if(spinner) { spinner.style.display = 'block'; }  
    //setTimeout( ()=>{const spinner = document.getElementById('spinner-super-wrapper'); if(spinner) { spinner.style.display = 'none'; } } , 5000)
  }
  hideModal(){
    const spinner = document.getElementById('spinner-super-wrapper');
    if(spinner) { spinner.style.display = 'none'; }  
    //setTimeout( ()=>{const spinner = document.getElementById('spinner-super-wrapper'); if(spinner) { spinner.style.display = 'none'; } } , 5000)
  }
  
  ngOndestroy() {
    console.log('Auction destroy');
    window.clearInterval(this.intervalUpdatePage);
  }
  
}
