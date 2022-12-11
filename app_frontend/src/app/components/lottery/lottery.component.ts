import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SalesContractService } from 'src/app/services/sales-contract.service';

import saleLotteryInterface  from '../../../assets/LotteryContract.json';
import { Contract } from 'ethers';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss']
})
export class LotteryComponent implements OnInit {

  contract_addr: string | undefined | null = "";
  betPrice: number | undefined ; //getting from blockchain to test
  closingTime: number | undefined; 

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

}
