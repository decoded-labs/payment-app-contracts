// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Payment{

//functionality:
//Anybody deposit erc20 -> interface tokens (bUSD -> address)
//X withdraws deposited amount
//Owner can add more balances(address -> allowance)
//create an event for every function

//variables
address public paymentToken = 0x4Fabb145d64652a948d72533023f6E7A623C7C53;
address public owner;
mapping(address => uint256) balances;
mapping(address => mapping(address => uint256)) private allowances;

constructor() {
    owner = msg.sender;
}

//function to deposit
//updates balaces and adds amount to address given
    function transferTokens(address _to, uint256 _amount) external returns (bool) {
        _to = address(this);
        IERC20(paymentToken).transfer(_to, _amount);
        return true;
    }


//function to withdraw
//checks balances and then transfers erc20 to sender (address that evokes function)
//function will be connected to "Claim all" button in front-end
    function claimTokens(address _from, address _to, uint256 _amount) external returns (bool) {
        _from =  address(this);
        IERC20(paymentToken).transferFrom(_from, _to, _amount);
        return true;
    }


}
