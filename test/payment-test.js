const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payment", function () {
  it("Should approve adress", async function () {
    const Payment = await ethers.getContractFactory("Payment");
    console.log("got Contract Factory");
    const payment = await Payment.deploy();
    await payment.deployed();
    console.log("payment deployed");

    const approveNewToken = await payment.approve("0xE13fC3A87F9890f6A7314f0789841c0E470ED08f", ethers.utils.parseEther("1"));
    
    console.log("address approved");

    // wait until the transaction is mined
    await approveNewToken.wait();
    console.log("transaction is mined");

    // expect(await payment.approveNewToken(allowed[msg.sender][_spender]).to.equal(_amount));
  });
});

describe("Payment", function () {
  it("Should add new balance", async function () {
    const Payment = await ethers.getContractFactory("Payment");
    console.log("got Contract Factory");
    const payment = await Payment.deploy();
    await payment.deployed();
    console.log("payment deployed");

    const setNewBalance = await payment.addNewBalance("0xE13fC3A87F9890f6A7314f0789841c0E470ED08f", ethers.utils.parseEther("1"), 
    "0x6AA217312960A21aDbde1478DC8cBCf828110A67", ethers.utils.parseEther("50"));
    
    console.log("new balance is set");

    // wait until the transaction is mined
    await setNewBalance.wait();
    console.log("transaction is mined");

    expect(await payment.bonusBalanceOf("0xE13fC3A87F9890f6A7314f0789841c0E470ED08f")).to.equal(50);
  });
});
