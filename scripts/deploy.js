const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("═══════════════════════════════════════");
  console.log("  SmartContract DApp — Deploy Script");
  console.log("═══════════════════════════════════════");
  console.log(`Deploying with account: ${deployer.address}`);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);
  console.log("───────────────────────────────────────");

  // ── Deploy UserManagement ────────────────────────────────────────────
  console.log("\n[1/1] Deploying UserManagement...");
  const UserManagement = await ethers.getContractFactory("UserManagement");
  const userManagement = await UserManagement.deploy();
  await userManagement.waitForDeployment();
  const contractAddress = await userManagement.getAddress();
  console.log(`✅ UserManagement deployed at: ${contractAddress}`);

  console.log("\n───────────────────────────────────────");
  console.log("🎉 Contract deployed successfully!");
  console.log("───────────────────────────────────────");

  // ── Save address to frontend ─────────────────────────────────────────────
  const network = await ethers.provider.getNetwork();
  const addresses = {
    UserManagement: contractAddress,
    network: network.name === "unknown" ? "localhost" : network.name,
    chainId: Number(network.chainId),
    deployedAt: new Date().toISOString(),
  };

  const frontendConfigPath = path.join(__dirname, "../frontend/src/utils/contractAddresses.json");
  const dir = path.dirname(frontendConfigPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(frontendConfigPath, JSON.stringify(addresses, null, 2));
  console.log(`📁 Contract address saved to: frontend/src/utils/contractAddresses.json`);

  // ── Copy ABI to frontend ──────────────────────────────────────────────────
  const abiDir = path.join(__dirname, "../frontend/src/utils/abis");
  if (!fs.existsSync(abiDir)) fs.mkdirSync(abiDir, { recursive: true });

  const artifactPath = path.join(__dirname, "../artifacts/contracts/UserManagement.sol/UserManagement.json");
  if (fs.existsSync(artifactPath)) {
    const contractArtifact = require(artifactPath);
    fs.writeFileSync(
      path.join(abiDir, "UserManagement.json"),
      JSON.stringify(contractArtifact.abi, null, 2)
    );
    console.log("📁 ABI copied to: frontend/src/utils/abis/UserManagement.json");
  } else {
    console.log("⚠️ Warning: Artifact file not found. Ensure contracts are compiled first.");
  }

  console.log("\n✨ Setup complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
