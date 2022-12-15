export const environment = {
  production: true,
  network: 'goerli',
  ALCHEMY_API_KEY: 'MwLDDsXrUc33uY_JtGf7si7uJbd0cyQy',
  ETHERSCAN_API_KEY: '14KQ8F8MHK4JDKYIVAMEJDCWF88MYIHZ8J',
  base_api_url: 'https://pixelsforpeace-api.azurewebsites.net/api',

  PINATA_API_KEY: '469203e72117b4079255',
  PINATA_API_SECRET:
    'c6344cad6363387ad37a8517b34d7f85b90ce6e47890e641c599db5f6ca668b7',
  PINATA_JWT_SECRET_ACCESS_TOKEN:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiOGJhY2JlOC02YWZjLTQ5NTUtYTU2Mi1lMWExMGVjNzRiODAiLCJlbWFpbCI6ImFybXlvZmRhMTJtbmtleXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjQ2OTIwM2U3MjExN2I0MDc5MjU1Iiwic2NvcGVkS2V5U2VjcmV0IjoiYzYzNDRjYWQ2MzYzMzg3YWQzN2E4NTE3YjM0ZDdmODViOTBjZTZlNDc4OTBlNjQxYzU5OWRiNWY2Y2E2NjhiNyIsImlhdCI6MTY3MDIxOTk3NX0.Ju75tbKh3X6WTY8xEyvGga2uumqgQuWD1-2blfyGbd0',
  PINATA_PRIVATE_GATEWAY:
    'https://apricot-known-vicuna-552.mypinata.cloud/ipfs/',
  PINATA_PUBLIC_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',

  salesFactoryContractAddress: '0x583349Df4dB7fbe7d08e086Fc07354C63Efd0e4A', //sales factory contract  for Lottery and Auction contract creation
  salesTokenContractAddress: '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60', //DAI style token, just sets a default in UI. User can change to another form of payment
};
