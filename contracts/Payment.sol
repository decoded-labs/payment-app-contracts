// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Payment is Ownable {

//functionality:
//Owner deposit erc20 -> interface tokens (bUSD -> address)
//X withdraws deposited amount (address must be in the balances mapping)
//create an event for every function

//variables
address public paymentToken = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
address public bonusToken;
mapping(address => uint256) balances;

    function addNewBalance(address _address, uint _balance, address _bonusTokenAddress, uint _bonusTokenAmount) public onlyOwner {
        balances[_address] += _balance;
        IERC20(paymentToken).transferFrom( msg.sender, address(this), _balance);
        bonusToken = _bonusTokenAddress;
        balances[_address] += _bonusTokenAmount;
        IERC20(bonusToken).transferFrom( msg.sender, address(this), _bonusTokenAmount);
    }
    
//function to withdraw
//checks balances and then transfers erc20 to sender (address that evokes function)
//function will be connected to "Claim all" button in front-end

    function claimTokens() external {
        uint _amount = balances[msg.sender];
        require(balances[msg.sender] > 0, "Cannot claim 0 tokens");
        IERC20(paymentToken).transfer( msg.sender, _amount);
        balances[msg.sender] -= _amount;
        IERC20(bonusToken).transfer( msg.sender, _amount);
        balances[msg.sender] -= _amount;
    }
}
