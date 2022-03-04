// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Payment is Ownable, ReentrancyGuard {

    address public beneficiary;
    address public paymentToken;
    address public bonusToken;
    uint256 public bonusBalances;

    mapping(address => uint256) balances;

    event NewBalanceAdded(address indexed balanceAddress, uint256 indexed amount);
    event BonusBalanceAdded(address indexed bonusTokenAddress, uint256 indexed bonusTokenAmount);
    event BalanceClaimed(address indexed ownerAddress, uint256 indexed amount);
    event BonusBalanceClaimed(address indexed ownerAddress, uint256 indexed bonusTokenAmount);

    constructor (address _paymentToken, address _bonusToken, address _beneficiary) {
        paymentToken = _paymentToken;
        bonusToken = _bonusToken;
        beneficiary = _beneficiary;
    }

    modifier emptyBonusBalance() {
        if(bonusBalances > 0) {
            uint256 _bonusAmount = bonusBalances;
            bonusBalances = 0; 
            IERC20(bonusToken).transfer(beneficiary, _bonusAmount);
            _;
        }
    } 

    function addNewBalance(uint _balance, uint _bonusTokenAmount) public onlyOwner {
        balances[beneficiary] += _balance;
        IERC20(paymentToken).transferFrom(msg.sender, address(this), _balance);
        emit NewBalanceAdded(beneficiary, _balance);
        
        if (_bonusTokenAmount > 0) {
            bonusBalances += _bonusTokenAmount;
            IERC20(bonusToken).transferFrom(msg.sender, address(this), _bonusTokenAmount);
            emit BonusBalanceAdded(bonusToken, _bonusTokenAmount);
        }
    }

    function balanceOf() external view returns (uint256) {
        return balances[beneficiary];
    }
    
    function bonusBalanceOf() public view returns (uint256) {        
        return bonusBalances;    
    }

    function setBonusToken (address _newBonusToken) public onlyOwner emptyBonusBalance {
        bonusToken = _newBonusToken;
    }

    function claimTokens() external nonReentrant {
        uint _amount = balances[beneficiary];
        require(balances[beneficiary] > 0, "Cannot claim 0 tokens");
        IERC20(paymentToken).transfer(beneficiary, _amount);
        balances[beneficiary] -= _amount;
        emit BalanceClaimed(beneficiary, _amount);

        if (bonusBalances > 0) {
        uint256 _bonusAmount = bonusBalances;
        bonusBalances = 0;
        IERC20(bonusToken).transfer(beneficiary, _bonusAmount);
        emit BonusBalanceClaimed(beneficiary, _bonusAmount);
        }
    }
}