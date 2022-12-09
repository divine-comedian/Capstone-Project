    // SPDX-License-Identifier: GPL-3.0
    pragma solidity >=0.8.0 <0.9.0;


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

        function safeMint(address to, string memory uri) external;

        function transferFrom(
            address,
            address,
            uint
        ) external;
    }
    /// @notice You can use this contract for running a very simple lottery
    /// @dev This contract implements a relatively weak randomness source
    contract Lottery {
    IERC20 public paymentToken;
        event Start(uint lotteryClosingTime);
        address public recipient;
        IERC721 public nft;
        string private nftData;
        uint256 public betPrice;
        uint256 public ownerPool;
        bool public betsOpen;
        uint256 public lotteryClosingTime;
        uint256 public window;
        address public saleOwner;
        address[] _slots;

        constructor(
            uint256 _betPrice,
            address _paymentToken,
            address _nft,
            string memory _uri,
            address _recipient,
            address _saleOwner
        ) {
            betPrice = _betPrice;
            paymentToken = IERC20(_paymentToken);
            nft = IERC721(_nft);
            nftData = _uri;
            recipient = _recipient;
            saleOwner = _saleOwner;
        }

        /// @notice Passes when the lottery is at closed state
        modifier whenBetsClosed() {
            require(!betsOpen, "Lottery is open");
            _;
        }

        /// @notice Passes when the lottery is at open state and the current block timestamp is lower than the lottery closing date
        modifier whenBetsOpen() {
            require(
                betsOpen && block.timestamp < lotteryClosingTime,
                "Lottery is closed"
            );
            _;
        }


        /// @notice Open the lottery for receiving bets
        /// @param closingTime the unix timestamp of when the lottery will close
        function openBets(uint256 closingTime) public whenBetsClosed {
            require(
                closingTime > block.timestamp,
                "Closing time must be in the future"
            );
            require(msg.sender == saleOwner);
            lotteryClosingTime = closingTime;
            betsOpen = true;
            emit Start(lotteryClosingTime);
        }


        /// @notice Charge the bet price and create a new bet slot with the sender address
        ///@notice we need to approve the user to spend the betPrice from the paymentToken to this contract
        function bet() public whenBetsOpen {
            ownerPool += betPrice;
            _slots.push(msg.sender);
            paymentToken.transferFrom(msg.sender, address(this), betPrice);
        }

        /// @notice Call the bet function `times` times
        ///@notice we need to approve the user to spend the betPrice * @param times from the paymentToken to this contract
        function betMany(uint256 times) public {
            require(times > 0);
            while (times > 0) {
                bet();
                times--;
            }
        }

        /// @notice Close the lottery and calculates the prize, if any
        /// @dev Anyone can call this function if the owner fails to do so
        /// @notice this will transfer the funds accrued from bets to the recipient/charity
        /// @notice this will mint the NFT to the winner with the nftData set at contract initilization
        function closeLottery() public {
            require(block.timestamp >= lotteryClosingTime, "Too soon to close");
            if (_slots.length > 0) {
                uint256 winnerIndex = getRandomNumber() % _slots.length;
                address winner = _slots[winnerIndex];
                paymentToken.transfer(recipient, ownerPool);
                // need to replace this with mint fuction
                nft.safeMint(winner, nftData);
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

    // Added function to get current blocktime + duration in hours

        function getBettingWindow(uint256 duration) public view returns(uint256) {
            
        return (block.timestamp + duration * 1 minutes);
        }
    }
