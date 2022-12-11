import { HttpClient } from '@angular/common/http';
import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { SalesContractService } from 'src/app/services/sales-contract.service';
import { environment } from 'src/environments/environment';


import salesFactoryInterface  from '../../../assets/SalesFactoryContract.json';
    

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

  constructor(
    private httpClient: HttpClient,
    private salesContractService: SalesContractService
  ) {}

  saleForm = new FormGroup({
    sale_name: new FormControl('', [Validators.required]),
    sale_desc: new FormControl(''),
    sale_type: new FormControl('lottery', [Validators.required]), //default value of Lottery for now
    payment_token: new FormControl( environment.salesTokenContractAddress, [Validators.required]), //default value
    recipient_addr: new FormControl('', [Validators.required]), //default value      
    // Reactive Form file upload?, look at how to do    
    sale_image: new FormControl('', [Validators.required]),
    sale_image_source: new FormControl('', [Validators.required]),
    //Lottery-specific field(s)
    bet_price: new FormControl('', [Validators.required]), //since Lottery is the default, make its fields required
    //Auction-specific field(s)
    starting_bid: new FormControl('', ), //[Validators.required]
  });

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
  onSubmitTest() {
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
  }
  onSubmit(e:any) { //real submit
    
    //1##################
    //IPFS upload of image
    //get hash of image
    const hash_url_w_cid = this.sendImageToIPFS().then((return_val)=>{
      if(return_val!=''){
        console.log(return_val);

        const ipfs_image_url = "https://gateway.pinata.cloud/ipfs/"+ return_val; //or should it be ipfs url like: https://ipfs.io/ipfs/$HASH (took 10min but its also here now), note can add ?filename=preferred_download_filename.png to this url
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
            const ipfs_nft_meta_url = "https://gateway.pinata.cloud/ipfs/"+ return_val;
            console.log('NFT metadata JSON on IPFS (with the IPFS url inside) is here: '+ ipfs_nft_meta_url);
            
            //3#################
            //launchLottery or launchAuction

            let bet_price;
            let starting_bid;
            if(lottery_type=='lottery') {
              const bet_price_temp = this.saleForm.controls['bet_price'].value;
              if(bet_price_temp) {
                bet_price = parseInt( bet_price_temp );
              }
            } else if(lottery_type=='lottery') {      
              const starting_bid_temp = this.saleForm.controls['starting_bid'].value;
              if(starting_bid_temp) {
                starting_bid = parseInt( starting_bid_temp );
              }
            }
            const payment_token = this.saleForm.controls['payment_token'].value;
            const recipient_addr = this.saleForm.controls['recipient_addr'].value;
            
            if(payment_token && recipient_addr && ipfs_nft_meta_url ) {
              if(lottery_type=='lottery' && bet_price) {
                const x = this.salesContractService.launchLottery(bet_price, payment_token, ipfs_nft_meta_url, recipient_addr, true);
                //how do i get the Contract Address here, when 'on' is in salesContractService.launchLottery service
              } else if(lottery_type=='lottery' && starting_bid) {
                this.salesContractService.launchAuction(starting_bid, payment_token, ipfs_nft_meta_url, recipient_addr, true);
                //how do i get the Contract Address here, when 'on' is in salesContractService.launchLottery service
              }
            }
            
            //4##################
            //write to MongoDB (once get contract info back)... or hardcode into the JSON array in services/sales-mongo-service

            
            //5##################
            //confirmation page with contract address listed and IPFS image link and IPFS .json link
          }
        });


      } else {
        console.log('no ipfs url?');
        return;
      }
    }).catch((e)=>{
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
        let nft_data = new FormData();
        nft_data.append('file', nft_json_meta_data);
        const pinataMetadata = JSON.stringify({
          name: 'testJSONname'
        });
        nft_data.append('pinataMetadata', pinataMetadata);
        nft_data.append('pinataContent', nft_json_meta_data);
          
          const resFile = await axios({
              method: "post",
              url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
              data: nft_data,
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
    
 

  

}