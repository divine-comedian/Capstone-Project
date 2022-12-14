import { ethers } from "ethers";
//import { ethers } from "hardhat";
import * as dotenv from 'dotenv';
dotenv.config()

import { SaleFactory__factory } from "../typechain-types";
//import { saleFactorySol } from "../typechain-types/contracts";
//import saleFactoryJson from '../artifacts/contracts/SaleFactory.sol/SaleFactory.json';

const ALCHEMY_API_KEY = "MwLDDsXrUc33uY_JtGf7si7uJbd0cyQy";

const saleDAIToken = "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60"; //DAI payment token
const OLD_SALE_CONTRACT = "0x650363a00584dc53c62188f41b25d0cfcd2d943d"; //works
const NEW_SALE_CONTRACT = "0x4d99e1f5742126c5af5ac29f89d6e0630c24315f"; //doesn't work


const JUNK_PRIVATE_KEY="PUT_YOUR_PRIVATE_HERE_TO_TEST";

async function main() {
    const provider = ethers.getDefaultProvider("goerli", { alchemy: ALCHEMY_API_KEY});
    const wallet = new ethers.Wallet(JUNK_PRIVATE_KEY);
    const signer = wallet.connect(provider)

    //const salesContractFactory = await ethers.getContractFactory("Lottery");
    const salesFactory = new SaleFactory__factory(signer);
    const saleFactoryContract = salesFactory.attach(NEW_SALE_CONTRACT);
    try {
        const bet_price = 11;
        const payment_token = '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60';
        const ipfs_url = 'https://gateway.pinata.cloud/ipfs/QmToWzBwMzws9NNyoPmskiR4ihPNaWkT31recGPRT8iw5c';
        const recipient_addr = '0xA2dd619dB59A3BDa94A39Ea3006396C7584294Ee';
        const converted_to_seconds_after_epoch = 1671026400;
        
        try {
            //const lottery_instance = await salesFactory['launchLottery']( bet_price, payment_token, ipfs_url, recipient_addr, converted_to_seconds_after_epoch );
            await saleFactoryContract['launchLottery']( bet_price, payment_token, ipfs_url, recipient_addr, converted_to_seconds_after_epoch );
        } catch (err) {
            console.log(err)
        }
        

    } catch(error) {
        console.log('error:'+ error);
        return 0;
    }    
    

 
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
/* 
for some reason my box likes yarn more than npm for running typescript ts-node commands:

//install dependencies
yarn install

//make the /typechain files so can use in launchSale
yarn hardhat clean && yarn hardhat compile //creates /typechain/ files so can use Factory

if on windows:
yarn ts-node .\scripts\launchSale.ts 
if on unix?
yarn ts-node ./scripts/launchSale.ts 
*/