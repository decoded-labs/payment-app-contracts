// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Payment {

//functionality:
//Anybody deposit erc20 -> interface tokens (bUSD -> address)
//X withdraws deposited amount
//Owner can add more balances(address -> allowance)
//create an event for every function

//variables
address public paymentToken = 0x4Fabb145d64652a948d72533023f6E7A623C7C53;
mapping(address => uint256) balances;

//constructor
// constructor (address _paymentToken) {
//     paymentToken = _paymentToken;
// }

//functions

//function to deposit
//updates balaces and adds amount to address given

//function to withdraw
//checks balances and then transfers erc20 to sender

}
