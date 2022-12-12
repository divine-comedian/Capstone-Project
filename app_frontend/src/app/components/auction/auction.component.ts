import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit {

  contract_addr: string | undefined | null = "";
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}
  ngOnInit(): void {
    //this.getContractAddress();
    this.activatedRoute.params.subscribe(({ contract_addr }) =>this.getContractAddress());
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
