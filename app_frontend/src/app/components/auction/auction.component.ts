import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SalesContractService } from 'src/app/services/sales-contract.service';

import saleAuctionInterface  from '../../../assets/Auction.json';
import saleTokenInterface  from '../../../assets/IERC20.json';

import { BigNumber, Contract, ethers } from 'ethers';
@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit {

  contract_addr: string | undefined | null = "";
  auctionOpen: boolean | undefined;  
  highestBid: number | undefined ; //getting from blockchain to test
  highestBidder: string | undefined ; 
  closingTime: number | undefined; 
  closingTimeDateLocalized: Date | undefined;
  paymentToken: string | undefined;
  tokenBalance: number | undefined;
  tokenBalanceSmallerUnits:  number | undefined;
  tokenBalanceOfContract: number | undefined;
  tokenBalanceOfContractSmallerUnits:  number | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private salesContractService: SalesContractService
  ) {}
  ngOnInit(): void {
    //this.getContractAddress();
    this.activatedRoute.params.subscribe(({ contract_addr }) =>{
      this.getContractAddress()
      if( this.contract_addr ) {
        //const contract: Contract = SalesContractService.getContract( this.contract_addr, saleLotteryInterface.abi, false  );
        //const contract: Promise<Contract> = this.salesContractService.getLotteryInfoBetPrice(this.contract_addr);

        this.salesContractService.getAuctionInfoHighestBid(this.contract_addr, saleAuctionInterface, true).then((x:number)=>{
          console.log('On Auction component page, highest bid is:'+ x );
          this.highestBid = x;
        });
        this.salesContractService.getAuctionInfoHighestBidder(this.contract_addr, saleAuctionInterface, true).then((x:string)=>{
          console.log('On Auction component page, highest bidder is:'+ x );
          this.highestBidder = x;
        });
        this.salesContractService.getAuctionInfoClosingTime(this.contract_addr, saleAuctionInterface, true).then((x:number)=>{
          console.log('On Auction component page, closingTime is:'+ x );
          this.closingTime = x;
          this.closingTimeDateLocalized = new Date ( x * 1000 ); //convert seconds to  milliseconds
        });
        this.salesContractService.getAuctionInfoAuctionOpen(this.contract_addr, saleAuctionInterface, true).then((x:boolean)=>{
          console.log('On Auction component page, auctionOpen is:'+ x );
          this.auctionOpen = x;
        });
        
        this.salesContractService.getAuctionInfoPaymentToken(this.contract_addr, saleAuctionInterface, true).then((x:string)=>{
          console.log('On Auction component page, ownerPool is:'+ x );
          this.paymentToken = x;
          if(this.paymentToken) {
            this.salesContractService.getAuctionTokenBalance(this.paymentToken, saleTokenInterface, true).then((x:number)=>{
              console.log('On Auction component page, get auction token balance:'+ x );
              //console.log( tokenBalanceBigNumber );
              //console.log( ethers.utils.formatEther(tokenBalanceBigNumber) );
              this.tokenBalance = parseFloat( ethers.utils.formatUnits(x, 18) ); //TODO: double-check units for this token are 18
              this.tokenBalanceSmallerUnits = parseFloat( x.toString() );
            });

            if(this.contract_addr) {
              this.salesContractService.getAuctionTokenBalanceOfContract(this.paymentToken, this.contract_addr, saleTokenInterface, true).then((x:number)=>{
                console.log('On Lottery component page, get auction token balance of Auction Contract:'+ x );
                //console.log( tokenBalanceBigNumber );
                //console.log( ethers.utils.formatEther(tokenBalanceBigNumber) );
                this.tokenBalanceOfContract = parseFloat( ethers.utils.formatUnits(x, 18) ); //TODO: double-check units for this token are 18
                this.tokenBalanceOfContractSmallerUnits = parseFloat( x.toString() );
              });
            }

          }
        });

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

  bid (bid_price:string){
    console.log('auction.bid()');
    if(this.contract_addr && this.paymentToken) {
      this.salesContractService.postAuctionBid(this.contract_addr, saleAuctionInterface, this.paymentToken, saleTokenInterface, parseInt( bid_price ), true).then((x:string)=>{
        console.log('bid transaction done:'+ x);
        alert('You have bid successfully!');
      });
    }
  }
  withdraw(){
    console.log('auction.bid()');
    if(this.contract_addr) {
      this.salesContractService.postWithdrawBid(this.contract_addr, saleAuctionInterface, true).then((x:string)=>{
        console.log('bid transaction done:'+ x);
        alert('You have withdraw your bid successfully!');
      });
    }
  }

}
