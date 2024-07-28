// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const AskAround = await hre.ethers.getContractFactory("AskAround");
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const askAround = await AskAround.deploy("0xAf790fABCf6253D1D621D1bdF04C94060Dc01B2E");

  await askAround.deployed();
  console.log("MessagingService contract deployed to:", askAround.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});