// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const SPIN_DEPLOYER = "0x73774102B7A588B31ED43d79903Ced2d48B543e3";
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [SPIN_DEPLOYER],
  });
  await network.provider.send("hardhat_setBalance", [
    SPIN_DEPLOYER,
    "0xfffffffffffffffffffffffffff",
  ]);

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
