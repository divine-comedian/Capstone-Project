# Pixels For Peace

Pixels For Peace is an opensource Ethereum blockchain NFT project that allows users to create unique NFTs from their image files and choose to either create an auction or a lottery for a charitable cause. 

## How it works

1. First, you need to have an Ethereum wallet that supports ERC-721 tokens, such as MetaMask.
2. Next, upload an image file via Front End. The file will be uploaded to a secure and reliable IPFS. An IPFS hash for the file will be generated.
3. The IPFS hash and CID will be used to create a unique NFT on the Ethereum blockchain.
4. Choose whether you want to create an auction or a lottery for your NFT and link a charitable cause.
5. If you choose to create an auction, set a starting price (bid) and an end time for the auction.
6. If you choose to create a lottery, set a ticket (token) price and the number of tickets that will be sold.
7. All proceeds from the auction or lottery will be donated to the charitable cause of your choice.

## Benefits of using Pixels For Peace

- Create unique and one-of-a-kind NFTs using your own images. The images are stored in a secure, reliable, decentralized IPFS.
- Support a charitable cause by donating the proceeds from your NFT sale (automated by contract).
- Use the power of the Ethereum blockchain to securely and transparently manage the sale of your NFT.

## Getting started

To get started with Pixels For Peace, you will need the following:

- An Ethereum wallet that supports ERC-721 tokens, such as MetaMask.
- Some ETH (DAI) to pay for gas fees on the Ethereum blockchain.
- An image file that you will use to create a unique NFT for a charitable cause.
- A strong intention to make good for the world.

Once you have these, you can start creating your own Pixels For Peace NFTs and supporting a good cause.

## Components

### Solidity Contracts

Pixels For Peace uses the following Solidity contracts:

1. `NFT.sol`: used to generate NFTs
2. `Auction.sol`: used to manage auctions
3. `Lottery.sol`: used to manage lotteries
4. `SaleFactory.sol`: used to create new auction or lottery contract instances for each generated NFT

### Frontend

The frontend is built with Angular (TypeScript) and provides the customer-facing interface for generating new NFTs, viewing past and current sales, and viewing a list of supported charitable causes.

### Backend

The backend is built with Nest (TypeScript) and is responsible for securely interacting with the Ethereum contracts, as well as managing the database (MongoDB).
[Backend API](https://pixelsforpeace-api.azurewebsites.net)

### tx hashes and contract addresses examples

[create voting token](https://goerli.etherscan.io/tx/0x696ec78e4f4d3d6d83ca53aedff9659a415be254a7bc4abc020e7009e050269f)

[mint some tokens](https://goerli.etherscan.io/tx/0xd02a3ae6a912324915ec4d7353895e34f43c0e663b056912535d3baf216e032c)

[create tokenized ballot](https://goerli.etherscan.io/tx/0x40304ee94a9fc44f4376cad7ab7f90fbe6f6fb794c6d8fae82003ef36343c72c)
