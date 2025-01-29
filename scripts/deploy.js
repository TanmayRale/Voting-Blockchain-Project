// const hre = require("hardhat");

// async function main() {
//     const Voting = await hre.ethers.deployContract("Voting");
//     await Voting.waitForDeployment();
//     console.log("Voting contract deployed to:", Voting.target);
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });


// const hre = require("hardhat");

// async function main() {
//     const PartyRegistry = await hre.ethers.deployContract("PartyRegistry");

//     await PartyRegistry.waitForDeployment();
    
//     console.log("PartyRegistry deployed to:", PartyRegistry.target);
// }
// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });


// const hre = require("hardhat");

// async function main() {
//     const Voting = await hre.ethers.deployContract("Voting");

//     await Voting.waitForDeployment();

//     console.log("Voting contract deployed to:", Voting.target);
// }

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });

const hre = require("hardhat");

async function main() {
  // Compile contracts before deploying
  console.log("Compiling contracts...");
  await hre.run("compile");

  // Deploy the Voting contract
  console.log("Deploying Voting contract...");
  const Voting = await hre.ethers.deployContract("Voting");

  // Wait for the deployment to complete
  await Voting.waitForDeployment();

  // Retrieve the deployed contract address
  const contractAddress = Voting.target;
  console.log("Voting contract deployed successfully to:", contractAddress);

  // Additional: Log the deployer's address and the network used
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Network:", hre.network.name);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });

// async function main() {
//   const [deployer] = await ethers.getSigners();

//   console.log("Deploying contract with the account:", deployer.address);

//   // Deploy the Voting contract
//   const VotingContract = await ethers.getContractFactory("Voting");
//   const voting = await VotingContract.deploy();

//   // Wait for deployment
//   await voting.deployed();

//   console.log("Contract deployed to:", voting.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
