import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesMongoService {

  constructor() { }
  
  getSalesFromMongoDB() { //change to get from MongoDB (directly or via NestJS BE service)
    return [
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
          json_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmV6hVupDrq3gsZnRv6K4kjnDPCkFhmexEWwMk4YPds1Bx',
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
          json_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmeQFj87HYb3pozsQHUKKYwRzYBbZcqfMLseNRNmSm5bVf',
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
            json_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmSTNcxELHSmezWBYn9kWCaRWKZzTbye3aeT8ivgkDmiLY',
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
          json_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmZPCFmcoe2auUK7bvVJgFU2XjE1dkw93zCc2c5egPDATx',
          image_ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmWs9Lmeyx6kUw72FniSpzYejJgGs2GXn8ex6tY7Txokv2'
  
      },


        

      
      /*,
      {
          sale_contract_addr: '0x89cADf11cb79f5eAf0E37D0Ad2f82023CE63F67e',
          name_of_sale: 'Sale #2',
          type_of_sale: 'auction',
          description: 'This is Sale#2 ...',
          recipient: {
              recipient_name: 'Foundation#2',
              recipient_desc: 'This is another great foundation we are donated proceeds to.',
              recipient_addr: '0x0000000000000000000000000000000000000004'
          },
          auctionOpen: true,
          auctinClosingTime: new Date('2022-12-25 23:00:00'),
          startingBid: 100,
          highestBidder: '0x0000000000000000000000000000000000000005',
          highestBid:    100,
          ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmZZxTm4JBtkNp9cVGbYL9LgYARARvRWEekrpQLAgAanPN'
      },
      */
      
    ];
  }
}
