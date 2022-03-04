const hre = require("hardhat");

async function main() {
  const beneficiary = "0x73774102B7A588B31ED43d79903Ced2d48B543e3";
  const paymentToken = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
  let bonusToken = "0x6AA217312960A21aDbde1478DC8cBCf828110A67";

  // We get the contract to deploy

  const Payment = await hre.ethers.getContractFactory("Payment");
  const payment = await Payment.deploy(paymentToken, bonusToken, beneficiary);

  await payment.deployed();

  console.log("Payment deployed to:", payment.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
