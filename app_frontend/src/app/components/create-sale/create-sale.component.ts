import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

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
  onSubmit() { //real submit

  }
}