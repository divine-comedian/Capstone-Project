import { Injectable } from '@angular/core';
import axios from 'axios';
import { env } from 'process';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesMongoService {

  constructor() { }
  
  async getRealSalesFromMongoDB() { 
    const response = await axios({
      method: "get",
      url: environment.base_api_url + "/sales",
      headers: {
          "Content-Type": "application/json"
      },
    });
    //https://gateway.pinata.cloud/ipfs/
    console.log(response.data);
    //replace public gateway which is rate-limited to temporary private gateway
    response.data.map((sale:any)=>{
      const ipfs_image_url = sale.image_ipfs_url;
      const ipfs_cid_hash = ipfs_image_url.split(environment.PINATA_PUBLIC_GATEWAY)[1];
      const new_ipfs_image_url = environment.PINATA_PRIVATE_GATEWAY + ipfs_cid_hash;
      sale.image_ipfs_url = new_ipfs_image_url;
    });
    console.log(response.data);
    //console.log(response[0].name_of_sale);
    return response.data;
    /*
    const response = await axios.get<AxiosPromise>(environment.base_api_url + '/sales')
    console.log(response.data);
    this.sales = response.data;
    */

  }

  getMockSalesFromMongoDB() { //change to get from MongoDB (directly or via NestJS BE service)
    return [
      
      {
        sale_contract_addr: '0x1fb1E3CaF0226fDecba7d1D1924A62a03ffd0B9E',
        name_of_sale: 'ARIAN_NEW#111',
        type_of_sale: 'lottery',
        description: 'This is Sale#1 ...',
        recipient: {
            recipient_name: 'Foundation#1',
            recipient_desc: 'This is a great foundation we are donated proceeds to.',
            recipient_addr: '0xA2dd619dB59A3BDa94A39Ea3006396C7584294Ee'
        },
        closing_time: new Date('2022-06-06 6:06:06'),
        bet_price: '666',
        /*json_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmQW4ByGLohr3KsKunMK9r94XLEWUaXiWiQcfxBsCFKn2v',*/
        image_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmYLxsmiuvPSdiQ6HsDhCGQY6LUEaHSGAQ5G2uKb9UcdRb'

    },

        {
          sale_contract_addr: '0x43dE11745093C958e68a1235FF100adF0ADF5aDf',
          name_of_sale: 'ArianLottery#5',
          type_of_sale: 'lottery',
          description: 'This is Sale#5 ...',
          recipient: {
              recipient_name: 'Foundation#1',
              recipient_desc: 'This is a great foundation we are donated proceeds to.',
              recipient_addr: '0xA2dd619dB59A3BDa94A39Ea3006396C7584294Ee'
          },
          closing_time: new Date('2022-12-12 12:00:00'),
          bet_price: '111',
          /*json_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmQW4ByGLohr3KsKunMK9r94XLEWUaXiWiQcfxBsCFKn2v',*/
          image_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmYLxsmiuvPSdiQ6HsDhCGQY6LUEaHSGAQ5G2uKb9UcdRb'

      },

      {
        sale_contract_addr: '0x354Ad4A6028fE54962810125a11b6caf42BD8ECf',
        name_of_sale: 'ArianAuction#6',
        type_of_sale: 'auction',
        description: 'This is Sale#4 ...',
        recipient: {
            recipient_name: 'Foundation#4',
            recipient_desc: 'This is a great foundation we are donated proceeds to.',
            recipient_addr: '0xA2dd619dB59A3BDa94A39Ea3006396C7584294Ee'
        },
        closing_time: new Date('2022-12-12 13:30:00'),
        highestBid: '200',
        /*json_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmYTF4T6gAbJEk9bNnjxyaF9RXxyCH7rQkM4Wmu7pF726p',*/
        image_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmeQo9yVvkV8kmNYgMHT5Dznweniq4gWXti9xrLp7WxPmv'

      },




      {
        sale_contract_addr: '0xd165025Ca6a9Bb27782Fc2b8Fa3d918E6aCeBA0d',
        name_of_sale: 'ArianLottery#1',
        type_of_sale: 'lottery',
        description: 'This is Sale#1 ...',
        recipient: {
            recipient_name: 'Foundation#1',
            recipient_desc: 'This is a great foundation we are donated proceeds to.',
            recipient_addr: '0xA2dd619dB59A3BDa94A39Ea3006396C7584294Ee'
        },
        closing_time: new Date('2022-12-12 12:00:00'),
        bet_price: '111',
        /*json_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmV6hVupDrq3gsZnRv6K4kjnDPCkFhmexEWwMk4YPds1Bx',*/
        image_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmRChV22QG5CMzCHBbEPdpwyHbuMT5p972ZcranT38n6t6'

    },
    {
        sale_contract_addr: '0x36337568918e7DAa61EFA3a82DB5294711cd4F96',
        name_of_sale: 'ArianLottery#2',
        type_of_sale: 'lottery',
        description: 'This is Sale#2 ...',
        recipient: {
            recipient_name: 'Foundation#2',
            recipient_desc: 'This is a great foundation we are donated proceeds to.',
            recipient_addr: '0xA2dd619dB59A3BDa94A39Ea3006396C7584294Ee'
        },
        closing_time: new Date('2022-12-12 12:30:00'),
        bet_price: '112',
        /*json_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmeQFj87HYb3pozsQHUKKYwRzYBbZcqfMLseNRNmSm5bVf',*/
        image_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmT4MEZw1bcMHvsVHCWk7g53RbjipKNYipKS4vATJo74hu'

    },
    {
        sale_contract_addr: '0xE3aE4DEF7A355C5230ffeA7150A5aEC4f6b63EaE',
        name_of_sale: 'ArianAuction#3',
        type_of_sale: 'auction',
        description: 'This is Sale#3 ...',
        recipient: {
            recipient_name: 'Foundation#3',
            recipient_desc: 'This is a great foundation we are donated proceeds to.',
            recipient_addr: '0xA2dd619dB59A3BDa94A39Ea3006396C7584294Ee'
        },
        closing_time: new Date('2022-12-12 13:00:00'),
        highestBid: '200',
        /*json_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmSTNcxELHSmezWBYn9kWCaRWKZzTbye3aeT8ivgkDmiLY',*/
        image_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmW9nAkdaQy8c2QcawZ5DbK4XHs4L729coa4hSn4U2TWgp'

    },
    {
      sale_contract_addr: '0xf548E007beB652ba8A43c999b58D504B06bf6FF7',
      name_of_sale: 'ArianAuction#4',
      type_of_sale: 'auction',
      description: 'This is Sale#4 ...',
      recipient: {
          recipient_name: 'Foundation#4',
          recipient_desc: 'This is a great foundation we are donated proceeds to.',
          recipient_addr: '0xA2dd619dB59A3BDa94A39Ea3006396C7584294Ee'
      },
      closing_time: new Date('2022-12-12 13:30:00'),
      highestBid: '200',
      /*json_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmZPCFmcoe2auUK7bvVJgFU2XjE1dkw93zCc2c5egPDATx',*/
      image_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmWs9Lmeyx6kUw72FniSpzYejJgGs2GXn8ex6tY7Txokv2'

    },

    
    
    ];
  }
}
