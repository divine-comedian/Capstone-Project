// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ALCHEMY_API_KEY : "MwLDDsXrUc33uY_JtGf7si7uJbd0cyQy",
  ETHERSCAN_API_KEY: "14KQ8F8MHK4JDKYIVAMEJDCWF88MYIHZ8J",
  lotteryContractAddress: "0x0a56d575cCDD80fC007C872352aa2316F4E39325",  //just testing to see if can access already deployed contract via Service
  lotteryTokenContractAddress: "0xb5c7509A14b3e84C2A2D6B7D38024De23ee77904", //just testing to see if can access already deployed contract via Service
  salesFactoryContractAddress: "0x123",
  salesTokenContractAddress: "0x456",
  saleLotteryContractAddress: "0x789",
  saleAuctionContractAddress: "0x012",
  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
