// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import {Auction} from "./Auction.sol";
import {Lottery} from "./Lottery.sol";



interface IERC721 {
    function grantRole(bytes32 role, address account) external;
}

contract SaleFactory is Ownable {
    event SaleCreated(address saleAddress, string typeOfSale, address saleOwner, string nftURI);
    Auction auction;
    Lottery lottery;
    address public nftAddress;
    IERC721 public nft;

    constructor(
        address _nft
        
    ){
        nft = IERC721(_nft);
        nftAddress = _nft;
    }
/// Launch Lottery sale
///@param betPrice this is the price in WEI each user will pay to place a bet 
///@param paymentToken the address of the ERC20 token you will accept betPrice in
///@param uri the CID of the nft metadata
///@param recipient the address of the recipient/charity that will receive the raised sale funds 
///@param closingTime the unix timestamp of when the launched sale will end

 function launchLottery(uint256 betPrice,
        address paymentToken,
        string memory uri,
        address recipient,
        uint256 closingTime  

        ) external {
            address saleOwner = msg.sender;
            lottery = new Lottery(betPrice, paymentToken, nftAddress, uri, recipient, saleOwner, closingTime);
          emit SaleCreated(address(lottery), 'lottery', saleOwner, uri);
          // need to give minter role to new sale contract !
          nft.grantRole(keccak256('MINTER_ROLE'), address(lottery));
        }

// launch Auction Sale 
///@param startingBid the initial bid price in WEI to begin your auction at 
///@param paymentToken the address of the ERC20 token you will accept betPrice in
///@param uri the CID of the nft metadata
///@param recipient the address of the recipient/charity that will receive the raised sale funds 
///@param closingTime the unix timestamp of when the launched sale will end
function launchAuction(uint startingBid,
        address paymentToken,
        string memory uri,
        address recipient,
        uint256 closingTime  
        ) external {
            address saleOwner = msg.sender;
            auction = new Auction(startingBid, paymentToken, nftAddress, uri, recipient, saleOwner, closingTime);
          emit SaleCreated(address(auction), 'auction', saleOwner, uri);
            nft.grantRole(keccak256('MINTER_ROLE'), address(auction));

        }
 // set a new base NFT contract to mint your sale nfts from
 ///@param newAddress the address of the nft contract to mint your nfts from
 function setNFT(address newAddress) external onlyOwner {
     nft = IERC721(newAddress);
     nftAddress = newAddress; 
     } 
}