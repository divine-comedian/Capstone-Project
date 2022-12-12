import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SalesContractService } from 'src/app/services/sales-contract.service';

import saleAuctionInterface  from '../../../assets/Auction.json';
import { Contract } from 'ethers';
@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit {

  contract_addr: string | undefined | null = "";
  highestBid: number | undefined ; //getting from blockchain to test
  highestBidder: string | undefined ; //getting from blockchain to test
  closingTime: number | undefined; 
  closingTimeDateLocalized: Date | undefined;
  
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
          console.log('On Auction component page, highest bid is:'+ x );
          this.highestBidder = x;
        });
        this.salesContractService.getAuctionInfoClosingTime(this.contract_addr, saleAuctionInterface, true).then((x:number)=>{
          console.log('On Auction component page, closingTime is:'+ x );
          this.closingTime = x;
          this.closingTimeDateLocalized = new Date ( x * 1000 ); //convert seconds to  milliseconds
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

}
