import { ethers } from "hardhat";
import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"; 
import * as dotenv from 'dotenv' 
import { Auction__factory, MyToken__factory, PixelsForPeaceNFT__factory, SaleFactory__factory } from "../typechain-types";
import { arrayify, Bytes, isBytes, keccak256, parseBytes32String } from "ethers/lib/utils";
import { saleFactorySol } from "../typechain-types/contracts";
dotenv.config()
import { BigNumberish } from "ethers";
import AuctionJson from '../artifacts/contracts/Auction.sol/Auction.json'

const auctionIface = new ethers.utils.Interface(AuctionJson.abi)


const STARTING_BID = 30;
const URI = 'QmPrXKWKzNofkgZ236iufwxk3wt9L7hh6DUhihsfMZvpcC'
const CLOSING_TIME = 1670955531
const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
const altAddress = "0x06263e1A856B36e073ba7a50D240123411501611"
const paymentToken = "0xc9269d42d7450d7c62038B301e2F9b4ed6DF2155"
const nftAddress = "0x2d2b1310E029334eeaD85D1a33796c1b367e712C"
const SALE_CONTRACT = "0x765b6b2477cDd8cE419d9fF939BecbE3AC5FF04b"

async function main() {
    // connect signers
 const provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY )
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
const altWallet = new ethers.Wallet(process.env.PRIVATE_KEY2 ?? "")
const altSigner = altWallet.connect(provider);
 const signer = wallet.connect(provider);
   // deploy auction
   const auctionContractFactory = new Auction__factory(signer);
   const auctionContract = await auctionContractFactory.deploy(STARTING_BID, paymentToken, nftAddress, URI, altAddress, signer.address, CLOSING_TIME );
   await auctionContract.deployed();
   const closingTimeDate = new Date(CLOSING_TIME * 1000).toLocaleDateString(); 
   console.log(`auction conract deployed at ${auctionContract.address} and closes at ${closingTimeDate}`)
  
   // setup ERC20
   const TokenContract =  MyToken__factory.connect('0xc9269d42d7450d7c62038B301e2F9b4ed6DF2155', signer);
   const TokenAddress = TokenContract.address;
   // transfer tx to alt address
   const signerBalance = await TokenContract.balanceOf(signer.address);
   const transferTx = await TokenContract.connect(signer).transfer(altSigner.address, 100)
   await transferTx.wait();
   const altSignerBalance = await TokenContract.balanceOf(altSigner.address);
  
   console.log(`my balance is ${signerBalance} and the alt account has ${altSignerBalance}`);
  
   // place bid
  const BID_AMOUNT = 50
  
   const approveTx = await TokenContract.connect(altSigner).approve(auctionContract.address, BID_AMOUNT);
   await approveTx.wait();
   const bidTx = await auctionContract.connect(altSigner).bid(BID_AMOUNT);
   await bidTx.wait();
   console.log(bidTx.hash)
   console.log(`the highest bid is ${auctionContract.highestBid()} placed by ${auctionContract.highestBidder()}`);


// const CurrentAuctionContract = Auction__factory.connect('0x7C30ED446bac7F0462ea3D4D31914c3978aD9ABE', signer);

    console.log(Date.now())
    console.log(CLOSING_TIME)

     if (Date.now() > CLOSING_TIME) {
        const endTx = await auctionContract.end()
        await endTx.wait();
        console.log(`auction ended with ${endTx.hash} \n`)
        const endAuctionReceipt = await provider.getTransactionReceipt(endTx.hash)
    const decodedAuctionData = auctionIface.parseLog(endAuctionReceipt.logs[1])
    console.log(decodedAuctionData.args[1])
    
         }
     else {
        console.log('too early to end')
     }

 





}


main();