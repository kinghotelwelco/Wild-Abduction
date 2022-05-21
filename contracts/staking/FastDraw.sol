// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Land.sol";
import "./interfaces/ILAND.sol";
import "./interfaces/ISeed.sol";

contract FastDraw is Ownable, Pausable {

   
    // land token
    IERC20 token;
    ILAND landToken;

    // total LAND won so far
    uint256 public landDistributed;

    // max LAND available to be distributed
    uint256 MAX_LAND;


    enum FAST_DRAW_STATE {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }

    // 0
    // 1
    // 2

    struct Wallet {
        address owner;
        uint256 balance;
    }

    // maps owner to wallet
    mapping(address => Wallet) public bank;

    event BalanceWithdraw(address owner, uint256 amount);
    event WalletFunded(address owner, uint256 amount);
    event BetLost(address owner, uint256 amount);
    event BetWon(address owner, uint256 amount);
    event TransferDone(address owner, uint256 amount);

    FAST_DRAW_STATE public fast_draw_state;

    address s_owner;

    constructor(
        address _land
    ) {
        fast_draw_state = FAST_DRAW_STATE.CLOSED;
        token = IERC20(_land);
        landToken = ILAND(_land);
        MAX_LAND = 750000000;
        landDistributed = 0;
    }


    // ** will stop people from funding wallet if they can't win anything anymore ** //

    
    function GetAllowance() public view returns(uint256){
        address sender = msg.sender;
       return token.allowance(sender, address(this));
   }

   function getDistributedLand() public view returns(uint256){
       return landDistributed;
   }

   function getUserBalance() public view returns(uint256){
       return bank[msg.sender].balance;
   }

    // add funds to balance to use for bets.
    function addToBalance(uint256 _amount) public payable {
        address sender = msg.sender;
        require(_amount >= 10000, "Minimum funding amount is 10,000 $LAND");
        require(_amount <= token.allowance(sender, address(this)), "Please approve tokens before transferring");
        require(_amount <= token.balanceOf(sender), "You do not have enough $LAND for this call");

        token.transferFrom(sender, address(this), _amount);

        uint256 currentBalance = bank[msg.sender].balance; // is this 0 if it doesnt exist?
        bank[msg.sender] = Wallet({
            owner: msg.sender,
            balance: currentBalance + _amount
        });

        emit WalletFunded(msg.sender, _amount);
    }

    function withdrawFromBalance(uint256 amount) public {
        require(amount > 0, "Please choose an amount greater than 0");
        require(bank[msg.sender].balance >= amount, "Insufficient funds");

        uint256 erc20balance = token.balanceOf(address(this));
        if (erc20balance < amount) {
            uint256 diff = amount - erc20balance;
            landToken.mint(msg.sender, diff);
        }

        transferERC20(msg.sender, erc20balance);
        

        bank[msg.sender].balance -= amount;
        emit BalanceWithdraw(msg.sender, amount);
    }

    
    function placeBet(uint256 amount) public {
        require(amount == 10000 || amount == 30000 || amount == 60000, "Invalid amount of LAND!");
        require(fast_draw_state == FAST_DRAW_STATE.OPEN, "Fast Draw is currently closed");
        require(bank[msg.sender].balance >= amount, "Please fund your wallet to participate");
        require(amount + landDistributed <= MAX_LAND, "Not enough LAND left to be distributed");

        uint256 randomNo = random(block.timestamp);

        if ((randomNo % 10) < 5) {
            bank[msg.sender].balance += amount;
            landDistributed += amount;
            emit BetWon(msg.sender, amount);

        } else {
            // burn LAND if you lose
            bank[msg.sender].balance -= amount;
            landToken.burn(address(this), amount); // contract is funded by this amount so it is safe to just burn it
            emit BetLost(msg.sender, amount);
        }

    }

    function startFastDraw() external onlyOwner {
        require(
            fast_draw_state == FAST_DRAW_STATE.CLOSED,
            "Can't start a new fast draw yet!"
        );
        fast_draw_state = FAST_DRAW_STATE.OPEN;
    }

    function endFastDraw() external onlyOwner {
        require(
            fast_draw_state == FAST_DRAW_STATE.OPEN,
            "Can't start a new fast draw yet!"
        );
        fast_draw_state = FAST_DRAW_STATE.CLOSED;
    }



    function transferERC20(address to, uint256 amount) private {
        uint256 erc20balance = token.balanceOf(address(this));
        require(amount <= erc20balance, "balance too low");
        token.transfer(to, amount);
    }

    /**
     * generates a pseudorandom number
     * @param seed a value ensure different outcomes for different sources in the same block
   * @return a pseudorandom value
   */
    function random(uint256 seed) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(
                tx.origin,
                blockhash(block.number - 1),
                block.timestamp,
                seed
            )));
    }
}