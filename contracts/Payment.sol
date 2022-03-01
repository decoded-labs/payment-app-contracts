// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Payment is Ownable, ReentrancyGuard {

address public paymentToken = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
address public bonusToken;
mapping(address => uint256) balances;
mapping(address => uint256) bonusBalances;
mapping(address => mapping (address => uint256)) private allowed;

event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address owner, address spender, uint256 amount);

    function approve(address _spender, uint256 _amount) public {
        IERC20(paymentToken).approve(msg.sender, _amount);  
        console.log("token approved");
        allowed[msg.sender][_spender] = _amount;
        console.log("token added to allowed mapping");
        console.log(allowed[msg.sender][_spender]);
        emit Approval(msg.sender, _spender, _amount);
    }

    function addNewBalance(address _address, uint _balance, address _bonusTokenAddress, uint _bonusTokenAmount) public onlyOwner {


        balances[_address] += _balance;
        console.log("balance added");

        IERC20(paymentToken).transfer(address(this), _balance);
        console.log("tokens transfered");


        if (_bonusTokenAmount > 0) {
        bonusToken = _bonusTokenAddress;
        IERC20(bonusToken).approve(_address, _bonusTokenAmount);
        bonusBalances[_address] += _bonusTokenAmount;
        IERC20(bonusToken).transferFrom(msg.sender, address(this), _bonusTokenAmount);
        }
    }


    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
    
    function bonusBalanceOf(address account) external view returns (uint256) {
        return bonusBalances[account];
    }

    function claimTokens() external nonReentrant {
        uint _amount = balances[msg.sender];
        require(balances[msg.sender] > 0, "Cannot claim 0 tokens");
        IERC20(paymentToken).transfer(msg.sender, _amount);
        balances[msg.sender] -= _amount;

        if (bonusBalances[msg.sender] > 0) {
        uint _bonusAmount = bonusBalances[msg.sender];
        IERC20(bonusToken).transfer( msg.sender, _bonusAmount);
        bonusBalances[msg.sender] -= _bonusAmount;
        }
    }
}
