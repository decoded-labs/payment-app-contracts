const { expect } = require("chai");
const { ethers } = require("hardhat");
const { constants } = require("ethers");

describe("Payment", function () {
  it("Should add new balance", async function () {
    // get the signer address (our deployer acc if we've added it in hardhatconfig beforehand)
    const [owner] = await ethers.getSigners();
    const [receiver] = await ethers.getSigners();

    // give some native currency to owner acc (fake)
    await network.provider.send("hardhat_setBalance", [
      owner.address,
      "0xfffffffffffffffffffffffffff",
    ]);

    // deploy mock contracts for busd and bonus
    const Mock20 = await ethers.getContractFactory("Mock20");
    const mock20 = await Mock20.deploy("bUSD mock", "bUSDm");
    const BonusMock20 = await ethers.getContractFactory("Mock20");
    const bonusMock20 = await BonusMock20.deploy("bonus mock", "SpinM");

    const Payment = await ethers.getContractFactory("Payment");
    // here we use mock20 as the payment token while deploying.
    const payment = await Payment.deploy(mock20.address, bonusMock20.address, receiver.address);
    await payment.deployed();
    console.log("Payment contract: ", payment.address);

    // approvals for both tokens
    await mock20.approve(payment.address, constants.MaxUint256);
    await bonusMock20.approve(payment.address, constants.MaxUint256);

    // we use parseEther to convert it to BigNumber and formatEther to read from BigNumber
    const setNewBalance = await payment.addNewBalance(
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("2")
    );

    // lets test!
    expect(await payment.balanceOf()).to.equal(
      ethers.utils.parseEther("1")
    );
    expect(await setNewBalance).to.emit(payment, 'NewBalanceAdded')
    .withArgs(receiver.address, ethers.utils.parseEther("1")
    );
    expect(await payment.bonusBalanceOf()).to.equal(
      ethers.utils.parseEther("2")
    );
    expect(await setNewBalance).to.emit(payment, 'BonusBalanceAdded')
    .withArgs(bonusMock20.address, ethers.utils.parseEther("2")
    );
  });
});