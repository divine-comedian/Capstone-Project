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
    function safeTransferFrom(
        address from,
        address to,
        uint tokenId
    ) external;

    function safeMint(address to, string memory uri) external;

    function transferFrom(
        address,
        address,
        uint
    ) external;
}

contract Auction {
    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);
    event EndWithNoBids(string message);

    string private nftData;
    IERC721 public nft;
    IERC20 public paymentToken;
    address public beneficiary;
    address public saleOwner;
    address public highestBidder;
    bool public auctionOpen;
    uint public auctionClosingTime;
    uint256 private startingBid;
    uint256 public highestBid;
    mapping(address => uint) public bids;

    constructor(
        uint _startingBid,
        address _paymentToken,
        address _nft,
        string memory _uri,
        address _recipient,
        address _saleOwner
    ) {
        nft = IERC721(_nft);
        nftData = _uri;
        paymentToken = IERC20(_paymentToken);
        highestBid = _startingBid;
        beneficiary = _recipient;
        startingBid = _startingBid;
        saleOwner = _saleOwner;
    }

    function start(uint256 closingTime) external {
        require(!auctionOpen, "started");
        require(
            closingTime > block.timestamp,
            "Closing time must be in the future"
        );
        require(msg.sender == saleOwner, "not saleOwner");
        auctionOpen = true;
        auctionClosingTime = closingTime;

        emit Start();
    }

    function bid(uint256 amount) external payable {
        require(auctionOpen, "not started");
        require(block.timestamp < auctionClosingTime, "ended");
        require(amount > highestBid, "value < highest");
        paymentToken.approve(address(this), amount);
        paymentToken.transferFrom(msg.sender, address(this), amount);
        if (highestBidder != address(0)) {
            bids[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = amount;

        emit Bid(msg.sender, amount);
    }

    function withdraw() external {
        uint bal = bids[msg.sender];
        bids[msg.sender] = 0;
        paymentToken.transfer(msg.sender, bal);

        emit Withdraw(msg.sender, bal);
    }

    function end() external {
        require(auctionOpen, "not started");
        require(block.timestamp >= auctionClosingTime, "not ended");

        auctionOpen = false;
        if (highestBidder != address(0) && highestBid > startingBid) {
            // replace this with minting nFT directly to highest bidder
            nft.safeMint(highestBidder, nftData);
            paymentToken.transfer(beneficiary, highestBid);
            emit End(highestBidder, highestBid);
        }
        else {
            emit EndWithNoBids("no bids, restart the auction!");
        }
    }
}
