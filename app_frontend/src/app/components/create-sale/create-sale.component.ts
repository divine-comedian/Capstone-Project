import { HttpClient } from '@angular/common/http';
import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { ethers } from 'ethers';
import { SalesContractService } from 'src/app/services/sales-contract.service';
import { ContractService } from 'src/app/services/contract-service';
import { WalletInjectorService } from 'src/app/services/wallet-injector.service';
import { environment } from 'src/environments/environment';


import salesFactoryInterface  from '../../../assets/SaleFactory.json';
    

/*
@Component({
  selector: 'app-create-sale',
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.scss']
})
export class CreateSaleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
*/

@Component({
  selector: 'app-name-editor',
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.scss']
})
export class CreateSaleComponent {

  provider: ethers.providers.BaseProvider | undefined;
  signer: ethers.Signer | undefined;
  walletAddress: string | undefined;

  created_contract_addr: string | undefined;

  constructor(
    private httpClient: HttpClient,
    private salesContractService: SalesContractService,
    private walletInjectorService: WalletInjectorService,
    private contractService: ContractService,
  ) {}

   saleForm = new FormGroup({
    sale_name: new FormControl('', [Validators.required]),
    sale_desc: new FormControl(''),
    sale_type: new FormControl('lottery', [Validators.required]), //default value of Lottery for now
    payment_token: new FormControl( environment.salesTokenContractAddress, [Validators.required]), //default value
    recipient_addr: new FormControl('', [Validators.required]), //default value      
    recipient_desc: new FormControl('', ),
    recipient_link: new FormControl('', ),
    // Reactive Form file upload
    sale_image: new FormControl('', [Validators.required]),
    sale_image_source: new FormControl('', [Validators.required]),
    closing_time: new FormControl('',  [Validators.required]), //now required on launch
    //Lottery-specific field(s)
    bet_price: new FormControl('', [Validators.required]), //since Lottery is the default, make its fields required
    //Auction-specific field(s)
    starting_bid: new FormControl('', ), //[Validators.required],
    
  });
  
  async ngOnInit() {
    this.provider = this.walletInjectorService.getProvider(); //read provider
    if( this.walletInjectorService.getSigner() ) {
      this.provider = this.walletInjectorService.getProvider(); //read+write provider
      this.signer   = this.walletInjectorService.getSigner();
      if(this.signer){
        this.walletAddress = await this.signer.getAddress();
      }
    } //else leave as undefined so we can tell user they need to connect


    setInterval( ()=>{this.updatePage();} , 1000);
  }

  async updatePage (){    
    //console.log('updatePage');
    if( this.walletInjectorService.getSigner() ) {
      //console.log(  this.walletInjectorService.getSigner()  );
      this.provider = this.walletInjectorService.getProvider(); //read+write provider
      this.signer   = this.walletInjectorService.getSigner();
      if(this.signer){
        this.walletAddress = await this.signer.getAddress();
      }
    }
  }

