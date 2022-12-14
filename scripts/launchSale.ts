import { ethers } from "hardhat";
import * as readline from "readline";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"; 
import * as dotenv from 'dotenv' 
import { MyToken__factory, PixelsForPeaceNFT__factory, SaleFactory__factory } from "../typechain-types";
import { arrayify, Bytes, isBytes, keccak256, parseBytes32String } from "ethers/lib/utils";
import { saleFactorySol } from "../typechain-types/contracts";
dotenv.config()
import { BigNumberish } from "ethers";
import saleFactoryJson from '../artifacts/contracts/SaleFactory.sol/SaleFactory.json'

const saleFactoryIface = new ethers.utils.Interface(saleFactoryJson.abi)


const STARTING_BID = 30;
const URI = 'QmPrXKWKzNofkgZ236iufwxk3wt9L7hh6DUhihsfMZvpcC'
const CLOSING_TIME = 1671049852
const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000'
const altAddress = "0x06263e1A856B36e073ba7a50D240123411501611"
const paymentToken = "0xB7E278D569d43905BA750D92d842Af3a4ED732b6"
const NFT = "0xf88393630eF5396dCA0A92447C89615587428173"
const SALE_FACTORY_CONTRACT = "0x583349Df4dB7fbe7d08e086Fc07354C63Efd0e4A"
const GoerliDAI = "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60"

async function main() {
 const provider = new ethers.providers.AlchemyProvider('goerli', process.env.ALCHEMY_API_KEY )
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
 const signer = wallet.connect(provider)
// for testing in VM
//const provider = ethers.getDefaultProvider();
//const accounts = await ethers.getSigners();
//  const signer = accounts[0]; 
// // deploy example paymentToken
console.log(`I am connected to ${signer.address} \n`)
// const TokenContractFactory = new MyToken__factory(signer);
// const TokenContract = await TokenContractFactory.deploy()
// await TokenContract.deployed();
// const TokenAddress = TokenContract.address;
// const signerBalance = await TokenContract.balanceOf(signer.address);
// console.log(`example paymentToken was deployed at ${TokenAddress} and the signer has ${signerBalance} tokens\n`)
// 
// // deploy example NFT
//  const NFTContractFactory = new PixelsForPeaceNFT__factory(signer);
//  const NFTContract = await NFTContractFactory.deploy()
//  await NFTContract.deployed();
//  const NFTaddress = NFTContract.address
//  console.log(`NFT deployed at ${NFTContract.address} by ${signer.address} \n`)
// 
//  //deploy example sale contract
//  const saleContractFactory = new SaleFactory__factory(signer);
//  const saleContract = await saleContractFactory.deploy(NFTaddress)
//  await saleContract.deployed();
//  const saleContractAddress = saleContract.address;
//  console.log(`the sale contract was deployed to ${saleContractAddress} with the nft ${NFTaddress} \n`)
//   // grant admin role to sale contract for nft - to assign other minters 
//   const grantAdminTx = await NFTContract.grantRole(ethers.utils.arrayify(DEFAULT_ADMIN_ROLE), saleContractAddress);
//   await grantAdminTx.wait();
//   
//   const checkRole = await NFTContract.hasRole(ethers.utils.arrayify(DEFAULT_ADMIN_ROLE), saleContractAddress)
//    checkRole ? console.log(`sale contract has admin role? ${checkRole}`) : console.log(`sale conract does not have admin!`)
  // laucnch auction
  // if saleContract is already launched
    const saleContract = SaleFactory__factory.connect(SALE_FACTORY_CONTRACT, signer)
 const laucnLotteryTx = await saleContract.launchLottery(30, GoerliDAI, URI, altAddress, CLOSING_TIME);
 await laucnLotteryTx.wait()
 console.log(laucnLotteryTx.hash);
const launchAuctionReceipt = await provider.getTransactionReceipt(laucnLotteryTx.hash)
console.log(launchAuctionReceipt)
const launchAuctionLog = launchAuctionReceipt.logs[1].data;
console.log(`${launchAuctionLog} \n`)
let decodedAuctionData = saleFactoryIface.parseLog(launchAuctionReceipt.logs[1]);

console.log(decodedAuctionData.args[1])
    
 //    const mintTxReceipt = await provider.getTransactionReceipt(mintTx.hash)
 //    const mintTxLog =   mintTxReceipt.logs[0].topics[3]
 //    console.log(parseInt(mintTxLog));
// 
 // console.log(`my 1st NFT was minted to ${recipientAddress} with ID of ${parseInt(mintTxLog)} \n`)

 
}

main();


