import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SalesContractService } from 'src/app/services/sales-contract.service';

import saleLotteryInterface  from '../../../assets/Lottery.json';
import lotteryTokenInterface  from '../../../assets/LotteryToken.json';
import { BigNumber, Contract, ethers } from 'ethers';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss']
})
export class LotteryComponent implements OnInit {

  contract_addr: string | undefined | null = "";
  betsOpen: boolean | undefined;
  betPrice: number | undefined ; //getting from blockchain to test
  closingTime: number | undefined; 
  closingTimeDateLocalized: Date | undefined;
  ownerPool: number | undefined;
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
    this.activatedRoute.params.subscribe(({ contract_addr }) => {
      this.getContractAddress();
      if( this.contract_addr ) {
        //const contract: Contract = SalesContractService.getContract( this.contract_addr, saleLotteryInterface.abi, false  );
        //const contract: Promise<Contract> = this.salesContractService.getLotteryInfoBetPrice(this.contract_addr);

        this.salesContractService.getLotteryInfoBetPrice(this.contract_addr, saleLotteryInterface, true).then((x:number)=>{
          console.log('On Lottery component page, bet price is:'+ x );
          this.betPrice = x;
        });
        this.salesContractService.getLotteryInfoClosingTime(this.contract_addr, saleLotteryInterface, true).then((x:number)=>{
          console.log('On Lottery component page, closingTime is:'+ x );
          this.closingTime = x;
          this.closingTimeDateLocalized = new Date ( x * 1000 ); //convert seconds to  milliseconds
        });
        this.salesContractService.getLotteryInfoBetsOpen(this.contract_addr, saleLotteryInterface, true).then((x:boolean)=>{
          console.log('On Lottery component page, betsOpen is:'+ x );
          this.betsOpen = x;
        });
        this.salesContractService.getLotteryInfoOwnerPool(this.contract_addr, saleLotteryInterface, true).then((x:number)=>{
          console.log('On Lottery component page, ownerPool is:'+ x );
          this.ownerPool = x;
        });
        this.salesContractService.getLotteryInfoPaymentToken(this.contract_addr, saleLotteryInterface, true).then((x:string)=>{
          console.log('On Lottery component page, ownerPool is:'+ x );
          this.paymentToken = x;
          if(this.paymentToken) {
            this.salesContractService.getLotteryTokenBalance(this.paymentToken, lotteryTokenInterface, true).then((x:number)=>{
              console.log('On Lottery component page, get lottery token balance:'+ x );
              //console.log( tokenBalanceBigNumber );
              //console.log( ethers.utils.formatEther(tokenBalanceBigNumber) );
              this.tokenBalance = parseFloat( ethers.utils.formatUnits(x, 18) ); //TODO: double-check units for this token are 18
              this.tokenBalanceSmallerUnits = parseFloat( x.toString() );
            });

            if(this.contract_addr) {
              this.salesContractService.getLotteryTokenBalanceOfContract(this.paymentToken, this.contract_addr, lotteryTokenInterface, true).then((x:number)=>{
                console.log('On Lottery component page, get lottery token balance of Lottery Contract:'+ x );
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
    /* alternate way of getting param from url
    this.activatedRoute.paramMap
      .subscribe( (params) => {
          this.contract_addr = params.get('contract_addr');
          console.log(params);
    });
    */
  }
  getContractAddress() {
    const contract_addr = this.activatedRoute.snapshot.paramMap.get('contract_addr');

    this.contract_addr = contract_addr;
  }

  bet() {
    console.log('lottery.bet()');
    if(this.contract_addr && this.paymentToken) {
      this.salesContractService.postLotteryBet(this.contract_addr, saleLotteryInterface, this.paymentToken, lotteryTokenInterface, true).then((x:string)=>{
        console.log('bet transaction done:'+ x);
        alert('You have betted successfully!');
      });
    }

  }

}