  onFileChange(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log('onFileChange');
      console.log(file);
      this.saleForm.patchValue({
        sale_image_source: file
      });

      //for previewing the image before upload
      const sale_image_preview: HTMLImageElement = document.getElementById('sale_image_preview') as HTMLImageElement;;
      if(sale_image_preview) {
        sale_image_preview.src = URL.createObjectURL(file);
        sale_image_preview.onload = function() {
          URL.revokeObjectURL(sale_image_preview.src); // free memory
        }
      }
    }
  }
  onRadioChange(event:any){    
    const radio_value = event.target.value;
  
    if(radio_value == 'lottery') {
      console.log('onRadioChange() lottery')
      //this.saleForm.get('bet_price')?.enable(); //enable bet price for lottery
      //this.saleForm.get('starting_bid')?.disable()      
      this.saleForm.get('bet_price')?.setValidators([Validators.required]); // 5.Set Required Validator
      this.saleForm.get('bet_price')?.updateValueAndValidity();

      this.saleForm.get('starting_bid')?.clearValidators();
      this.saleForm.get('starting_bid')?.updateValueAndValidity();
    } else if(radio_value == 'auction') {
      console.log('onRadioChange() auction')
      //this.saleForm.get('starting_bid')?.enable(); //enable starting bid for auction
      //this.saleForm.get('bet_price')?.disable();      
      this.saleForm.get('starting_bid')?.setValidators([Validators.required]); // 5.Set Required Validator
      this.saleForm.get('starting_bid')?.updateValueAndValidity();

      this.saleForm.get('bet_price')?.clearValidators();
      this.saleForm.get('bet_price')?.updateValueAndValidity();
    }
  }
  onSubmitTest(event:any) {
    console.log('form submitted; createSaleTest()');
    //console.log(this.saleForm.get('sale_name').value );//non-group way this.sale_name.value
    console.log('name: '+ this.saleForm.controls['sale_name'].value);
    console.log('desc: '+ this.saleForm.controls['sale_desc'].value);
    console.log('type: '+ this.saleForm.controls['sale_type'].value); 
    if(this.saleForm.controls['sale_type'].value == 'lottery') {
      console.log('bet_price: '+ this.saleForm.controls['bet_price'].value);
    }
    if(this.saleForm.controls['sale_type'].value == 'auction') {
      console.log('starting_bid: '+ this.saleForm.controls['starting_bid'].value);
    }
    console.log('payment_token: '+ this.saleForm.controls['payment_token'].value);
    console.log('recipient_addr: '+ this.saleForm.controls['recipient_addr'].value);
    console.log('file path: '+ this.saleForm.controls['sale_image'].value);
    console.log('file data: '+ this.saleForm.controls['sale_image_source'].value); //for uploading to IPFS/Pinata
    const nft_json_meta_data = {"hardcoded": "for_now"};    
    console.log('JSON META-DATA which will be uploaded:'+ nft_json_meta_data);

    const date_time = this.saleForm.controls['closing_time'].value;
    console.log('closing_time: '+ date_time);
    if(date_time!= null) {
      const date_time_as_date = new Date( date_time );
      const converted_to_seconds_after_epoch = date_time_as_date.getTime() / 1000;
      console.log('closing_time(converted to seconds after epoch): '+ converted_to_seconds_after_epoch); //any timezone conversion to UTC/GMT need to happen here for storage or already that way?
    }
    
  }
  onSubmit(e:any) { //real submit
    this.showModal();
    //1##################
    //IPFS upload of image
    //get hash of image
    const hash_url_w_cid = this.sendImageToIPFS().then((return_val)=>{
      if(return_val!=''){
        console.log(return_val);
        const ipfs_image_hash  = return_val;

        const ipfs_image_url = environment.PINATA_PRIVATE_GATEWAY + return_val; //or should it be ipfs url like: https://ipfs.io/ipfs/$HASH (took 10min but its also here now), note can add ?filename=preferred_download_filename.png to this url
        // or ipfs://$HASH ???: OpenSea is not clear: https://docs.opensea.io/docs/metadata-standards

        const lottery_type = this.saleForm.controls['sale_type'].value;
        const sale_name = this.saleForm.controls['sale_name'].value;
        const sale_desc = this.saleForm.controls['sale_desc'].value;
        //2##################
        //put that image hash along with rest of meta-data on this page in nft-json format
        const nft_json_meta_data = 
        {
          "name": sale_name,
          "description": sale_desc,
          "image": ipfs_image_url
        };
        //const nft_json_met_data_stringified = JSON.stringify(nft_json_meta_data);
        const hash_url_w_cid = this.sendNFTmetaDataJSONToIPFS(nft_json_meta_data).then((return_val)=>{
          if(return_val!=''){
            const ipfs_json_meta_hash  = return_val;
            const ipfs_nft_meta_url = environment.PINATA_PRIVATE_GATEWAY + return_val;
            console.log('NFT metadata JSON on IPFS (with the IPFS url inside) is here: '+ ipfs_nft_meta_url);

            //3#################
            //launchLottery or launchAuction

            let bet_price:number = 0;
            let starting_bid:number = 0;
            if(lottery_type=='lottery') {
              const bet_price_temp = this.saleForm.controls['bet_price'].value;
              if(bet_price_temp) {
                bet_price = parseInt( bet_price_temp );
              }
            } else if(lottery_type=='auction') {      
              const starting_bid_temp = this.saleForm.controls['starting_bid'].value;
              if(starting_bid_temp) {
                starting_bid = parseInt( starting_bid_temp );
              }
            }
            const payment_token = this.saleForm.controls['payment_token'].value;
            const recipient_addr = this.saleForm.controls['recipient_addr'].value;
            const recipient_desc = this.saleForm.controls['recipient_desc'].value;
            const recipient_link = this.saleForm.controls['recipient_link'].value;
            
            
            const date_time = this.saleForm.controls['closing_time'].value;
            console.log('closing_time: '+ date_time);
              if(date_time!= null) {
                const date_time_as_date = new Date( date_time );
                const converted_to_seconds_after_epoch = date_time_as_date.getTime() / 1000;
                console.log('closing_time(converted to seconds after epoch): '+ converted_to_seconds_after_epoch); //any timezone conversion to UTC/GMT need to happen here for storage or already that way?
              

              if(payment_token && recipient_addr && ipfs_nft_meta_url ) {
                if(lottery_type=='lottery' && bet_price) {
                  /*
                  const x = this.salesContractService.launchLottery(bet_price, payment_token, ipfs_nft_meta_url, recipient_addr, converted_to_seconds_after_epoch, true).then((y)=>{
                    console.log('Transaction receipt is:' + y);
                  });
                  //*/

                  //*
                  if(this.provider && this.signer ) {
                    const salesContract = ContractService.getContract(this.provider, this.signer, salesFactoryInterface.abi, environment.salesFactoryContractAddress, true);
                    this.contractService.launchLottery(salesContract, bet_price, payment_token, ipfs_nft_meta_url, recipient_addr, converted_to_seconds_after_epoch);
                             
                    salesContract.on("SaleCreated", (new_contract_addr:string, sale_type:string, saleOwner:string, uri:string) => {
                      console.log('########################## SaleCreated() emitted solidty event')
                      console.log('new_contract_addr:',new_contract_addr,',sale_type:', sale_type, ',saleOwner:', saleOwner, ',nftJsonURI:', uri);
                      this.created_contract_addr = new_contract_addr;
                      
                      this.hideModal();
                      this.writeToDB(new_contract_addr, lottery_type, {'sale_name': sale_name, 'sale_desc': sale_desc, 'bet_price':      bet_price,  'payment_token': payment_token, 'ipfs_image_hash': ipfs_image_hash, 'ipfs_image_url': ipfs_image_url, 'ipfs_nft_meta_url': ipfs_nft_meta_url, 'recipient_addr': recipient_addr, 'recipient_desc': recipient_desc, 'recipient_link': recipient_link, 'converted_to_seconds_after_epoch': converted_to_seconds_after_epoch, 'date_time_as_date': date_time_as_date});
                      salesContract.removeAllListeners("SaleCreated"); //maybe put this in destroy method, not usre
                    });

                  }
                  //*/
                  
                  //how do i get the Contract Address here, when 'on' is in salesContractService.launchLottery service
                } else if(lottery_type=='auction' && starting_bid) {
                  /*
                  const x = this.salesContractService.launchAuction(starting_bid, payment_token, ipfs_nft_meta_url, recipient_addr, converted_to_seconds_after_epoch, true).then((y)=>{
                    console.log('Transaction receipt is:' + y);
                  });
                  //*/

                  if(this.provider && this.signer ) {
                    const salesContract = ContractService.getContract(this.provider, this.signer, salesFactoryInterface.abi, environment.salesFactoryContractAddress, true);
                    this.contractService.launchAuction(salesContract, starting_bid, payment_token, ipfs_nft_meta_url, recipient_addr, converted_to_seconds_after_epoch);
                             
                    salesContract.on("SaleCreated", (new_contract_addr:string, sale_type:string, saleOwner:string, uri:string) => {
                      console.log('########################## SaleCreated() emitted solidty event')
                      console.log('new_contract_addr:',new_contract_addr,',sale_type:', sale_type, ',saleOwner:', saleOwner, ',nftJsonURI:', uri);
                      this.created_contract_addr = new_contract_addr;

                      this.hideModal();
                      this.writeToDB(new_contract_addr, lottery_type, {'sale_name': sale_name, 'sale_desc': sale_desc, 'starting_bid': starting_bid, 'payment_token': payment_token, 'ipfs_image_hash': ipfs_image_hash, 'ipfs_image_url': ipfs_image_url, 'ipfs_nft_meta_url': ipfs_nft_meta_url, 'recipient_addr': recipient_addr, 'recipient_desc': recipient_desc, 'recipient_link': recipient_link, 'converted_to_seconds_after_epoch': converted_to_seconds_after_epoch, 'date_time_as_date': date_time_as_date});
                      salesContract.removeAllListeners("SaleCreated"); //maybe put this in destroy method, not usre
                    });

                  }
                  //*/
                  
                }
              }
            }
            //4##################
            //write to MongoDB (once get contract info back)... or hardcode into the JSON array in services/sales-mongo-service

            
            //5##################
            //confirmation page with contract address listed and IPFS image link and IPFS .json link
          }
        });


      } else {
        this.hideModal();
        alert('error, no ipfs url?');
        console.log('no ipfs url?');
        return;
      }
    }).catch((e)=>{
      this.hideModal();
      alert('general error');
      console.log('ERROR:'+ e );
      return;
    });    
    
    

   
  }

  async sendImageToIPFS()  {
    const fileImg = this.saleForm.controls['sale_image_source'].value;

    if (fileImg) {
      try {

          const formData = new FormData();
          formData.append("file", fileImg); //3rd param here if want to use a counter to like 1.png vs orig filename

          
          const resFile = await axios({
              method: "post",
              url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
              data: formData,
              headers: {
                  'pinata_api_key': environment.PINATA_API_KEY,
                  'pinata_secret_api_key': environment.PINATA_API_SECRET,
                  "Content-Type": "multipart/form-data"
              },
          });
          
          /*const resFile = this.httpClient.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData).subscribe(
            (response) => console.log(response),
            (error) => console.log(error)
          )*/

          const ImgHash = `${resFile.data.IpfsHash}`; //ipfs://
          console.log(ImgHash); 
          //Take a look at your Pinata Pinned section, you will see a new file added to you list.   
          return ImgHash;

      } catch (error) {
          console.log("Error sending File to IPFS: ")
          console.log(error)
          return "";
      }
    }
    return "";
  }

  async sendNFTmetaDataJSONToIPFS(nft_json_meta_data:any)  {
      try {

        //can post just 
        //data: nft_json_meta_data,
        //or
        //full meta-data
        //data: nft_data
        
        //let nft_data = new FormData();
        const pinataMetadata = {
          name: 'testJSONname'+ new Date().toLocaleString()
        };
        nft_json_meta_data = { pinataMetadata: pinataMetadata, pinataContent: nft_json_meta_data };
        
        
        //nft_data.append('pinataMetadata', pinataMetadata); //stringified in FormData
        //nft_data.append('pinataContent', nft_json_meta_data); //stringified, puts with \ in pinata, without makes just [Object]
        

        const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            data: nft_json_meta_data,
            headers: {
                'pinata_api_key': environment.PINATA_API_KEY,
                'pinata_secret_api_key': environment.PINATA_API_SECRET,
                "Content-Type": "application/json"
            },
        });


        
        /*const resFile = this.httpClient.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData).subscribe(
          (response) => console.log(response),
          (error) => console.log(error)
        )*/

        const ImgHash = `${resFile.data.IpfsHash}`; //ipfs://
        console.log(ImgHash); 
        //Take a look at your Pinata Pinned section, you will see a new file added to you list.   
        return ImgHash;

      } catch (error) {
          console.log("Error sending File to IPFS: ")
          console.log(error)
          return "";
      }
    }
    
    async writeToDB(new_contract_addr:string, lottery_type:string, obj:any) {
      console.log('writeToDB');


      //this.writeToDB(new_contract_addr, lottery_type, {'sale_name': sale_name, 'sale_desc': sale_desc, 'bet_price':      bet_price,  'payment_token': payment_token, 'ipfs_image_hash': ipfs_image_hash, 'ipfs_image_url': ipfs_image_url, 'ipfs_nft_meta_url': ipfs_nft_meta_url, 'recipient_addr': recipient_addr, 'recipient_desc': recipient_desc, 'recipient_link': recipient_link, 'converted_to_seconds_after_epoch': converted_to_seconds_after_epoch, 'date_time_as_date': date_time_as_date});
      //this.writeToDB(new_contract_addr, lottery_type, {'sale_name': sale_name, 'sale_desc': sale_desc, 'starting_bid': starting_bid, 'payment_token': payment_token, 'ipfs_image_hash': ipfs_image_hash, 'ipfs_image_url': ipfs_image_url, 'ipfs_nft_meta_url': ipfs_nft_meta_url, 'recipient_addr': recipient_addr, 'recipient_desc': recipient_desc, 'recipient_link': recipient_link, 'converted_to_seconds_after_epoch': converted_to_seconds_after_epoch, 'date_time_as_date': date_time_as_date});

      let new_sale_json:any = {};
      new_sale_json.sale_contract_addr = new_contract_addr;
      new_sale_json.type_of_sale = lottery_type;
      new_sale_json.name_of_sale = obj.sale_name;
      new_sale_json.description  = obj.sale_desc;
      const recipient:any = {};
      recipient.recipient_name = '';
      recipient.recipient_addr = obj.recipient_addr;      
      recipient.recipient_link = obj.recipient_link;
      recipient.recipient_desc = obj.recipient_desc;
      new_sale_json.recipient = recipient;
      new_sale_json.ipfs_hash = obj.ipfs_image_hash;
      new_sale_json.image_ipfs_url = obj.ipfs_image_url;
      new_sale_json.closing_time = obj.date_time_as_date;
      
      if(lottery_type=='lottery'){
        new_sale_json.bet_price = obj.bet_price; //should already be number
      } else if(lottery_type=='auction'){
        new_sale_json.starting_bid = obj.starting_bid; //should already be number
        new_sale_json.highest_bid  = 0; //maybe have 2 vars for this
      }
  
      const resFile = await axios({
        method: "post",
        url: environment.base_api_url +'/sales',
        data: new_sale_json,
        headers: {
            "Content-Type": "application/json"
        },
      });

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
  

}