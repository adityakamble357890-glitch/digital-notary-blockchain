const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment of DigitalNotary...");

  // Compile if not already compiled
  await hre.run("compile");

  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deploying with account:", deployer.address);

  // Deploy contract
  const DigitalNotary = await hre.ethers.getContractFactory("DigitalNotary");
  const notary = await DigitalNotary.deploy();

  await notary.waitForDeployment();
  const contractAddress = await notary.getAddress();

  console.log("✨ DigitalNotary deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network:", hre.network.name);

  // Save contract address and ABI for frontend integration
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/DigitalNotary.sol/DigitalNotary.json"
  );

  let abi = [];
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    abi = artifact.abi;
  }

  const frontendConfig = {
    contractAddress: contractAddress,
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
    deployedAt: new Date().toISOString(),
    abi: abi,
  };

  const configPath = path.join(__dirname, "../contract-config.json");
  fs.writeFileSync(configPath, JSON.stringify(frontendConfig, null, 2));
  console.log("💾 Frontend config saved to contract-config.json");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
