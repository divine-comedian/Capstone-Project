// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import {Auction} from "./Auction.sol";
import {Lottery} from "./Lottery.sol";



interface IMemeFunderNFT {
    function grantRole(bytes32 role, address account) external;
}

contract SaleFactory is Ownable {
    event SaleCreated(address saleAddress, string typeOfSale, address saleOwner, string nftURI);
    Auction auction;
    Lottery lottery;
    address public nftAddress;
    IMemeFunderNFT public nft;

    constructor(
        address _nft
        
    ){
        nft = IMemeFunderNFT(_nft);
        nftAddress = _nft;
    }
 function launchLottery(uint256 betPrice,
        address paymentToken,
        string memory uri,
        address recipient
        ) external {
            address saleOwner = msg.sender;
            lottery = new Lottery(betPrice, paymentToken, nftAddress, uri, recipient, saleOwner);
          emit SaleCreated(address(lottery), 'lottery', saleOwner, uri);
          // need to give minter role to new sale contract !
          nft.grantRole(keccak256('MINTER_ROLE'), address(lottery));
        }


function launchAuction(uint startingBid,
        address paymentToken,
        string memory uri,
        address recipient   
        ) external {
            address saleOwner = msg.sender;
            auction = new Auction(startingBid, paymentToken, nftAddress, uri, recipient, saleOwner);
          emit SaleCreated(address(auction), 'auction', saleOwner, uri);
            nft.grantRole(keccak256('MINTER_ROLE'), address(auction));

        }
        // how can we set a new base nft address?
 function setNFT(address newAddress) external onlyOwner {
     nft = IMemeFunderNFT(newAddress);
     nftAddress = newAddress; 
     } 
}