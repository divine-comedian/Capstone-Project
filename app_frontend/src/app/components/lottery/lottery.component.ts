import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
//import { SalesContractService } from 'src/app/services/sales-contract.service';
import { WalletInjectorService } from 'src/app/services/wallet-injector.service';
import { ContractService } from 'src/app/services/contract-service';

import saleLotteryInterface  from '../../../assets/Lottery.json';
import saleTokenInterface  from '../../../assets/IERC20.json';

import { BigNumber, Contract, ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import axios from 'axios';

@Component({
  selector: 'app-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss']
})
export class LotteryComponent implements OnInit {

  contract_addr: string | undefined | null = "";
  lotteryContract: ethers.Contract | undefined;
  saleTokenContract: ethers.Contract | undefined;
  
  provider: ethers.providers.BaseProvider | undefined;
  signer: ethers.Signer | undefined;
  walletAddress: string | undefined;

  saleOwner: string | undefined;
  betsOpen: boolean | undefined;
  betPrice: number | undefined ; //getting from blockchain to test
  betPrice4UI: string| undefined ; //getting from blockchain to test
  closingTime: number | undefined; 
  closingTimeDateLocalized: Date | undefined;
  ownerPool: number | undefined;
  ownerPool4UI: string| undefined ; //getting from blockchain to test
  paymentToken: string | undefined;
  tokenBalanceOfUser: number | undefined;
  tokenBalanceOfUserSmallerUnits:  number | undefined;
  tokenBalanceOfContract: number | undefined;
  tokenBalanceOfContractSmallerUnits:  number | undefined;
  saleWinner: string | undefined;
  intervalUpdatePage: number | ReturnType<typeof setInterval> | undefined;
  previewImage: string | undefined;

