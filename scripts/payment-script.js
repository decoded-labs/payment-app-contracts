const hre = require("hardhat");

async function main() {
  const beneficiary;
  const paymentToken;
  let bonusToken;

  // We get the contract to deploy

  const Payment = await hre.ethers.getContractFactory("Payment");
  const payment = await Payment.deploy();

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
