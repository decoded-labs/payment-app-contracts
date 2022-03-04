const { expect } = require("chai");
const { ethers } = require("hardhat");
const { constants } = require("ethers");

describe("Payment", () => {

  let receiver;
  let mock20;
  let bonusMock20;
  let payment;


  beforeEach(async () => {
    [receiver] = await ethers.getSigners();

    const Mock20 = await ethers.getContractFactory("Mock20");
    mock20 = await Mock20.deploy("bUSD mock", "bUSDm");
    const BonusMock20 = await ethers.getContractFactory("Mock20");
    bonusMock20 = await BonusMock20.deploy("bonus mock", "SpinM");

    const Payment = await ethers.getContractFactory("Payment");
    payment = await Payment.deploy(mock20.address, bonusMock20.address, receiver.address);
    await payment.deployed();
    console.log("Payment contract: ", payment.address);

    // approvals for both tokens
    await mock20.approve(payment.address, constants.MaxUint256);
    await bonusMock20.approve(payment.address, constants.MaxUint256);
  })

  it("Should add new balance", async function () {

    const setNewBalance = await payment.addNewBalance(
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("2")
    );

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

  it("Should claim all tokens", async function () {

    await payment.addNewBalance(
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("2")
    );
    
    const claimAll = await payment.claimTokens();

    expect(await payment.balanceOf()).to.equal(
      ethers.utils.parseEther("0")
    );
    expect(await claimAll).to.emit(payment, 'BalanceClaimed')
    .withArgs(receiver.address, ethers.utils.parseEther("1")
    );
    expect(await payment.bonusBalanceOf()).to.equal(
      ethers.utils.parseEther("0")
    );
    expect(await claimAll).to.emit(payment, 'BonusBalanceClaimed')
    .withArgs(receiver.address, ethers.utils.parseEther("2")
    );
  });
});
