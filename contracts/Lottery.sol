// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface IERC721 {
    function safeTransferFrom(
        address from,
        address to,
        uint tokenId
    ) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;
}

/// @title A very simple lottery contract
/// @author Matheus Pagani
/// @notice You can use this contract for running a very simple lottery
/// @dev This contract implements a relatively weak randomness source
/// @custom:teaching This is a contract meant for teaching only
contract Lottery is Ownable {
    /// @notice Address of the token used as payment for the bets
  IERC20 public _token;
      address public recipient;
      IERC721 public nft;
    uint public nftId;
      /// @notice Amount of tokens given per ETH paid
    uint256 public betPrice;
    /// @notice Amount of tokens required for placing a bet that goes for the owner pool
    uint256 public ownerPool;
    /// @notice Flag indicating if the lottery is open for bets
    bool public betsOpen;
    /// @notice Timestamp of the lottery next closing date
    uint256 public betsClosingTime;
    /// @notice Mapping of prize available for withdraw for each account
    uint256 public window;
    address public saleOwner;

    /// @dev List of bet slots
    address[] _slots;

    /// @notice Constructor function
    /// @param _betPrice Amount of tokens required for placing a bet that goes for the prize pool
    constructor(
        uint256 _betPrice,
        address paymentToken,
        address _nft,
        uint _nftId,
        address _recipient

    ) {
        betPrice = _betPrice;
        _token = IERC20(paymentToken);
        nft = IERC721(_nft);
        nftId = _nftId;
        _recipient = recipient;
    }

    /// @notice Passes when the lottery is at closed state
    modifier whenBetsClosed() {
        require(!betsOpen, "Lottery is open");
        _;
    }

    /// @notice Passes when the lottery is at open state and the current block timestamp is lower than the lottery closing date
    modifier whenBetsOpen() {
        require(
            betsOpen && block.timestamp < betsClosingTime,
            "Lottery is closed"
        );
        _;
    }


    /// @notice Open the lottery for receiving bets
    function openBets(uint256 closingTime) public onlyOwner whenBetsClosed {
        require(
            closingTime > block.timestamp,
            "Closing time must be in the future"
        );
        betsClosingTime = closingTime;
        betsOpen = true;
    }


    /// @notice Charge the bet price and create a new bet slot with the sender address
    function bet() public whenBetsOpen {
        ownerPool += betPrice;
        _slots.push(msg.sender);
        _token.transferFrom(msg.sender, address(this), betPrice);
    }

    /// @notice Call the bet function `times` times
    function betMany(uint256 times) public {
        require(times > 0);
        while (times > 0) {
            bet();
            times--;
        }
    }

    /// @notice Close the lottery and calculates the prize, if any
    /// @dev Anyone can call this function if the owner fails to do so
    function closeLottery() public {
        require(block.timestamp >= betsClosingTime, "Too soon to close");
        if (_slots.length > 0) {
            uint256 winnerIndex = getRandomNumber() % _slots.length;
            address winner = _slots[winnerIndex];
             _token.transfer(recipient, ownerPool);
            nft.transferFrom(address(this), winner, nftId);
            delete (_slots);
            ownerPool = 0;
        }
        betsOpen = false;
    }

    /// @notice Get a random number calculated from the previous block randao
    /// @dev This only works after The Merge
    function getRandomNumber() public view returns (uint256 randomNumber) {
        randomNumber = block.difficulty;
    }

    /// @notice Withdraw `amount` from the owner pool
    function ownerWithdraw() public onlyOwner {
        _token.transfer(msg.sender, ownerPool);
        ownerPool = 0;
    }

    /// @notice Burn `amount` tokens and give the equivalent ETH back to user
  //  function returnTokens(uint256 amount) public {
  //      paymentToken.burnFrom(msg.sender, amount);
  //      payable(msg.sender).transfer(amount / purchaseRatio);
  //  }
// Added function to get current block time 
    function getCurrentTime() public view returns(uint) {
        return block.timestamp;
    }

// Added function to get current blocktime + duration in hours

    function getBettingWindow(uint256 duration) public view returns(uint256) {
        
       return (block.timestamp + duration * 1 minutes);
    }
}
