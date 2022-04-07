
const hre = require("hardhat");
const main = async () => {
  const Transact = await hre.ethers.getContractFactory("Transact");
  const transactions = await Transact.deploy();

  await transactions.deployed();

  console.log("Transactions address: ", transactions.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();