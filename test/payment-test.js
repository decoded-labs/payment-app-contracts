const { expect } = require("chai");
const { ethers } = require("hardhat");
const { constants } = require("ethers");

describe("Payment", function () {
  it("Should add new balance", async function () {
    // Rationale
    //
    // It makes it very cumbersome to try with real tokens in test environment.
    // so, I thought why not just create 2 mock contracts and do the test with them.

    // get the signer address (our deployer acc if we've added it in hardhatconfig beforehand)
    const [owner] = await ethers.getSigners();

    // give some native currency to owner acc (fake)
    await network.provider.send("hardhat_setBalance", [
      owner.address,
      "0xfffffffffffffffffffffffffff",
    ]);

    // deploy mock contracts for busd and bonus
    // @note Check the Mock20 as well please, I added minting to constructor.
    const Mock20 = await ethers.getContractFactory("Mock20");
    const mock20 = await Mock20.deploy("bUSD mock", "bUSDm");
    const BonusMock20 = await ethers.getContractFactory("Mock20");
    const bonusMock20 = await BonusMock20.deploy("bonus mock", "SpinM");

    // deploy payment contract using mock20 address
    // I added constructor to the contract and now we set the payment token while deploying.
    // @note see Payment.sol
    const Payment = await ethers.getContractFactory("Payment");

    // here we use mock20 as the payment token while deploying.
    const payment = await Payment.deploy(mock20.address);
    await payment.deployed();
    console.log("Payment contract: ", payment.address);

    // approvals for both tokens
    // I remembered wrong again it was ethers.utils.constants.MaxUint256 or like this below
    await mock20.approve(payment.address, constants.MaxUint256);
    await bonusMock20.approve(payment.address, constants.MaxUint256);

    // we use parseEther to convert it to BigNumber and formatEther to read from BigNumber
    const setNewBalance = await payment.addNewBalance(
      owner.address,
      ethers.utils.parseEther("1"),
      bonusMock20.address,
      ethers.utils.parseEther("2")
    );

    // lets test!
    expect(await payment.balanceOf(owner.address)).to.equal(
      ethers.utils.parseEther("1")
    );
    expect(await setNewBalance).to.emit(payment, 'NewBalanceAdded')
    .withArgs(owner.address, ethers.utils.parseEther("1")
    );
    expect(await payment.bonusBalanceOf(owner.address)).to.equal(
      ethers.utils.parseEther("2")
    );
    expect(await setNewBalance).to.emit(payment, 'BonusBalanceAdded')
    .withArgs(bonusMock20.address, ethers.utils.parseEther("2")
    );
  });
});