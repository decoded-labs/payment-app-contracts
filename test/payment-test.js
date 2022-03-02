const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payment", function () {
  it("Should add new balance", async function () {
    const Payment = await ethers.getContractFactory("Payment");
    console.log("got Contract Factory");
    const payment = await Payment.deploy();
    await payment.deployed();
    console.log("payment deployed");
    console.log(payment.address);


    const Mock20 = await ethers.getContractFactory("Mock20");
    console.log("got mock20 contract");
    const mock20Contract = Mock20.attach("0xe9e7cea3dedca5984780bafc599bd69add087d56");
    console.log("attached busd address to mock20 const");
    await mock20Contract.approve(payment.address, 1000);
    console.log("busd approved");

    
    const bonusMock20 = await ethers.getContractFactory("ERC20");
    const bonusERC20Contract = bonusMock20.attach("0x6AA217312960A21aDbde1478DC8cBCf828110A67");
    await bonusERC20Contract.approve(payment.address, 1000);

    const setNewBalance = await payment.addNewBalance("0xE13fC3A87F9890f6A7314f0789841c0E470ED08f", ethers.utils.parseEther("1"), 
    "0x6AA217312960A21aDbde1478DC8cBCf828110A67", ethers.utils.parseEther("100"));
    
    console.log("new balance is set");

    // wait until the transaction is mined
    await setNewBalance.wait();
    console.log("transaction is mined");

    expect(await payment.balanceOf("0xE13fC3A87F9890f6A7314f0789841c0E470ED08f")).to.equal(1);
  });
});
