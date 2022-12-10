import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesMongoService {

  constructor() { }
  
  getSalesFromMongoDB() { //change to get from MongoDB (directly or via NestJS BE service)
    return [
      {
          sale_contract_addr: '0x85bc5257EBCb612bb552B8DF2645F17FE5C80845',
          name_of_sale: 'Sale #1',
          type_of_sale: 'lottery',
          description: 'This is Sale#1 ...',
          recipient: {
              recipient_name: 'Foundation#1',
              recipient_desc: 'This is a great foundation we are donated proceeds to.',
              recipient_addr: '0x0000000000000000000000000000000000000002'
          },
          lottery_closing_time: new Date('2022-12-12 12:19:41'),
          bet_price: '100',
          ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmeqkRRhHx7z49jRLMKnrTCxrDEk8iHdbwGDuRc1KdDPK9'
  
      },
      {
          sale_contract_addr: '0x89cADf11cb79f5eAf0E37D0Ad2f82023CE63F67e',
          name_of_sale: 'Sale #2',
          type_of_sale: 'lottery',
          description: 'This is Sale#2 ...',
          recipient: {
              recipient_name: 'Foundation#2',
              recipient_desc: 'This is a great foundation we are donated proceeds to.',
              recipient_addr: '0xA2dd619dB59A3BDa94A39Ea3006396C7584294Ee'
          },
          lottery_closing_time: new Date('2022-12-12 12:19:41'),
          bet_price: '100',
          ipfs_url: 'https://gateway.pinata.cloud/ipfs/QmZZxTm4JBtkNp9cVGbYL9LgYARARvRWEekrpQLAgAanPN'
  
      }
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
