// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const MessagingService = await hre.ethers.getContractFactory("MessagingService");
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const messagingService = await MessagingService.deploy();

  await messagingService.deployed();
  console.log("MessagingService contract deployed to:", messagingService.address);
  console.log("send message: Self")
  const tx = await await messagingService.sendMessage(deployer.address, "this is demo message")
  await tx.wait()
  console.log("explore on corescan", tx.address);
  console.log("call getMyMessages() :", await messagingService.getMyMessages())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});