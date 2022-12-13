// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;


interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address beneficiary, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address beneficiary, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface IERC721 {
    function safeMint(address to, string memory uri) external;
    function renounceRole(bytes32 role, address account) external;
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

}

contract Auction {
    event Start(uint auctionClosingTime);
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner);
    event EndWithNoBids(string message);

    string private nftData;
    IERC721 public nft;
    IERC20 public paymentToken;
    address public beneficiary;
    address public saleOwner;
    address public highestBidder;
    address public saleWinner;
    bool public auctionOpen;
    uint public auctionClosingTime;
    uint256 private startingBid;
    uint256 public highestBid;
    mapping(address => uint) public bids;


    ///@notice this will simultanteously deploy the contract and begin the sale
    ///@param _startingBid the initial bidding price of the auction
    ///@param _paymentToken the ERC20 compatible token that users will use to place bids - funds are transferred and held in this contract
    ///@param _nft the address of the base nft contract that will mint the nft to be sold in this auction
    ///@param _uri the IPFS CID containing the complete metadata for the nft to be minted
    ///@param _saleOwner the address of the user who initiated the sale
    ///@param _closingTime the UNIX timestamp of when the sale will end 
    constructor(
        uint _startingBid,
        address _paymentToken,
        address _nft,
        string memory _uri,
        address _recipient,
        address _saleOwner,
        uint256 _closingTime
    ) {
        nft = IERC721(_nft);
        nftData = _uri;
        paymentToken = IERC20(_paymentToken);
        highestBid = _startingBid;
        beneficiary = _recipient;
        startingBid = _startingBid;
        saleOwner = _saleOwner;
        require(!auctionOpen, "started");
        require(
            _closingTime > block.timestamp,
            "Closing time must be in the future"
        );
        auctionOpen = true;
        auctionClosingTime = _closingTime;

        emit Start(auctionClosingTime);
    }
    ///@notice start the auction, auctionOpen must be false 
    /// this can only be started by the saleOwner
    ///@param closingTime the UNIX timestamp of when the auction will end - this must be a time ahead of the current timestamp
    function start(uint256 closingTime) public {
        require(!auctionOpen, "started");
        require(
            closingTime > block.timestamp,
            "Closing time must be in the future"
        );
        require(msg.sender == saleOwner, "not saleOwner");
        auctionOpen = true;
        auctionClosingTime = closingTime;

        emit Start(auctionClosingTime);
    }


    /// @notice the user must approve the amount in bid to the paymentToken from the UI before calling this function
    /// @param amount the amount to bid on the auction - this amount must be higher than the highestBid
    function bid(uint256 amount) public {
        require(auctionOpen, "not started");
        require(block.timestamp < auctionClosingTime, "auction has ended!");
        require(amount > highestBid, "bid amount must be higher than highest bid");
        paymentToken.transferFrom(msg.sender, address(this), amount);
        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = amount;

        emit Bid(msg.sender, amount);
    }
    ///@notice allows bidders to withdraw their bids if they are not the highest bidder
    function withdraw() public {
        require(msg.sender != highestBidder, "you are the highest bidder!");
        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
        paymentToken.transfer(msg.sender, bal);

        emit Withdraw(msg.sender, bal);
    }
    ///@dev anyone can end the auction in case the owner does not do so
    /// @notice this will transfer the funds accrued from bets to the recipient/charity
    /// @notice this will mint the NFT to the winner with the nftData set at contract initilization
    function end() public {
        require(auctionOpen, "not started");
        require(block.timestamp >= auctionClosingTime, "not ended");

        auctionOpen = false;
        if (highestBidder != address(0) && highestBid > startingBid) {
            // replace this with minting nFT directly to highest bidder
            nft.safeMint(highestBidder, nftData);
            nft.renounceRole( keccak256('MINTER_ROLE'), address(this));
            paymentToken.transfer(beneficiary, highestBid);
            saleWinner = highestBidder;
            emit End(highestBidder);
        }
        else {
            emit EndWithNoBids("no bids, restart the auction!");
        }
    }
}
