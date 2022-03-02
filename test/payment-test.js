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
    const mock20 = await Mock20.deploy("bUSD mock", "bUSDm") 

    const mock20Contract = mock20.attach("0xe9e7cea3dedca5984780bafc599bd69add087d56");
    await mock20Contract.approve(payment.address, 1000);

    const BonusMock20 = await ethers.getContractFactory("Mock20");
    const bonusMock20 = await BonusMock20.deploy("bonus mock", "SpinM") 

    const bonusMock20Contract = bonusMock20.attach("0x6AA217312960A21aDbde1478DC8cBCf828110A67");
    console.log("attached spin address to mock20 const");
    console.log("bonus mock contract address:" + bonusMock20Contract.address);
    await bonusMock20Contract.approve(payment.address, 1000);
    console.log("spin approved");

    const setNewBalance = await payment.addNewBalance("0xE13fC3A87F9890f6A7314f0789841c0E470ED08f", ethers.utils.parseEther("0.5"), 
    "0x6AA217312960A21aDbde1478DC8cBCf828110A67", ethers.utils.parseEther("10"));
    
    console.log("new balance is set");

    // wait until the transaction is mined
    await setNewBalance.wait();
    console.log("transaction is mined");

    expect(await payment.balanceOf("0xE13fC3A87F9890f6A7314f0789841c0E470ED08f")).to.equal(0.5);
  });
});
