// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Payment is Ownable, ReentrancyGuard {

    address public paymentToken;
    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) _bonusBalances; //(user =>(tokenAddress => tokenAmount))
    mapping(address => mapping(address => uint256)) private _allowances;

    event NewBalanceAdded(address indexed balanceAddress, uint256 indexed amount);
    event BonusBalanceAdded(address indexed bonusTokenAddress, uint256 indexed bonusTokenAmount);
    event BalanceClaimed(address indexed ownerAddress, uint256 indexed amount);
    event BonusBalanceClaimed(address indexed ownerAddress, uint256 indexed bonusTokenAmount);

    constructor (address _paymentToken) {
        paymentToken = _paymentToken;
    }

    function allowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }

    function addNewBalance(address _address, uint _balance, address _bonusTokenAddress, uint _bonusTokenAmount) public onlyOwner {
        balances[_address] += _balance;
        IERC20(paymentToken).transferFrom(msg.sender, address(this), _balance);
        emit NewBalanceAdded(_address, _balance);
        
        if (_bonusTokenAmount > 0) {
            _bonusBalances[_address][_bonusTokenAddress] += _bonusTokenAmount;
            IERC20(_bonusTokenAddress).transferFrom(msg.sender, address(this), _bonusTokenAmount);
            emit BonusBalanceAdded(_bonusTokenAddress, _bonusTokenAmount);
        }
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
    
    function bonusBalanceOf(address userAccount, address bonusToken) public view
     returns (uint256) 
    {        
    return _bonusBalances[userAccount][bonusToken];    
    }

    function claimTokens() external nonReentrant {
        uint _amount = balances[msg.sender];
        require(balances[msg.sender] > 0, "Cannot claim 0 tokens");
        IERC20(paymentToken).transfer(msg.sender, _amount);
        balances[msg.sender] -= _amount;
        emit BalanceClaimed(msg.sender, _amount);

        if (_bonusBalances[msg.sender][_tokenAddress] > 0) {
        _bonusToken = _bonusBalances[msg.sender][_tokenAddress];
        uint _bonusAmount = _bonusBalances[msg.sender][_tokenAddress];
        IERC20(_bonusToken).transfer( msg.sender, _bonusAmount);
        _bonusBalances[msg.sender][_tokenAddress] -= _bonusAmount;
        emit BonusBalanceClaimed(msg.sender, _bonusAmount);
        }
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        Ownable.transferOwnership(newOwner);
    }
}