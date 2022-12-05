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

    IERC721 public nft;
    uint public nftId;
    IERC20 public paymentToken;
    address public beneficiary;
    uint public endAt;
    bool public started;
    bool public ended;
    address public saleOwner;

    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public bids;

    constructor(
        uint _startingBid,
        address _paymentToken,
        address _nft,
        uint _nftId,
        address _recipient
    ) {
        nft = IERC721(_nft);
        nftId = _nftId;
        paymentToken = IERC20(_paymentToken);
        highestBid = _startingBid;
        beneficiary = _recipient;
    }

    function start() external {
        require(!started, "started");
        require(msg.sender == saleOwner, "not saleOwner");
        started = true;
        endAt = block.timestamp + 7 days;

        emit Start();
    }

    function bid(uint256 amount) external payable {
        require(started, "not started");
        require(block.timestamp < endAt, "ended");
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
        require(started, "not started");
        require(block.timestamp >= endAt, "not ended");
        require(!ended, "ended");

        ended = true;
        if (highestBidder != address(0)) {
            nft.safeTransferFrom(address(this), highestBidder, nftId);
            paymentToken.transfer(beneficiary, highestBid);
        } else {
            nft.safeTransferFrom(address(this), saleOwner, nftId);
        }

        emit End(highestBidder, highestBid);
    }
}
