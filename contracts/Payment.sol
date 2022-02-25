// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Payment is Ownable {

//functionality:
//Anybody deposit erc20 -> interface tokens (bUSD -> address)
//X withdraws deposited amount
//Owner can add more balances(address -> allowance)
//create an event for every function

//variables
address public paymentToken = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
mapping(address => uint256) balances;

//function to withdraw
//checks balances and then transfers erc20 to sender (address that evokes function)
//function will be connected to "Claim all" button in front-end
    function claimTokens(uint256 _amount) external {
        require(balances[msg.sender] > 0, "Cannot claim 0 tokens");
        require(balances[msg.sender] >= _amount, "Cannot claim more than balance");
        IERC20(paymentToken).transfer( msg.sender, _amount);
        balances[msg.sender] -= _amount;
    }

    function addNewBalance(address _address, uint _balance) public onlyOwner {
        balances[_address] += _balance;
        IERC20(paymentToken).transferFrom( msg.sender, address(this), _balance);
    }

}
