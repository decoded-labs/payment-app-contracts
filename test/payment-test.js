const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Payment", function () {
  it("Should add new balance", async function () {
    const Payment = await ethers.getContractFactory("Payment");
    console.log("got Contract Factory");
    const payment = await Payment.deploy();
    await payment.deployed();
    console.log("payment deployed");

    const setNewBalance = await payment.addNewBalance("0x73774102B7A588B31ED43d79903Ced2d48B543e3", 0, "0x6AA217312960A21aDbde1478DC8cBCf828110A67", 0);
    console.log("new balance is set");

    // wait until the transaction is mined
    await setNewBalance.wait();
    console.log("transaction is mined");

    expect(await payment.balanceOf("0x73774102B7A588B31ED43d79903Ced2d48B543e3")).to.equal(0);
  });
  
});
