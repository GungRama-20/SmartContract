import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SmartContractModule", (m) => {
  const smartToken = m.contract("SmartToken");
  const staking = m.contract("Staking", [smartToken]);

  return { smartToken, staking };
});
