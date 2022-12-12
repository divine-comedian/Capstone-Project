// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  ALCHEMY_API_KEY : "MwLDDsXrUc33uY_JtGf7si7uJbd0cyQy",
  ETHERSCAN_API_KEY: "14KQ8F8MHK4JDKYIVAMEJDCWF88MYIHZ8J",

  PINATA_API_KEY: "469203e72117b4079255",
  PINATA_API_SECRET: "c6344cad6363387ad37a8517b34d7f85b90ce6e47890e641c599db5f6ca668b7",
  PINATA_JWT_SECRET_ACCESS_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiOGJhY2JlOC02YWZjLTQ5NTUtYTU2Mi1lMWExMGVjNzRiODAiLCJlbWFpbCI6ImFybXlvZmRhMTJtbmtleXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjQ2OTIwM2U3MjExN2I0MDc5MjU1Iiwic2NvcGVkS2V5U2VjcmV0IjoiYzYzNDRjYWQ2MzYzMzg3YWQzN2E4NTE3YjM0ZDdmODViOTBjZTZlNDc4OTBlNjQxYzU5OWRiNWY2Y2E2NjhiNyIsImlhdCI6MTY3MDIxOTk3NX0.Ju75tbKh3X6WTY8xEyvGga2uumqgQuWD1-2blfyGbd0",


  salesFactoryContractAddress: "0x650363a00584dc53c62188f41b25d0cfcd2d943d", //sales factory contract  for Lottery and Auction contract creation
  salesTokenContractAddress: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60", //DAI style token, just sets a default in UI. User can change to another form of payment
  //nftContractAddress: "", //salesFactory will create this NFT
  
  //saleLotteryContractAddress: each individual lottery will have its own addr, created by the salesFactory, so won't be global
  //saleAuctionContractAddress: each individual auction will have its own addr, created by the salesFactory, so won't be global

  /*  
  Sales Factory: 0xab666231094d404d6dafd6a1cb41cf0e1e4013b9
  DAI TOKEN: 0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60
  NFT ERC721: 0x7d1b825d65effd920c984568a0cbf2b375f14dea
  //1 deployed lottery, put in JSON loop hardcoded: 0x85bc5257EBCb612bb552B8DF2645F17FE5C80845
  */
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