  showBetUI : boolean = false;
  closeLotteryUI : boolean = false;

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
        
    
    this.activatedRoute.params.subscribe(({ contract_addr }) => {
      this.getContractAddress();
      if( this.contract_addr ) {
        //const contract: Contract = SalesContractService.getContract( this.contract_addr, saleLotteryInterface.abi, false  );
        //const contract: Promise<Contract> = this.salesContractService.getLotteryInfoBetPrice(this.contract_addr);

        /*
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
            this.salesContractService.getLotteryTokenBalance(this.paymentToken, saleTokenInterface, true).then((x:number)=>{
              console.log('On Lottery component page, get lottery token balance:'+ x );
              //console.log( tokenBalanceBigNumber );
              //console.log( ethers.utils.formatEther(tokenBalanceBigNumber) );
              this.tokenBalance = parseFloat( ethers.utils.formatUnits(x, 18) ); //TODO: double-check units for this token are 18
              this.tokenBalanceSmallerUnits = parseFloat( x.toString() );
            });

            if(this.contract_addr) {
              this.salesContractService.getLotteryTokenBalanceOfContract(this.paymentToken, this.contract_addr, saleTokenInterface, true).then((x:number)=>{
                console.log('On Lottery component page, get lottery token balance of Lottery Contract:'+ x );
                //console.log( tokenBalanceBigNumber );
                //console.log( ethers.utils.formatEther(tokenBalanceBigNumber) );
                this.tokenBalanceOfContract = parseFloat( ethers.utils.formatUnits(x, 18) ); //TODO: double-check units for this token are 18
                this.tokenBalanceOfContractSmallerUnits = parseFloat( x.toString() );
              });
            }

          }
        });
        */
        this.getImageFromIPFS().then((image_ipfs_url)=>{
          this.previewImage = image_ipfs_url;
        });

        if(this.contract_addr && this.provider ) {
            const bySigner = this.signer ? true : false;
            const lotteryContract = ContractService.getContract(this.provider, this.signer, saleLotteryInterface.abi, contract_addr, bySigner);
            this.lotteryContract = lotteryContract;            

            this.contractService.getLotteryInfoGeneral( lotteryContract ).then((x)=>{
              console.log(x);
              this.saleOwner = x.saleOwner;
              this.betPrice = x.betPrice;
              this.betPrice4UI = ethers.utils.formatUnits( x.betPrice , 18 );
              this.betsOpen = x.betsOpen;
              this.ownerPool = x.ownerPool;
              this.ownerPool4UI = ethers.utils.formatUnits( x.ownerPool , 18 );
              this.saleWinner = x.saleWinner;
              this.closingTime = x.lotteryClosingTime;
              this.closingTimeDateLocalized = new Date ( x.lotteryClosingTime * 1000 );

              const nowDate = new Date();
              const now_converted_to_seconds_after_epoch = nowDate.getTime() / 1000;
              if(this.betsOpen && this.closingTime && (this.closingTime > now_converted_to_seconds_after_epoch)) {
                this.showBetUI = true;
              }
              if(this.betsOpen && this.closingTime && (this.closingTime < now_converted_to_seconds_after_epoch)) {
                this.closeLotteryUI = true;
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

        this.intervalUpdatePage = window.setInterval( ()=>{this.updatePage();} , 30000);
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
  async updatePage (){    
    console.log('updatePage');
    if( !this.signer && this.walletInjectorService.getSigner() ) { //figure out how to do this once vs every second, as I also want to replace the lotteryContractWithoutSinger with lotteryContractWITHSinger if they just connected
      console.log('updatePage, user just signed in, set this.signer');
      this.provider = this.walletInjectorService.getProvider(); //read+write provider
      this.signer   = this.walletInjectorService.getSigner();
      if(this.contract_addr && this.provider && this.signer){
        this.walletAddress = await this.signer.getAddress();

        const bySigner = this.signer ? true : false;
        const lotteryContract = ContractService.getContract(this.provider, this.signer, saleLotteryInterface.abi, this.contract_addr, bySigner);
        this.lotteryContract = lotteryContract; //can write now since has signer
        
        //get this.saleTokenContract later because ... dependant on data
      }
    }
    
    if(this.provider && this.lotteryContract) { //if signer is available now, look at updated data 
      const bySigner = this.signer ? true : false;
      const x = this.contractService.getLotteryInfoGeneral( this.lotteryContract ).then((x)=>{
        //console.log(x);
        this.saleOwner = x.saleOwner;
        this.betPrice = x.betPrice; //if 4 DAI then this is 4 x 10^18 DAI
        this.betPrice4UI = ethers.utils.formatUnits( x.betPrice , 18 );
        this.betsOpen = x.betsOpen;
        this.ownerPool = x.ownerPool;
        this.ownerPool4UI = ethers.utils.formatUnits( x.ownerPool , 18 );
        this.saleWinner = x.saleWinner;
        this.closingTime = x.lotteryClosingTime;
        this.closingTimeDateLocalized = new Date ( x.lotteryClosingTime * 1000 );
        
        const nowDate = new Date();
        const now_converted_to_seconds_after_epoch = nowDate.getTime() / 1000;
        if(this.betsOpen && this.closingTime && (this.closingTime > now_converted_to_seconds_after_epoch)) {
          this.showBetUI = true;
        }
        if(this.betsOpen && this.closingTime && (this.closingTime < now_converted_to_seconds_after_epoch)) {
          this.closeLotteryUI = true;
        }

        //*
        this.paymentToken = x.paymentToken;
        if (this.provider && this.paymentToken) { //only need signer for finding your balance vs contract's balance
          const saleTokenContract = ContractService.getContract(this.provider, this.signer, saleTokenInterface.abi, this.paymentToken, bySigner);
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
        //*/

      });
      //any on events needed here?
      //{ betsOpen, betPrice, lotteryClosingTime, ownerPool, paymentToken, lotteryTokenBalance, lotteryTokenBalanceOfContract };
    }

  }

  bet() {
    this.showModal();
    console.log('lottery.bet()');
    if(this.contract_addr && this.lotteryContract && this.saleTokenContract && this.paymentToken && this.betPrice) {
      /*this.salesContractService.postLotteryBet(this.contract_addr, saleLotteryInterface, this.paymentToken, saleTokenInterface, this.betPrice, true).then((x:string)=>{
        console.log('bet transaction done:'+ x);
        alert('You have betted successfully!');
      });*/
      this.contractService.postLotteryBet( this.lotteryContract, this.saleTokenContract, this.betPrice ).then((x)=>{
        console.log('bet transaction done:'+ x);
        this.hideModal();
        alert('You have betted successfully!');
      }).catch((error)=>{
        this.hideModal();
        alert('An error occured! Please try again or contact our support department.')
      });
    }
  }
  betMany(numberOfBets:string) {
    this.showModal();
    console.log('lottery.bet()');
    const numberOfBetsInt = parseInt(numberOfBets);    
    if(this.contract_addr && this.lotteryContract && this.saleTokenContract && this.paymentToken && this.betPrice) {
      /*this.salesContractService.postLotteryBetMany(this.contract_addr, saleLotteryInterface, this.paymentToken, saleTokenInterface, this.betPrice, numberOfBetsInt, true).then((x:string)=>{
        console.log('bet transaction done:'+ x);
        alert('You have betted '+ numberOfBets +' times successfully!');
      });*/
      this.contractService.postLotteryBetManyTimes( this.lotteryContract,  this.saleTokenContract, this.betPrice, numberOfBetsInt).then((x)=>{
        console.log('bet transaction done:'+ x);
        this.hideModal();
        alert('You have betted successfully!');
      }).catch((error)=>{
        this.hideModal();
        alert('An error occured! Please try again or contact our support department.')
      });
    }
  }
  closeLottery() {
    this.showModal();
    if(this.contract_addr && this.lotteryContract) {
      this.contractService.postLotteryClose(this.lotteryContract).then((x)=>{
        console.log('bet transaction done:'+ x);
        this.hideModal();
        alert('You have closed lottery successfully!');
      }).catch((error)=>{
        this.hideModal();
        alert('An error occured! Please try again or contact our support department.')
      });
    }
  }

  async getImageFromIPFS(){
    return '';
    const response = await axios({
      method: "get",
      url: environment.base_api_url + "/sales/"+ this.contract_addr,
      headers: {
          "Content-Type": "application/json"
      },
    });
    console.log(response.data.image_ipfs_url);
    //console.log(response[0].name_of_sale);
    return response.data.image_ipfs_url;
  }

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
    console.log('Lottery destroy');
    window.clearInterval(this.intervalUpdatePage);
  }
  
}
